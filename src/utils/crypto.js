/**
 * Client-side cryptography utilities using the Web Crypto API.
 *
 * Provides:
 *  - HMAC-SHA256 JWT-style token signing and verification
 *  - AES-GCM symmetric encryption for QR payload protection
 *  - Secure random key generation
 *
 * All operations are async and use the native SubtleCrypto interface —
 * no third-party crypto library needed.
 */

// ── Key derivation ─────────────────────────────────────────────────────────

/**
 * Derives a 256-bit HMAC key from a passphrase string.
 * Useful for creating consistent session-scoped signing keys.
 * @param {string} passphrase - A secret string (e.g. uid + session token).
 * @returns {Promise<CryptoKey>} An extractable HMAC-SHA256 key.
 */
export async function deriveHmacKey(passphrase) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(passphrase), { name: "PBKDF2" }, false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("smart-event-companion-salt"),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Generates a random 256-bit AES-GCM key for QR payload encryption.
 * @returns {Promise<CryptoKey>}
 */
export async function generateAesKey() {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

// ── JWT-style token signing ────────────────────────────────────────────────

/**
 * Creates a signed JWT-style token (Header.Payload.Signature) using HMAC-SHA256.
 * Not a full RFC 7519 JWT — intentionally lightweight for SPA session management.
 *
 * @param {Object} payload - Data to embed in the token.
 * @param {CryptoKey} key - HMAC key to sign with.
 * @returns {Promise<string>} The signed token string.
 */
export async function signToken(payload, key) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now() }));
  const data = `${header}.${body}`;

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${data}.${sigB64}`;
}

/**
 * Verifies a signed token and returns the decoded payload.
 * Returns null if the signature is invalid or the token is expired.
 *
 * @param {string} token - The token to verify.
 * @param {CryptoKey} key - The HMAC key used to sign.
 * @param {number} [maxAgeMs=3600000] - Max token age in ms (default 1h).
 * @returns {Promise<Object|null>} Decoded payload or null if invalid.
 */
export async function verifyToken(token, key, maxAgeMs = 3_600_000) {
  try {
    const [header, body, sigB64] = token.split(".");
    if (!header || !body || !sigB64) return null;

    const data = `${header}.${body}`;
    const signatureBytes = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));

    const valid = await crypto.subtle.verify("HMAC", key, signatureBytes, new TextEncoder().encode(data));
    if (!valid) return null;

    const payload = JSON.parse(atob(body));

    // Expiry check
    if (Date.now() - payload.iat > maxAgeMs) return null;

    return payload;
  } catch {
    return null;
  }
}

// ── AES-GCM QR encryption ──────────────────────────────────────────────────

/**
 * Encrypts a QR payload string using AES-GCM.
 * Returns a base64-encoded ciphertext with embedded IV.
 *
 * @param {string} plaintext - The raw QR payload to encrypt.
 * @param {CryptoKey} key - The AES-GCM key.
 * @returns {Promise<string>} Base64-encoded "iv:ciphertext" string.
 */
export async function encryptQrPayload(plaintext, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);

  const ivB64 = btoa(String.fromCharCode(...iv));
  const ctB64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
  return `${ivB64}:${ctB64}`;
}

/**
 * Decrypts a QR payload string encrypted with encryptQrPayload.
 *
 * @param {string} encrypted - Base64-encoded "iv:ciphertext" string.
 * @param {CryptoKey} key - The AES-GCM key used to encrypt.
 * @returns {Promise<string|null>} Decrypted plaintext or null on failure.
 */
export async function decryptQrPayload(encrypted, key) {
  try {
    const [ivB64, ctB64] = encrypted.split(":");
    const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0));
    const ciphertext = Uint8Array.from(atob(ctB64), (c) => c.charCodeAt(0));

    const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
    return new TextDecoder().decode(plaintext);
  } catch {
    return null;
  }
}

// ── Utility ────────────────────────────────────────────────────────────────

/**
 * Exports an AES-GCM CryptoKey as a base64 string for storage.
 * @param {CryptoKey} key
 * @returns {Promise<string>}
 */
export async function exportKey(key) {
  const raw = await crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

/**
 * Imports an AES-GCM key from a base64 string.
 * @param {string} b64Key
 * @returns {Promise<CryptoKey>}
 */
export async function importAesKey(b64Key) {
  const raw = Uint8Array.from(atob(b64Key), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
}
