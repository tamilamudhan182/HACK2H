import {
  buildAiAlert,
  buildQrToken,
  createWalletActivity,
  predictWaitMinutes,
  recommendRoute,
  selectRecommendations,
  suggestDepartureOption,
  clamp,
  getDensityTone,
} from "../src/utils/eventEngine.js";

import {
  sanitizeText,
  sanitizeAmount,
  validateQueueId,
  generateCsrfToken,
  buildAuditEntry,
} from "../src/utils/sanitize.js";

// ─── eventEngine.js tests ──────────────────────────────────────────────────

describe("clamp()", () => {
  test("returns value within bounds", () => expect(clamp(50, 0, 100)).toBe(50));
  test("clamps below minimum", () => expect(clamp(-10, 0, 100)).toBe(0));
  test("clamps above maximum", () => expect(clamp(200, 0, 100)).toBe(100));
});

describe("getDensityTone()", () => {
  test("returns clear for low density", () => expect(getDensityTone(30)).toBe("clear"));
  test("returns steady at 40", () => expect(getDensityTone(40)).toBe("steady"));
  test("returns busy at 60", () => expect(getDensityTone(60)).toBe("busy"));
  test("returns critical at 80", () => expect(getDensityTone(80)).toBe("critical"));
});

describe("predictWaitMinutes()", () => {
  const queue = { peopleAhead: 12, serviceMinutes: 2, counters: 2 };
  test("grows with crowd density", () => {
    const relaxed = predictWaitMinutes(queue, 35);
    const busy = predictWaitMinutes(queue, 90);
    expect(busy).toBeGreaterThan(relaxed);
  });
  test("is always within 3–45 minute range", () => {
    const wait = predictWaitMinutes(queue, 75);
    expect(wait).toBeGreaterThanOrEqual(3);
    expect(wait).toBeLessThanOrEqual(45);
  });
  test("handles zero counters without crashing", () => {
    const result = predictWaitMinutes({ ...queue, counters: 0 }, 50);
    expect(typeof result).toBe("number");
  });
});

describe("recommendRoute()", () => {
  const zones = [
    { label: "Exit Gate B", density: 72, riskScore: 68 },
    { label: "Exit Gate C", density: 38, riskScore: 22 },
    { label: "East Concourse", density: 52, riskScore: 41 },
  ];

  test("first path step is the destination in safety mode", () => {
    const route = recommendRoute({ destination: "Exit Gate C", zones, priority: "safety" });
    expect(route.path[0]).toBe("Exit Gate C");
  });

  test("returns confidence percentage as a string", () => {
    const route = recommendRoute({ destination: "Exit Gate B", zones, priority: "balanced" });
    expect(route.confidence).toMatch(/%$/);
  });

  test("ETA is between 4 and 12 minutes", () => {
    const route = recommendRoute({ destination: "Exit Gate C", zones, priority: "balanced" });
    expect(route.eta).toBeGreaterThanOrEqual(4);
    expect(route.eta).toBeLessThanOrEqual(12);
  });

  test("safety mode picks lower riskScore zone first", () => {
    const route = recommendRoute({ destination: "Exit", zones, priority: "safety" });
    expect(route.path[0]).toBe("Exit Gate C"); // riskScore 22 < 41 < 68
  });
});

describe("buildAiAlert()", () => {
  test("escalates emergency messaging", () => {
    const alert = buildAiAlert({ zoneName: "Exit Gate B", density: 91, alternateZone: "Exit Gate C", emergency: true });
    expect(alert).toMatch(/Emergency routing active/i);
    expect(alert).toMatch(/Exit Gate C/i);
  });

  test("returns advisory for crowded non-emergency zone", () => {
    const alert = buildAiAlert({ zoneName: "North Gate", density: 85, alternateZone: "East Concourse", emergency: false });
    expect(alert).toMatch(/North Gate/);
    expect(alert).toMatch(/East Concourse/);
  });

  test("returns steady message for low density", () => {
    const alert = buildAiAlert({ zoneName: "Food Court", density: 40, alternateZone: "East Concourse", emergency: false });
    expect(alert).toMatch(/steady/i);
  });
});

describe("createWalletActivity()", () => {
  test("prepends latest item to history", () => {
    const history = [{ id: "old" }];
    const updated = createWalletActivity(history, { id: "new" });
    expect(updated[0].id).toBe("new");
  });
  test("caps history at 6 items", () => {
    const history = Array.from({ length: 6 }, (_, i) => ({ id: `item-${i}` }));
    const updated = createWalletActivity(history, { id: "newest" });
    expect(updated.length).toBe(6);
    expect(updated[0].id).toBe("newest");
  });
});

