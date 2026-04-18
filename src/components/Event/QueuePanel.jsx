function QueuePanel({ queues, onJoinQueue }) {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      <h2 style={{ fontSize: "1.5rem" }}>Virtual Queues</h2>
      <p style={{ color: "var(--color-text-muted)", marginTop: "-12px" }}>
        Book your spot for food and merch and strictly avoid the lines.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "var(--spacing-4)",
        }}
      >
        {queues.map((queue) => (
          <div
            key={queue.id}
            className="panel-card"
            style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span
                  className="section-label"
                  style={{ color: queue.joined ? "var(--color-accent)" : "var(--color-primary)" }}
                >
                  {queue.type}
                </span>
                <h3 style={{ fontSize: "1.2rem", marginTop: "4px" }}>{queue.label}</h3>
              </div>
              {queue.joined && <span className="status-pill status-pill--success">Joined</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-2)" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Wait Time</p>
                <strong style={{ fontSize: "1.2rem", color: queue.joined ? "var(--color-accent)" : "#fff" }}>
                  {queue.predictedWait} min
                </strong>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Ahead</p>
                <strong style={{ fontSize: "1.2rem", color: "#fff" }}>{queue.peopleAhead} pax</strong>
              </div>
            </div>

            {queue.joined && (
              <div
                style={{
                  background: "var(--color-bg-surface-hover)",
                  padding: "12px",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Your Token</span>
                <strong style={{ color: "var(--color-accent)", fontSize: "1.2rem", letterSpacing: "0.1em" }}>
                  {queue.token}
                </strong>
              </div>
            )}

            {!queue.joined && (
              <button className="btn-primary" style={{ width: "100%" }} onClick={() => onJoinQueue(queue.id)}>
                Join Queue
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default QueuePanel;
