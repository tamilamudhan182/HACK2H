function NotificationRail({ alerts }) {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>Live Alerts</h2>
      
      {alerts.map((alert, index) => {
        let borderAndShadow = "rgba(212,175,55,0.3)";
        let bg = "var(--color-bg-surface)";
        if (alert.tone === "urgent") { borderAndShadow = "var(--color-danger)"; bg = "rgba(239,35,60,0.1)"; }
        else if (alert.tone === "warning") { borderAndShadow = "var(--color-warning)"; bg = "rgba(255,183,3,0.1)"; }
        else if (alert.tone === "info") { borderAndShadow = "var(--color-accent)"; bg = "rgba(255,255,255,0.1)"; }

        return (
          <div key={alert.id} className="panel-card fade-in" style={{ 
            animationDelay: `${index * 0.1}s`, 
            background: bg,
            borderLeft: `4px solid ${borderAndShadow}`
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {alert.tone === "urgent" && <span>🚨</span>}
                {alert.tone === "warning" && <span>⚠️</span>}
                {alert.tone === "info" && <span>ℹ️</span>}
                <strong style={{ fontSize: "1.1rem", color: "#fff" }}>{alert.title}</strong>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{alert.timestamp}</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", lineHeight: "1.5" }}>{alert.message}</p>
          </div>
        );
      })}
    </div>
  );
}

export default NotificationRail;
