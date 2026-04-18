import {
  buildAiAlert,
  buildQrToken,
  createWalletActivity,
  predictWaitMinutes,
  recommendRoute,
  selectRecommendations,
} from "../src/utils/eventEngine.js";

test("predictWaitMinutes grows with crowd density", () => {
  const queue = {
    peopleAhead: 12,
    serviceMinutes: 2,
    counters: 2,
  };

  const relaxed = predictWaitMinutes(queue, 35);
  const busy = predictWaitMinutes(queue, 90);

  expect(busy).toBeGreaterThan(relaxed);
});

test("recommendRoute prioritizes lower-risk exits in safety mode", () => {
  const zones = [
    { label: "Exit Gate B", density: 72, riskScore: 68 },
    { label: "Exit Gate C", density: 38, riskScore: 22 },
    { label: "East Concourse", density: 52, riskScore: 41 },
  ];

  const route = recommendRoute({
    destination: "Exit Gate C",
    zones,
    priority: "safety",
  });

  expect(route.path[0]).toBe("Exit Gate C");
});

test("buildAiAlert escalates emergency messaging", () => {
  const alert = buildAiAlert({
    zoneName: "Exit Gate B",
    density: 91,
    alternateZone: "Exit Gate C",
    emergency: true,
  });

  expect(alert).toMatch(/Emergency routing active/i);
  expect(alert).toMatch(/Exit Gate C/i);
});

test("wallet activity prepends latest item", () => {
  const history = [{ id: "old", label: "Old item" }];
  const updated = createWalletActivity(history, { id: "new", label: "New item" });

  expect(updated[0].id).toBe("new");
  expect(updated.length).toBe(2);
});

test("QR token generation is stable for identical payloads", () => {
  const first = buildQrToken({
    userId: "attendee-27",
    venueId: "stadium-neo",
    channel: "multi",
  });
  const second = buildQrToken({
    userId: "attendee-27",
    venueId: "stadium-neo",
    channel: "multi",
  });

  expect(first).toBe(second);
});

test("recommendations favor matching user preferences", () => {
  const recommendations = selectRecommendations(
    [
      { id: "1", category: "Food", title: "Nachos", tags: ["vegetarian", "spicy"] },
      { id: "2", category: "Merch", title: "Cap", tags: ["classic"] },
    ],
    ["vegetarian", "spicy"],
    1
  );

  expect(recommendations[0].id).toBe("1");
});
