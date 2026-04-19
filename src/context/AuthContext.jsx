/**
 * AuthContext — JWT-signed authentication with Web Crypto HMAC-SHA256.
 *
 * Sign-in flow:
 * 1. Google OAuth resolves a user object (real Firebase or stub).
 * 2. An HMAC-SHA256 JWT is signed using a key derived from the user's UID.
 * 3. The signed token is stored in sessionStorage.
 * 4. On every app boot, the stored token is verified before restoring session.
 * 5. An audit log entry is emitted for every sign-in and sign-out.
 *
 * To activate real Firebase: set all VITE_FIREBASE_* keys in .env.
 */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { signInWithGoogle, signOutUser } from "../services/firebase";
import { buildAuditEntry, generateCsrfToken } from "../utils/sanitize";
import { deriveHmacKey, signToken, verifyToken } from "../utils/crypto";
import { checkRateLimit, formatRetryMessage } from "../utils/rateLimit";

const AuthContext = createContext(null);

const TOKEN_KEY = "sec_jwt";
const CSRF_KEY = "sec_csrf";

/**
 * Provides JWT-verified auth state to the entire application.
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  /** @type {string} Active CSRF token for this session */
  const [csrfToken, setCsrfToken] = useState(() => {
    const stored = sessionStorage.getItem(CSRF_KEY);
    if (stored) return stored;
    const fresh = generateCsrfToken();
    sessionStorage.setItem(CSRF_KEY, fresh);
    return fresh;
  });

  // ── Restore session on boot ──────────────────────────────────────────────
  useEffect(() => {
    async function restoreSession() {
      const storedToken = sessionStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        // Re-derive key from stored uid embedded in the token payload
        const [, body] = storedToken.split(".");
        const { uid } = JSON.parse(atob(body));
        if (!uid) throw new Error("missing uid");

        const key = await deriveHmacKey(uid);
        const payload = await verifyToken(storedToken, key);

        if (payload) {
          setUser({ uid: payload.uid, displayName: payload.displayName, email: payload.email });
        } else {
          // Token expired or tampered
          sessionStorage.removeItem(TOKEN_KEY);
        }
      } catch {
        sessionStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  // ── Sign in ──────────────────────────────────────────────────────────────
  /**
   * Initiates Google OAuth sign-in, then signs a JWT for session persistence.
   * Rate-limited to 5 attempts per 10 seconds.
   * @returns {Promise<void>}
   */
  const signIn = useCallback(async () => {
    const { allowed, retryAfterMs } = checkRateLimit("sign_in", 5, 10_000);
    if (!allowed) {
      setError(formatRetryMessage(retryAfterMs));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      if (!result.user) return; // user cancelled popup

      const userData = result.user;

      // Sign a JWT using the user's UID as the key material
      const key = await deriveHmacKey(userData.uid);
      const token = await signToken(
        { uid: userData.uid, displayName: userData.displayName, email: userData.email },
        key
      );

      sessionStorage.setItem(TOKEN_KEY, token);

      // Rotate CSRF token on every sign-in
      const newCsrf = generateCsrfToken();
      sessionStorage.setItem(CSRF_KEY, newCsrf);
      setCsrfToken(newCsrf);

      if (!sessionStorage.getItem("sessionId")) {
        sessionStorage.setItem("sessionId", crypto.randomUUID?.() ?? Date.now().toString());
      }

      setUser(userData);
      console.info("[Audit]", buildAuditEntry("sign_in", { uid: userData.uid }));
    } catch (err) {
      setError("Sign-in failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Sign out ─────────────────────────────────────────────────────────────
  /**
   * Clears the session, rotates the CSRF token, and signs out.
   * @returns {Promise<void>}
   */
  const signOut = useCallback(async () => {
    console.info("[Audit]", buildAuditEntry("sign_out", {}));
    await signOutUser();
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem("sessionId");

    // Always issue a fresh CSRF token after sign-out
    const newCsrf = generateCsrfToken();
    sessionStorage.setItem(CSRF_KEY, newCsrf);
    setCsrfToken(newCsrf);

    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, csrfToken, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

/**
 * Hook to consume auth context.
 * @returns {{ user: Object|null, loading: boolean, error: string|null, csrfToken: string, signIn: Function, signOut: Function }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
