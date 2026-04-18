import { memo } from "react";

/**
 * CoordinationPanel — squad locator map, AI meetup routing,
 * event timeline, and departure advice panel.
 *
 * @param {{ friends: Array, selectedFriendId: string, onSelectFriend: Function, meetupRoute: Object, timeline: Array, transportAdvice: Object }} props
 */
const CoordinationPanel = memo(function CoordinationPanel({
  friends,
  selectedFriendId,
  onSelectFriend,
  meetupRoute,
  timeline,
  transportAdvice,
}) {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      {/* Group Locator Map */}
      <section className="panel-card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span aria-hidden="true">📍</span> Squad Locator
        </h3>

        <div
          role="region"
          aria-label="Live friend position map"
          style={{
            position: "relative",
            height: "300px",
            borderRadius: "16px",
            background: "radial-gradient(circle at 50% 50%, #1a2030 0%, #05080e 100%)",
            border: "1px solid rgba(212,175,55,0.2)",
            overflow: "hidden",
          }}
        >
          {/* Radar Circles — decorative */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              border: "1px dashed rgba(255,255,255,0.05)",
              borderRadius: "50%",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "60%",
              height: "60%",
              border: "1px dashed rgba(255,255,255,0.05)",
              borderRadius: "50%",
            }}
          />

          {friends.map((friend) => {
            const isSelected = friend.id === selectedFriendId;
            return (
              <button
                key={friend.id}
                id={`btn-friend-${friend.id}`}
                onClick={() => onSelectFriend(friend.id)}
                aria-label={`${friend.name} — ${friend.status}${isSelected ? " (selected)" : ""}`}
                aria-pressed={isSelected}
                style={{
                  position: "absolute",
                  left: `${friend.x}%`,
                  top: `${friend.y}%`,
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  zIndex: isSelected ? 10 : 1,
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "relative",
                    width: isSelected ? "48px" : "36px",
                    height: isSelected ? "48px" : "36px",
                    borderRadius: "50%",
                    border: `2px solid ${isSelected ? "var(--color-primary)" : "rgba(255,255,255,0.5)"}`,
                    background: `url(${friend.avatar}) center/cover no-repeat, #333`,
                    boxShadow: isSelected ? "0 0 20px rgba(212,175,55,0.5)" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  {isSelected && (
                    <div
                      className="radar-dot"
                      style={{ position: "absolute", top: "-4px", right: "-4px", width: "12px", height: "12px" }}
                    />
                  )}
                </div>
                {isSelected && (
                  <span
                    style={{
                      background: "rgba(0,0,0,0.8)",
                      padding: "4px 8px",
                      borderRadius: "100px",
                      fontSize: "0.75rem",
                      color: "var(--color-primary)",
                      border: "1px solid var(--color-primary-dim)",
                    }}
                  >
                    {friend.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Meetup Route */}
        <div
          role="region"
          aria-label="AI meetup route"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "var(--radius-md)",
            padding: "var(--spacing-3)",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Meetup Route (AI Guided)
          </p>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            {meetupRoute.path.map((step, idx, arr) => (
              <span key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#fff", fontSize: "0.85rem" }}>{step.trim()}</span>
                {idx < arr.length - 1 && (
                  <span aria-hidden="true" style={{ color: "var(--color-text-muted)" }}>
                    ›
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Event Timeline */}
      <section className="panel-card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        <h3 style={{ fontSize: "1.2rem" }}>Event Timeline</h3>
        <ol
          aria-label="Event timeline"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            position: "relative",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "12px",
              top: "10px",
              bottom: "10px",
              width: "2px",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          {timeline.map((moment, index) => {
            const isLive = moment.status === "Live" || moment.status.startsWith("T-");
            const isDone = moment.status === "Done";
            return (
              <li
                key={moment.id}
                aria-label={`${moment.label}: ${moment.detail}`}
                style={{ display: "flex", gap: "16px", position: "relative", zIndex: 1, opacity: isDone ? 0.6 : 1 }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: isLive
                      ? "var(--color-primary)"
                      : isDone
                        ? "var(--color-text-muted)"
                        : "var(--color-bg-surface)",
                    border: `2px solid ${isLive ? "var(--color-primary)" : "rgba(255,255,255,0.2)"}`,
                    boxShadow: isLive ? "0 0 10px var(--color-primary)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isLive && <div style={{ width: "8px", height: "8px", background: "#fff", borderRadius: "50%" }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: index < timeline.length - 1 ? "16px" : "0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ color: isLive ? "var(--color-primary)" : "#fff", fontSize: "1rem" }}>
                      {moment.label}
                    </strong>
                    <span
                      className={`status-pill ${isLive ? "status-pill--info" : isDone ? "" : "status-pill--warning"}`}
                    >
                      {moment.status}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                    {moment.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Departure Advice */}
      <section className="panel-card" aria-label="Best departure option">
        <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Departure Advice</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(255,255,255,0.05)",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          <div>
            <p style={{ color: "var(--color-accent)", fontWeight: "600" }}>{transportAdvice.bestOption.label}</p>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>{transportAdvice.reason}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span
              style={{ fontSize: "1.5rem", fontWeight: "700", color: "#fff" }}
              aria-label={`${transportAdvice.bestOption.liveEta} minutes estimated travel time`}
            >
              {transportAdvice.bestOption.liveEta}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>mins</span>
          </div>
        </div>

        {/* All transport options */}
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {transportAdvice.options?.map((opt) => (
            <div
              key={opt.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: "10px",
                background:
                  opt.id === transportAdvice.bestOption.id ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${opt.id === transportAdvice.bestOption.id ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <span style={{ color: "#fff", fontSize: "0.9rem" }}>{opt.label}</span>
              <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>{opt.liveEta} min</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
});

export default CoordinationPanel;