describe("buildQrToken()", () => {
  test("is stable for identical payloads", () => {
    const payload = { userId: "attendee-27", venueId: "stadium-neo", channel: "multi" };
    expect(buildQrToken(payload)).toBe(buildQrToken(payload));
  });
  test("produces different tokens for different users", () => {
    const a = buildQrToken({ userId: "user-1", venueId: "stadium-neo", channel: "entry" });
    const b = buildQrToken({ userId: "user-2", venueId: "stadium-neo", channel: "entry" });
    expect(a).not.toBe(b);
  });
  test("token starts with SEC- prefix", () => {
    const token = buildQrToken({ userId: "u1", venueId: "v1", channel: "food" });
    expect(token).toMatch(/^SEC-/);
  });
});

describe("selectRecommendations()", () => {
  const catalog = [
    { id: "1", category: "Food", title: "Nachos", tags: ["vegetarian", "spicy"] },
    { id: "2", category: "Merch", title: "Cap", tags: ["classic"] },
    { id: "3", category: "Transport", title: "Metro", tags: ["sustainable"] },
  ];

  test("favors matching preference tags", () => {
    const results = selectRecommendations(catalog, ["vegetarian", "spicy"], 1);
    expect(results[0].id).toBe("1");
  });

  test("transport gets boosted even without preference match", () => {
    const results = selectRecommendations(catalog, ["classic"], 3);
    const ids = results.map((r) => r.id);
    expect(ids).toContain("3"); // transport has baseline score > 0
  });

  test("respects limit param", () => {
    const results = selectRecommendations(catalog, [], 2);
    expect(results.length).toBe(2);
  });
});

describe("suggestDepartureOption()", () => {
  const options = [
    { id: "metro", label: "Metro", travelMinutes: 18, crowdSensitivity: 0.45 },
    { id: "cab", label: "Cab", travelMinutes: 14, crowdSensitivity: 0.72 },
  ];
  const zones = [
    { type: "exit", density: 80 },
    { type: "exit", density: 60 },
  ];

  test("returns a bestOption", () => {
    const result = suggestDepartureOption(options, zones);
    expect(result.bestOption).toBeDefined();
    expect(result.bestOption.id).toMatch(/metro|cab/);
  });

  test("returns ranked options array", () => {
    const result = suggestDepartureOption(options, zones);
    expect(result.options.length).toBe(2);
  });
});

// ─── sanitize.js tests ─────────────────────────────────────────────────────

describe("sanitizeText()", () => {
  test("strips HTML angle brackets", () => {
    expect(sanitizeText("<script>alert(1)</script>")).not.toContain("<");
  });
  test("trims whitespace", () => {
    expect(sanitizeText("  hello  ")).toBe("hello");
  });
  test("returns empty string for non-string input", () => {
    expect(sanitizeText(null)).toBe("");
    expect(sanitizeText(undefined)).toBe("");
    expect(sanitizeText(42)).toBe("");
  });
  test("enforces 500 char max", () => {
    const long = "a".repeat(600);
    expect(sanitizeText(long).length).toBe(500);
  });
});

describe("sanitizeAmount()", () => {
  test("accepts valid amount", () => expect(sanitizeAmount(500)).toBe(500));
  test("rejects non-numeric input", () => expect(sanitizeAmount("abc")).toBeNull());
  test("rejects amount below minimum", () => expect(sanitizeAmount(0)).toBeNull());
  test("rejects amount above maximum", () => expect(sanitizeAmount(99999)).toBeNull());
  test("rounds to integer", () => expect(sanitizeAmount(49.9)).toBe(50));
});

describe("validateQueueId()", () => {
  test("accepts valid alphanumeric IDs", () => expect(validateQueueId("queue-food-1")).toBe(true));
  test("rejects IDs with special characters", () => expect(validateQueueId("queue; DROP TABLE")).toBe(false));
  test("rejects empty string", () => expect(validateQueueId("")).toBe(false));
  test("rejects non-string", () => expect(validateQueueId(null)).toBe(false));
});

describe("generateCsrfToken()", () => {
  test("returns a 32-char hex string", () => {
    const token = generateCsrfToken();
    expect(token).toMatch(/^[0-9a-f]{32}$/);
  });
  test("returns unique tokens each call", () => {
    expect(generateCsrfToken()).not.toBe(generateCsrfToken());
  });
});

describe("buildAuditEntry()", () => {
  test("includes action and timestamp", () => {
    const entry = buildAuditEntry("wallet_topup", { amount: 500 });
    expect(entry.action).toBe("wallet_topup");
    expect(entry.timestamp).toBeDefined();
    expect(entry.id).toMatch(/^audit-/);
  });
});
