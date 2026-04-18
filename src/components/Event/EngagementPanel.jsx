import { memo, useMemo } from "react";

/**
 * EngagementPanel — eco-rewards overview, sustainability quest cards,
 * progress tracker, and AI-personalized recommendations.
 *
 * @param {{ rewardPoints: number, actions: Array, onRedeemAction: Function, recommendations: Array }} props
 */
const EngagementPanel = memo(function EngagementPanel({ rewardPoints, actions, onRedeemAction, recommendations }) {
  /** Progress toward the next reward tier (every 500 pts). */
  const tierProgress = useMemo(() => {
    const tierSize = 500;
    return Math.min(((rewardPoints % tierSize) / tierSize) * 100, 100);
  }, [rewardPoints]);

  const tierLevel = useMemo(() => Math.floor(rewardPoints / 500) + 1, [rewardPoints]);

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)", marginTop: "var(--spacing-4)" }}
    >
      {/* Rewards Overview */}
      <section
        className="panel-card"
        aria-label={`Eco rewards balance: ${rewardPoints} points, Tier ${tierLevel}`}
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(212,175,55,0.1))",
          borderColor: "rgba(255,255,255,0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                fontWeight: "600",
              }}
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
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Tier {tierLevel}
            </p>
            <button
              id="btn-redeem-rewards"
              className="btn-secondary"
              aria-label={`Redeem ${rewardPoints} eco points`}
              style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            >
              Redeem
            </button>
          </div>
        </div>

        {/* Progress bar to next tier */}
        <div style={{ marginTop: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
              Progress to Tier {tierLevel + 1}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--color-primary)" }}>{Math.round(tierProgress)}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={Math.round(tierProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${Math.round(tierProgress)}% progress to next eco tier`}
            style={{ height: "6px", borderRadius: "100px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}
          >
            <div
              style={{
                height: "100%",
                width: `${tierProgress}%`,
                background: "linear-gradient(to right, #d4af37, #fff)",
                borderRadius: "100px",
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>
      </section>

      {/* Sustainability Quests */}
      <div>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Active Quests</h3>
        <div
          role="list"
          aria-label="Sustainability quests"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}
        >
          {actions.map((action) => (
            <div
              key={action.id}
              role="listitem"
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
                <span
                  className="status-pill status-pill--success"
                  style={{ marginBottom: "8px" }}
                  aria-label={`Earn ${action.points} points`}
                >
                  +{action.points} pts
                </span>
                <p
                  style={{ color: "#fff", fontWeight: "600", fontSize: "0.95rem", lineHeight: "1.3", marginTop: "8px" }}
                >
                  {action.label}
                </p>
              </div>
              <button
                id={`btn-quest-${action.id}`}
                onClick={() => onRedeemAction(action)}
                className="btn-secondary"
                aria-label={`Log action: ${action.label} to earn ${action.points} points`}
                style={{ width: "100%", padding: "8px", marginTop: "12px", fontSize: "0.85rem" }}
              >
                Log Action
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <section className="panel-card" aria-label="AI personalized recommendations">
        <h3 style={{ fontSize: "1.2rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span aria-hidden="true">✨</span> Based on your style
        </h3>
        <div
          role="list"
          aria-label="Recommendations list"
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              role="listitem"
              aria-label={`${rec.category}: ${rec.title ?? rec.label}`}
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
                <p style={{ color: "#fff", fontWeight: "500", marginTop: "4px" }}>{rec.title ?? rec.label}</p>
                {rec.sustainability && (
                  <p style={{ fontSize: "0.72rem", color: "#4ade80", marginTop: "4px" }}>🌱 {rec.sustainability}</p>
                )}
              </div>
              {rec.score !== undefined && (
                <span
                  style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", flexShrink: 0 }}
                  aria-label={`Match score: ${rec.score}`}
                >
                  {rec.score}pts
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
});

export default EngagementPanel;
