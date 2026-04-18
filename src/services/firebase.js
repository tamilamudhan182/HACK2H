/**
 * Firebase configuration and service initialization.
 *
 * To activate real Firebase services:
 * 1. Create a project at https://console.firebase.google.com
 * 2. Copy the SDK config object into your .env file (see .env.example)
 * 3. Uncomment the initialization blocks below.
 *
 * Currently runs in STUB mode — all auth and Firestore calls are mocked
 * so the app works fully without a live Firebase project.
 */

// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "PLACEHOLDER",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "PLACEHOLDER",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "PLACEHOLDER",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "PLACEHOLDER",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "PLACEHOLDER",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "PLACEHOLDER",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "PLACEHOLDER",
};

// --- STUB MODE ---
// Remove this block and uncomment the imports above to activate real Firebase.

/**
 * Stub Firebase Auth — simulates sign-in with Google.
 * Replace with real Firebase Auth when credentials are available.
 */
export const auth = {
  currentUser: null,
};

/**
 * Stub Firestore — simulates real-time collection listener.
 * Replace with `getFirestore()` when credentials are available.
 */
export const db = null;

/**
 * Stub Google Auth Provider.
 */
export const googleProvider = null;

/**
 * Sign in with Google (stub implementation).
 * @returns {Promise<{user: Object}>} Mock user object.
 */
export async function signInWithGoogle() {
  // Simulate network latency
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
 * Sign out stub.
 * @returns {Promise<void>}
 */
export async function signOutUser() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  auth.currentUser = null;
}

export { firebaseConfig };
