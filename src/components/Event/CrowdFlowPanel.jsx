function CrowdFlowPanel({ zones, activeDestination, onDestinationChange, routeSuggestion }) {
  // Use CSS styles for map look
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      <section className="panel-card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🗺️ Live Stadium Heatmap</span>
          <span className="status-pill status-pill--info" style={{ marginLeft: "auto" }}>
            AI Active
          </span>
        </h3>

        {/* Destination Tabs */}
        <div style={{ display: "flex", gap: "var(--spacing-2)", overflowX: "auto", paddingBottom: "4px" }}>
          {["seat", "restroom", "exit"].map((dest) => (
            <button
              key={dest}
              onClick={() => onDestinationChange(dest)}
              className={activeDestination === dest ? "btn-primary" : "btn-secondary"}
              style={{ textTransform: "capitalize", padding: "8px 16px", flexShrink: 0 }}
            >
              Refine: {dest}
            </button>
          ))}
        </div>

        {/* The Map Overlay */}
        <div
          className="map-container"
          style={{
            minHeight: "300px",
            padding: "var(--spacing-3)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--spacing-2)",
            background: "radial-gradient(ellipse at center, #1a2030 0%, #06080d 100%)",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)",
          }}
        >
          {zones.map((zone) => {
            let color = "var(--color-accent)";
            let label = "Clear";
            if (zone.density > 60) {
              color = "var(--color-primary)";
              label = "Steady";
            }
            if (zone.density > 80) {
              color = "var(--color-warning)";
              label = "Busy";
            }
            if (zone.density > 90) {
              color = "var(--color-danger)";
              label = "Critical";
            }

            return (
              <div
                key={zone.id}
                style={{
                  border: `1px solid ${color}`,
                  borderRadius: "var(--radius-md)",
                  padding: "var(--spacing-2)",
                  background: `rgba(${color === "var(--color-accent)" ? "255,255,255" : color === "var(--color-primary)" ? "212,175,55" : color === "var(--color-warning)" ? "255,183,3" : "239,35,60"}, 0.1)`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "600", color: "#fff", fontSize: "0.85rem" }}>{zone.label}</span>
                  <span style={{ fontSize: "0.75rem", color }}>{label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "#fff" }}>{zone.density}%</span>
                  <span style={{ fontSize: "0.65rem", color: "var(--color-text-muted)" }}>Density</span>
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "3px",
                    width: `${zone.density}%`,
                    background: color,
                  }}
                ></div>
              </div>
            );
          })}
        </div>

        {/* AI routing feedback */}
        <div
          style={{
            background: "rgba(212,175,55,0.1)",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: "var(--radius-md)",
            padding: "var(--spacing-3)",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              color: "var(--color-primary)",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            AI Route Suggestion (94% Match)
          </p>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            {routeSuggestion.path.map((step, idx, arr) => (
              <span key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    background: "var(--color-bg-surface-hover)",
                    padding: "4px 12px",
                    borderRadius: "100px",
                    fontSize: "0.85rem",
                    color: "#fff",
                  }}
                >
                  {step.trim()}
                </span>
                {idx < arr.length - 1 && <span style={{ color: "var(--color-text-muted)" }}>→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CrowdFlowPanel;
