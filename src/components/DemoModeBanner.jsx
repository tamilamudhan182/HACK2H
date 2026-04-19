/**
 * DemoModeBanner — shown when one or more Google services are in stub/demo mode.
 *
 * Displays a dismissable gold banner at the top of the app that:
 *  1. Tells evaluators/developers which services are active vs demo
 *  2. Links directly to the Google Cloud Console for easy key setup
 *  3. Explains how to configure .env to activate live services
 */
import { memo, useState } from "react";
import { validateEnv, SERVICE_STATUS } from "../utils/envValidator";

const STATUS_CONFIG = {
  firebase: { label: "Firebase Auth + Firestore", icon: "🔥", docs: "https://console.firebase.google.com" },
  maps: { label: "Google Maps", icon: "🗺️", docs: "https://console.cloud.google.com/apis/library/maps-backend.googleapis.com" },
  pay: { label: "Google Pay", icon: "💳", docs: "https://pay.google.com/business/console" },
  analytics: { label: "Google Analytics", icon: "📊", docs: "https://analytics.google.com" },
};

const DemoModeBanner = memo(function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false);
  const status = validateEnv();

  // Only show when at least one service is in demo mode
  if (status.allLive || dismissed) return null;

  const demoServices = Object.entries(STATUS_CONFIG).filter(
    ([key]) => status[key] === SERVICE_STATUS.DEMO
  );
  const liveServices = Object.entries(STATUS_CONFIG).filter(
    ([key]) => status[key] === SERVICE_STATUS.LIVE
  );

  return (
    <div
      role="banner"
      aria-label="Demo mode notification"
      style={{
        background: "linear-gradient(90deg, #b8860b, #ffd700, #b8860b)",
        color: "#1a1a1a",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        flexWrap: "wrap",
        fontSize: "0.82rem",
        fontWeight: 600,
        boxShadow: "0 2px 8px rgba(255,215,0,0.4)",
        zIndex: 9999,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <span>⚡ DEMO MODE</span>
        <span style={{ fontWeight: 400 }}>—</span>
        {demoServices.map(([key, cfg]) => (
          <a
            key={key}
            href={cfg.docs}
            target="_blank"
            rel="noopener noreferrer"
            title={`Activate ${cfg.label}`}
            style={{
              background: "rgba(0,0,0,0.15)",
              borderRadius: "4px",
              padding: "2px 7px",
              color: "#1a1a1a",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {cfg.icon} {cfg.label} (stub)
          </a>
        ))}
        {liveServices.length > 0 && (
          <>
            <span style={{ fontWeight: 400 }}>|</span>
            {liveServices.map(([key, cfg]) => (
              <span
                key={key}
                style={{
                  background: "rgba(0,100,0,0.2)",
                  borderRadius: "4px",
                  padding: "2px 7px",
                  whiteSpace: "nowrap",
                }}
              >
                ✅ {cfg.label}
              </span>
            ))}
          </>
        )}
        <span style={{ fontWeight: 400, marginLeft: 4 }}>
          → Add keys to <code style={{ background: "rgba(0,0,0,0.1)", padding: "1px 4px", borderRadius: 3 }}>.env</code> to go live.
        </span>
      </div>
      <button
        aria-label="Dismiss demo mode banner"
        onClick={() => setDismissed(true)}
        style={{
          background: "rgba(0,0,0,0.2)",
          border: "none",
          borderRadius: "50%",
          width: 24,
          height: 24,
          cursor: "pointer",
          fontSize: "0.9rem",
          lineHeight: 1,
          flexShrink: 0,
          color: "#1a1a1a",
        }}
      >
        ✕
      </button>
    </div>
  );
});

export default DemoModeBanner;
