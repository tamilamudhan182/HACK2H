/**
 * envValidator — validates required environment variables at startup.
 *
 * Produces a per-service health map so the app can render appropriate
 * banners, fallbacks, or warnings without crashing.
 *
 * Usage:
 *   import { validateEnv, SERVICE_STATUS } from "./utils/envValidator";
 *   const status = validateEnv();
 *   if (status.firebase === SERVICE_STATUS.DEMO) { ... }
 */

export const SERVICE_STATUS = {
  LIVE: "live",
  DEMO: "demo",
};

/**
 * Names of required Vite env vars per Google service.
 */
const REQUIRED_KEYS = {
  firebase: ["VITE_FIREBASE_API_KEY", "VITE_FIREBASE_AUTH_DOMAIN", "VITE_FIREBASE_PROJECT_ID", "VITE_FIREBASE_APP_ID"],
  maps: ["VITE_GOOGLE_MAPS_API_KEY"],
  pay: ["VITE_GOOGLE_PAY_MERCHANT_ID"],
  analytics: ["VITE_GA_MEASUREMENT_ID"],
};

/**
 * Safe env accessor — works in both Vite and Jest environments.
 * @param {string} key
 * @returns {string|undefined}
 */
function getEnvVar(key) {
  try {
    // Vite runtime
    return import.meta?.env?.[key];
  } catch {
    return process?.env?.[key];
  }
}

/**
 * Checks whether ALL required keys for a given service are populated.
 * @param {string[]} keys
 * @returns {boolean}
 */
function serviceIsLive(keys) {
  return keys.every((k) => {
    const val = getEnvVar(k);
    return val && val.trim() !== "" && !val.startsWith("your_");
  });
}

/**
 * Validates all Google service environment variables and returns a health map.
 *
 * @returns {{ firebase: string, maps: string, pay: string, analytics: string, allLive: boolean }}
 */
export function validateEnv() {
  const result = {};
  let allLive = true;

  for (const [service, keys] of Object.entries(REQUIRED_KEYS)) {
    const live = serviceIsLive(keys);
    result[service] = live ? SERVICE_STATUS.LIVE : SERVICE_STATUS.DEMO;
    if (!live) allLive = false;
  }

  result.allLive = allLive;

  if (!allLive) {
    console.info(
      "[SmartEvent] Running in DEMO mode. Some Google services are using stubs. " +
        "Populate .env with live keys to activate Firebase, Maps, Pay, and Analytics."
    );
  }

  return result;
}
