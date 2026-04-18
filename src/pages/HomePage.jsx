import { useEvent } from "../context/EventContext";
import { Link } from "react-router-dom";

function HomePage() {
  const { attendeeProfile, wallet, liveQueues, transportAdvice, liveRoute } = useEvent();

  const activeQueues = liveQueues.filter((q) => q.joined).length;

  return (
    <div className="page-grid page-grid--top fade-in">
      {/* Hero Header */}
      <section className="panel-card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1
              style={{
                fontSize: "2.5rem",
                marginBottom: "var(--spacing-1)",
                background: "linear-gradient(to right, #d4af37, #fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Hi, {attendeeProfile.name}
            </h1>
            <p
              style={{
                color: "var(--color-primary)",
                fontWeight: "500",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span className="radar-dot" style={{ width: "8px", height: "8px" }}></span> LIVE:{" "}
              {liveRoute.path.join(" → ")}
            </p>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "12px 20px",
              borderRadius: "100px",
              border: "1px solid var(--color-border)",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginRight: "8px" }}>SEAT</span>
            <strong style={{ color: "#fff", fontSize: "1.1rem" }}>{attendeeProfile.seatLabel}</strong>
          </div>
        </div>

        {/* Hero Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "var(--spacing-3)",
            marginTop: "var(--spacing-4)",
          }}
        >
          <div
            style={{
              background: "var(--color-primary-dim)",
              padding: "var(--spacing-3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-primary)",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              Wallet Balance
            </p>
            <h2 style={{ fontSize: "1.8rem", marginTop: "4px" }}>₹{wallet.balance}</h2>
          </div>
          <div
            style={{
              background: "var(--color-accent-dim)",
              padding: "var(--spacing-3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-accent)",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              Active Queues
            </p>
            <h2 style={{ fontSize: "1.8rem", marginTop: "4px" }}>
              {activeQueues} / {liveQueues.length}
            </h2>
          </div>
          <div
            style={{
              background: "var(--color-secondary-dim)",
              padding: "var(--spacing-3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-secondary)",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              Eco Rewards
            </p>
            <h2 style={{ fontSize: "1.8rem", marginTop: "4px" }}>{wallet.rewardPoints} pts</h2>
          </div>
        </div>
      </section>

      {/* Quick Nav Tiles */}
      <h3 style={{ marginTop: "var(--spacing-4)", marginBottom: "calc(var(--spacing-2) * -1)" }}>Quick Access</h3>
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-3)" }}>
        <Link
          to="/wallet"
          className="panel-card"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}
        >
          <div style={{ fontSize: "2rem" }}>💳</div>
          <strong>QR Wallet</strong>
          <p style={{ fontSize: "0.75rem" }}>Payments & Passes</p>
        </Link>
        <Link
          to="/heatmap"
          className="panel-card"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}
        >
          <div style={{ fontSize: "2rem" }}>🗺️</div>
          <strong>Heatmap</strong>
          <p style={{ fontSize: "0.75rem" }}>Crowd avoidance</p>
        </Link>
        <Link
          to="/queue"
          className="panel-card"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}
        >
          <div style={{ fontSize: "2rem" }}>⏳</div>
          <strong>Virtual Queue</strong>
          <p style={{ fontSize: "0.75rem" }}>Book food & merch slots</p>
        </Link>
        <Link
          to="/locator"
          className="panel-card"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}
        >
          <div style={{ fontSize: "2rem" }}>📍</div>
          <strong>Locator</strong>
          <p style={{ fontSize: "0.75rem" }}>Find your friends</p>
        </Link>
        <Link
          to="/alerts"
          className="panel-card"
          style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ fontSize: "2rem" }}>🔔</div>
            <div>
              <strong>Event Alerts</strong>
              <p style={{ fontSize: "0.85rem" }}>
                Safe exit: {transportAdvice.bestOption.label} ({transportAdvice.bestOption.liveEta}m)
              </p>
            </div>
          </div>
          <span className="btn-secondary" style={{ padding: "8px 16px" }}>
            View All
          </span>
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
