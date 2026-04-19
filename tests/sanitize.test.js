import { sanitizeText, sanitizeAmount, validateQueueId, buildAuditEntry } from "../src/utils/sanitize";

describe("sanitizeText()", () => {
  test("strips angle brackets and trims whitespace", () => {
    // sanitizeText strips < > chars (not full tags) and trims
    const input = "   <script>Hello</script>   ";
    const result = sanitizeText(input);
    // angle brackets removed, quotes stripped, trimmed
    expect(result).toBe("scriptHello/script");
  });

  test("strips quote injection characters", () => {
    const result = sanitizeText("drop'; table users;");
    expect(result).not.toContain("'");
    expect(result).not.toContain(";");
  });
});

describe("sanitizeAmount()", () => {
  test("accepts valid range", () => {
    expect(sanitizeAmount(500, 1, 1000)).toBe(500);
  });
  test("rejects out of range", () => {
    expect(sanitizeAmount(0, 1, 1000)).toBeNull();
    expect(sanitizeAmount(2000, 1, 1000)).toBeNull();
  });
});

describe("validateQueueId()", () => {
  test("accepts alphanumeric with dash", () => {
    expect(validateQueueId("queue-123")).toBe(true);
  });
  test("rejects invalid characters", () => {
    expect(validateQueueId("queue<>"))
      .toBe(false);
  });
});

describe("buildAuditEntry()", () => {
  test("returns an object with action and timestamp", () => {
    // buildAuditEntry returns a plain object, not a JSON string
    const entry = buildAuditEntry("test_action", { foo: "bar" });
    expect(entry.action).toBe("test_action");
    expect(entry.payload.foo).toBe("bar");
    expect(entry.timestamp).toBeDefined();
    expect(entry.id).toMatch(/^audit-/);
  });

  test("includes a unique id per call", () => {
    const a = buildAuditEntry("a", {});
    const b = buildAuditEntry("b", {});
    expect(a.id).not.toBe(b.id);
  });
});
