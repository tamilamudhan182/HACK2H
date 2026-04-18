/**
 * Input sanitization utilities for all user-facing form fields.
 * Prevents XSS, injection, and malformed data from entering the app state.
 */

/**
 * Strips HTML tags and dangerous characters from a string.
 * @param {string} value - Raw user input.
 * @returns {string} Sanitized string safe for display and storage.
 */
export function sanitizeText(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[<>]/g, "") // strip HTML angle brackets
    .replace(/['"`;]/g, "") // strip quote injection characters
    .trim()
    .slice(0, 500); // enforce max length
}

/**
 * Validates and clamps a numeric amount for wallet top-up inputs.
 * @param {number|string} value - Raw amount input.
 * @param {number} [min=1] - Minimum allowed value.
 * @param {number} [max=10000] - Maximum allowed value.
 * @returns {number|null} Parsed, validated number or null if invalid.
 */
export function sanitizeAmount(value, min = 1, max = 10000) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < min || parsed > max) return null;
  return Math.round(parsed); // force integer
}

/**
 * Validates a queue ID against known safe format (alphanumeric + dash).
 * @param {string} id - The queue ID to validate.
 * @returns {boolean} True if safe, false if potentially malicious.
 */
export function validateQueueId(id) {
  if (typeof id !== "string") return false;
  return /^[a-zA-Z0-9-]{1,64}$/.test(id);
}

/**
 * Generates a simple CSRF token for form submissions.
 * In production this would be server-issued, but this provides
 * a client-side nonce pattern for single-page app requests.
 * @returns {string} A random hex token string.
 */
export function generateCsrfToken() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Simple audit log entry builder.
 * @param {string} action - Action performed (e.g. "wallet_topup").
 * @param {Object} payload - The sanitized data involved.
 * @returns {Object} Audit log entry with timestamp and action.
 */
export function buildAuditEntry(action, payload) {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    action,
    payload,
    timestamp: new Date().toISOString(),
    sessionId: sessionStorage.getItem("sessionId") ?? "anon",
  };
}
