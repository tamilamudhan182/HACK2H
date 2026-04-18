/**
 * Google Analytics (gtag) integration utility.
 *
 * To activate:
 * 1. Add your GA4 Measurement ID to .env as VITE_GA_MEASUREMENT_ID
 * 2. Add the gtag snippet to index.html (see instructions below)
 * 3. Call `trackEvent()` anywhere in the app for custom events.
 *
 * index.html snippet to add inside <head>:
 *   <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
 *   <script>
 *     window.dataLayer = window.dataLayer || [];
 *     function gtag(){dataLayer.push(arguments);}
 *     gtag('js', new Date());
 *     gtag('config', 'YOUR_GA_ID');
 *   </script>
 */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? null;

/**
 * Tracks a custom Google Analytics event.
 * Silently no-ops if gtag is not loaded or GA_ID is missing.
 * @param {string} eventName - The event name (e.g. 'wallet_topup').
 * @param {Object} [params={}] - Additional event parameters.
 */
export function trackEvent(eventName, params = {}) {
  if (!GA_ID || typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, { ...params, app: "smart-event-companion" });
}

/**
 * Tracks a page view. Call on route changes.
 * @param {string} pagePath - The current path (e.g. '/wallet').
 * @param {string} pageTitle - Human-readable page title.
 */
export function trackPageView(pagePath, pageTitle) {
  trackEvent("page_view", { page_path: pagePath, page_title: pageTitle });
}
