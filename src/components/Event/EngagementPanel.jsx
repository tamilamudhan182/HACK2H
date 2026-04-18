function EngagementPanel({ rewardPoints, actions, onRedeemAction, recommendations }) {
  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)", marginTop: "var(--spacing-4)" }}
    >
      {/* Rewards Overview */}
      <section
        className="panel-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(212,175,55,0.1))",
          borderColor: "rgba(255,255,255,0.3)",
        }}
      >
        <div>
          <p
            style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-accent)", fontWeight: "600" }}
          >
            Eco Balance
          </p>
          <div style={{ display: "flex", alignItems: "end", gap: "4px" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: "700", color: "#fff", lineHeight: "1" }}>
              {rewardPoints}
            </span>
            <span style={{ color: "var(--color-text-muted)", marginBottom: "6px" }}>pts</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexDirection: "column", minWidth: "120px" }}>
          <button
            className="btn-secondary"
            style={{ padding: "8px", fontSize: "0.85rem", background: "rgba(255,255,255,0.1)" }}
          >
            Redeem
          </button>
        </div>
      </section>

      {/* Sustainability Quests */}
      <div>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Active Quests</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
          {actions.map((action) => (
            <div
              key={action.id}
              className="panel-card"
              style={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "140px",
              }}
            >
              <div>
                <span className="status-pill status-pill--success" style={{ marginBottom: "8px" }}>
                  +{action.points} pts
                </span>
                <p style={{ color: "#fff", fontWeight: "600", fontSize: "0.95rem", lineHeight: "1.3" }}>
                  {action.label}
                </p>
              </div>
              <button
                onClick={() => onRedeemAction(action)}
                className="btn-secondary"
                style={{ width: "100%", padding: "8px", marginTop: "12px", fontSize: "0.85rem" }}
              >
                Log Action
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <section className="panel-card" style={{ marginTop: "16px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>✨ Based on your style</span>
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255,255,255,0.03)",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div>
                <p
                  style={{
                    color: "var(--color-primary)",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  {rec.category}
                </p>
                <p style={{ color: "#fff", fontWeight: "500", marginTop: "4px" }}>{rec.label}</p>
              </div>
              <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>{rec.matchScore}% Match</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default EngagementPanel;
