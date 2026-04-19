import { checkRateLimit, resetRateLimit, clearAllRateLimits, formatRetryMessage } from "../src/utils/rateLimit.js";

describe("checkRateLimit()", () => {
  beforeEach(() => clearAllRateLimits());

  test("allows actions within the limit", () => {
    const result = checkRateLimit("test_action", 3, 10_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  test("blocks after exceeding max calls", () => {
    checkRateLimit("burst", 3, 10_000);
    checkRateLimit("burst", 3, 10_000);
    checkRateLimit("burst", 3, 10_000);
    const blocked = checkRateLimit("burst", 3, 10_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  test("different action names have separate windows", () => {
    checkRateLimit("action_a", 1, 10_000);
    checkRateLimit("action_a", 1, 10_000); // this is blocked
    const result = checkRateLimit("action_b", 1, 10_000); // different action
    expect(result.allowed).toBe(true);
  });

  test("resetRateLimit clears a specific window", () => {
    checkRateLimit("reset_me", 1, 10_000);
    checkRateLimit("reset_me", 1, 10_000); // blocked
    resetRateLimit("reset_me");
    const result = checkRateLimit("reset_me", 1, 10_000);
    expect(result.allowed).toBe(true);
  });

  test("returns retryAfterMs > 0 when blocked", () => {
    checkRateLimit("retry_ms", 2, 10_000);
    checkRateLimit("retry_ms", 2, 10_000);
    const blocked = checkRateLimit("retry_ms", 2, 10_000);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
    expect(blocked.retryAfterMs).toBeLessThanOrEqual(10_000);
  });
});

describe("formatRetryMessage()", () => {
  test("returns a string with seconds", () => {
    const msg = formatRetryMessage(3500);
    expect(msg).toMatch(/4s/);
  });
  test("rounds up to nearest second", () => {
    expect(formatRetryMessage(1001)).toMatch(/2s/);
  });
});
