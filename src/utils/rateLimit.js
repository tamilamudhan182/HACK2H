/**
 * Client-side rate limiter utility.
 *
 * Prevents rapid repeated actions (wallet top-ups, queue joins, reward logs)
 * from spamming state or future API endpoints.
 *
 * Uses a sliding window algorithm keyed by action name.
 */

/** @type {Map<string, number[]>} Action name → array of timestamps */
const actionWindows = new Map();

/**
 * Checks whether an action is within rate limits and records the attempt.
 *
 * @param {string} action - Unique action identifier (e.g. "wallet_topup").
 * @param {number} [maxCalls=5] - Maximum allowed calls within the window.
 * @param {number} [windowMs=10000] - Sliding window size in milliseconds.
 * @returns {{ allowed: boolean, remaining: number, retryAfterMs: number }}
 */
export function checkRateLimit(action, maxCalls = 5, windowMs = 10_000) {
  const now = Date.now();
  const timestamps = (actionWindows.get(action) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= maxCalls) {
    const oldest = timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: windowMs - (now - oldest),
    };
  }

  timestamps.push(now);
  actionWindows.set(action, timestamps);

  return {
    allowed: true,
    remaining: maxCalls - timestamps.length,
    retryAfterMs: 0,
  };
}

/**
 * Resets the rate limit window for a specific action.
 * Useful in test environments.
 * @param {string} action
 */
export function resetRateLimit(action) {
  actionWindows.delete(action);
}

/**
 * Clears all rate limit windows.
 */
export function clearAllRateLimits() {
  actionWindows.clear();
}

/**
 * Returns a human-readable retry message.
 * @param {number} retryAfterMs
 * @returns {string}
 */
export function formatRetryMessage(retryAfterMs) {
  const seconds = Math.ceil(retryAfterMs / 1000);
  return `Too many requests. Please wait ${seconds}s before trying again.`;
}
