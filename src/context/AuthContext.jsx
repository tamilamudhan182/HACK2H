/**
 * AuthContext — provides JWT-based authentication state and actions.
 *
 * Currently uses a stub implementation (Google OAuth simulation) so the app
 * runs fully without real Firebase credentials. When VITE_FIREBASE_API_KEY
 * is set in .env, swap the signInWithGoogle import with the real Firebase call.
 */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { signInWithGoogle, signOutUser } from "../services/firebase";
import { buildAuditEntry } from "../utils/sanitize";

const AuthContext = createContext(null);

/**
 * Provides auth state to the entire application.
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Restore session from sessionStorage on app boot
  useEffect(() => {
    const stored = sessionStorage.getItem("sec_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
        if (!sessionStorage.getItem("sessionId")) {
          sessionStorage.setItem("sessionId", crypto.randomUUID?.() ?? Date.now().toString());
        }
      } catch {
        sessionStorage.removeItem("sec_user");
      }
    }
  }, []);

  /**
   * Initiates Google OAuth sign-in flow.
   * @returns {Promise<void>}
   */
  const signIn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      const userData = result.user;
      setUser(userData);
      sessionStorage.setItem("sec_user", JSON.stringify(userData));
      sessionStorage.setItem("sessionId", crypto.randomUUID?.() ?? Date.now().toString());
      console.info("[Audit]", buildAuditEntry("sign_in", { uid: userData.uid }));
    } catch (err) {
      setError("Sign-in failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Signs the current user out and clears session storage.
   * @returns {Promise<void>}
   */
  const signOut = useCallback(async () => {
    await signOutUser();
    setUser(null);
    sessionStorage.removeItem("sec_user");
    sessionStorage.removeItem("sessionId");
    console.info("[Audit]", buildAuditEntry("sign_out", {}));
  }, []);

  return <AuthContext.Provider value={{ user, loading, error, signIn, signOut }}>{children}</AuthContext.Provider>;
}

/**
 * Hook to consume auth context.
 * @returns {{ user: Object|null, loading: boolean, error: string|null, signIn: Function, signOut: Function }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
