import { memo } from "react";
import GoogleMapEmbed from "../GoogleMapEmbed";

/**
 * CrowdFlowPanel — live stadium heatmap with zone density cards,
 * AI-powered route suggestions, confidence scoring, and Google Maps embed.
 *
 * @param {{ zones: Array, activeDestination: string, onDestinationChange: Function, routeSuggestion: Object }} props
 */
const CrowdFlowPanel = memo(function CrowdFlowPanel({
  zones,
  activeDestination,
  onDestinationChange,
  routeSuggestion,
}) {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      <section className="panel-card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span aria-hidden="true">🗺️</span> Live Stadium Heatmap
          <span className="status-pill status-pill--info" style={{ marginLeft: "auto" }}>
            AI Active
          </span>
        </h3>

        {/* Destination Tabs */}
        <div
          role="group"
          aria-label="Select navigation destination"
          style={{ display: "flex", gap: "var(--spacing-2)", overflowX: "auto", paddingBottom: "4px" }}
        >
          {["seat", "restroom", "exit"].map((dest) => (
            <button
              key={dest}
              id={`btn-dest-${dest}`}
              onClick={() => onDestinationChange(dest)}
              className={activeDestination === dest ? "btn-primary" : "btn-secondary"}
              style={{ textTransform: "capitalize", padding: "8px 16px", flexShrink: 0 }}
              aria-pressed={activeDestination === dest}
              aria-label={`Navigate to ${dest}`}
            >
              Refine: {dest}
            </button>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div
          className="map-container"
          role="region"
          aria-label="Stadium zone density heatmap"
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

            const rgbMap = {
              "var(--color-accent)": "255,255,255",
              "var(--color-primary)": "212,175,55",
              "var(--color-warning)": "255,183,3",
              "var(--color-danger)": "239,35,60",
            };

            return (
              <div
                key={zone.id}
                role="status"
                aria-label={`${zone.label}: ${zone.density}% density, ${label}`}
                style={{
                  border: `1px solid ${color}`,
                  borderRadius: "var(--radius-md)",
                  padding: "var(--spacing-2)",
                  background: `rgba(${rgbMap[color]}, 0.1)`,
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
                  role="progressbar"
                  aria-valuenow={zone.density}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${zone.label} density`}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "3px",
                    width: `${zone.density}%`,
                    background: color,
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* AI Route Suggestion with confidence score */}
        <div
          role="region"
          aria-label="AI route suggestion"
          style={{
            background: "rgba(212,175,55,0.1)",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: "var(--radius-md)",
            padding: "var(--spacing-3)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <p
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                color: "var(--color-primary)",
                fontWeight: "600",
              }}
            >
              AI Route Suggestion
            </p>
            <span
              className="status-pill status-pill--warning"
              aria-label={`Route confidence ${routeSuggestion.confidence}, ETA ${routeSuggestion.eta} minutes`}
            >
              {routeSuggestion.confidence} · ETA {routeSuggestion.eta}min
            </span>
          </div>
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
                {idx < arr.length - 1 && (
                  <span style={{ color: "var(--color-text-muted)" }} aria-hidden="true">
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
          <p style={{ marginTop: "10px", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            {routeSuggestion.advisory}
          </p>
        </div>
      </section>

      {/* Google Maps Venue Navigation */}
      <section className="panel-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "var(--spacing-3)", paddingBottom: "var(--spacing-2)" }}>
          <h3 style={{ fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <span aria-hidden="true">🌍</span> Venue Navigation (Google Maps)
          </h3>
        </div>
        <GoogleMapEmbed venueName="Stadium Neo" lat={12.9716} lng={77.5946} zoom={16} />
      </section>
    </div>
  );
});

export default CrowdFlowPanel;
