import { memo } from "react";

/**
 * NotificationRail — live alert feed with severity-toned cards.
 * Uses aria-live="polite" so screen readers announce new alerts.
 *
 * @param {{ alerts: Array }} props
 */
const NotificationRail = memo(function NotificationRail({ alerts }) {
  return (
    <div
      className="fade-in"
      role="log"
      aria-live="polite"
      aria-label="Live event alerts"
      style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}
    >
      <h2 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>Live Alerts</h2>

      {alerts.map((alert, index) => {
        let borderAndShadow = "rgba(212,175,55,0.3)";
        let bg = "var(--color-bg-surface)";
        if (alert.tone === "urgent") {
          borderAndShadow = "var(--color-danger)";
          bg = "rgba(239,35,60,0.1)";
        } else if (alert.tone === "warning") {
          borderAndShadow = "var(--color-warning)";
          bg = "rgba(255,183,3,0.1)";
        } else if (alert.tone === "info") {
          borderAndShadow = "var(--color-accent)";
          bg = "rgba(255,255,255,0.1)";
        }

        return (
          <div
            key={alert.id}
            className="panel-card fade-in"
            role="article"
            aria-label={`${alert.tone} alert: ${alert.title}`}
            style={{
              animationDelay: `${index * 0.1}s`,
              background: bg,
              borderLeft: `4px solid ${borderAndShadow}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "8px",
              }}
            >
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {alert.tone === "urgent" && <span aria-hidden="true">🚨</span>}
                {alert.tone === "warning" && <span aria-hidden="true">⚠️</span>}
                {alert.tone === "info" && <span aria-hidden="true">ℹ️</span>}
                <strong style={{ fontSize: "1.1rem", color: "#fff" }}>{alert.title}</strong>
              </div>
              <time
                style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}
                aria-label={`Alert received at ${alert.timestamp}`}
              >
                {alert.timestamp}
              </time>
            </div>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", lineHeight: "1.5" }}>{alert.message}</p>
          </div>
        );
      })}
    </div>
  );
});

export default NotificationRail;
