/**
 * Firebase configuration and service initialization.
 *
 * Runs in STUB mode when env vars are absent.
 * Set all VITE_FIREBASE_* variables in .env to activate real Firebase.
 *
 * See .env.example for required keys and where to get them.
 */

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/** Whether real Firebase credentials are present in environment. */
const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined");

// Initialise Firebase only once regardless of HMR re-runs
const app = isFirebaseConfigured && !getApps().length ? initializeApp(firebaseConfig) : (getApps()[0] ?? null);

/** Firebase Auth instance — null in stub mode. */
export const auth = app ? getAuth(app) : null;

/** Firestore instance — null in stub mode. */
export const db = app ? getFirestore(app) : null;

/** Google Auth Provider. */
export const googleProvider = isFirebaseConfigured ? new GoogleAuthProvider() : null;

/**
 * Signs in with Google using a popup.
 * Falls back to a stub mock user when Firebase is not configured.
 * @returns {Promise<{ user: Object }>}
 */
export async function signInWithGoogle() {
  if (auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (err) {
      // USER_CANCELLED — treat gracefully
      if (err.code === "auth/popup-closed-by-user") return { user: null };
      throw err;
    }
  }

  // ── STUB MODE ──────────────────────────────────────────────────────────────
  // Returns a mock user so the app works without Firebase credentials.
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    user: {
      uid: "attendee-27",
      displayName: "Aarav Mehta",
      email: "aarav@example.com",
      photoURL: null,
    },
  };
}

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 */
export async function signOutUser() {
  if (auth) {
    await signOut(auth);
  } else {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}

export { firebaseConfig, isFirebaseConfigured };
