/**
 * webVitals — reports Core Web Vitals to Google Analytics.
 *
 * Measures CLS, FID/INP, LCP, TTFB, and FCP using the
 * PerformanceObserver API (available in all modern browsers).
 *
 * Results are forwarded to GA4 via `trackEvent` from analytics.js.
 *
 * Usage:
 *   import { reportWebVitals } from "./utils/webVitals";
 *   reportWebVitals(); // call once from main.jsx
 */

import { trackEvent } from "../services/analytics";

/**
 * Sends a single web vital measurement to Google Analytics.
 * @param {{ name: string, value: number, rating: string }} metric
 */
function sendToAnalytics({ name, value, rating }) {
  trackEvent("web_vital", {
    metric_name: name,
    metric_value: Math.round(name === "CLS" ? value * 1000 : value),
    metric_rating: rating, // "good" | "needs-improvement" | "poor"
  });
}

/**
 * Thresholds aligned with Google's Core Web Vitals targets.
 */
const THRESHOLDS = {
  CLS: [0.1, 0.25],
  FID: [100, 300],
  INP: [200, 500],
  LCP: [2500, 4000],
  TTFB: [800, 1800],
  FCP: [1800, 3000],
};

/**
 * Rates a metric value against Google's thresholds.
 * @param {string} name
 * @param {number} value
 * @returns {"good"|"needs-improvement"|"poor"}
 */
function rate(name, value) {
  const [good, poor] = THRESHOLDS[name] ?? [Infinity, Infinity];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

/**
 * Observes a PerformanceObserver entry type and resolves on first match.
 * @param {string} type
 * @param {Function} handler
 */
function observe(type, handler) {
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(handler);
    });
    observer.observe({ type, buffered: true });
  } catch {
    // PerformanceObserver not supported — silently skip
  }
}

/**
 * Registers observers for all Core Web Vitals and sends results to GA.
 * Safe to call in any browser — gracefully skips unsupported APIs.
 */
export function reportWebVitals() {
  // LCP — Largest Contentful Paint
  observe("largest-contentful-paint", (entry) => {
    const value = entry.startTime;
    sendToAnalytics({ name: "LCP", value, rating: rate("LCP", value) });
  });

  // CLS — Cumulative Layout Shift
  observe("layout-shift", (entry) => {
    if (!entry.hadRecentInput) {
      const value = entry.value;
      sendToAnalytics({ name: "CLS", value, rating: rate("CLS", value) });
    }
  });

  // FID / INP — Interaction responsiveness
  observe("first-input", (entry) => {
    const value = entry.processingStart - entry.startTime;
    sendToAnalytics({ name: "FID", value, rating: rate("FID", value) });
  });

  observe("event", (entry) => {
    if (entry.duration > 40) {
      sendToAnalytics({ name: "INP", value: entry.duration, rating: rate("INP", entry.duration) });
    }
  });

  // TTFB — Time to First Byte
  observe("navigation", (entry) => {
    const value = entry.responseStart;
    sendToAnalytics({ name: "TTFB", value, rating: rate("TTFB", value) });

    // FCP
    observe("paint", (paint) => {
      if (paint.name === "first-contentful-paint") {
        sendToAnalytics({ name: "FCP", value: paint.startTime, rating: rate("FCP", paint.startTime) });
      }
    });
  });
}
