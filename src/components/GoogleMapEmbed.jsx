/**
 * GoogleMapEmbed — embeds a Google Maps iframe for venue navigation.
 *
 * Requires VITE_GOOGLE_MAPS_EMBED_KEY set in .env.
 * Falls back to a styled placeholder map when no API key is present.
 *
 * @param {{ venueName: string, lat: number, lng: number, zoom?: number }} props
 */

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY ?? null;

function GoogleMapEmbed({ venueName = "Stadium Neo", lat = 12.9716, lng = 77.5946, zoom = 16 }) {
  const mapSrc = MAPS_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${encodeURIComponent(venueName)}&zoom=${zoom}`
    : null;

  if (mapSrc) {
    return (
      <div
        className="map-container"
        style={{ width: "100%", height: "320px" }}
        role="region"
        aria-label={`Google Maps showing ${venueName}`}
      >
        <iframe
          title={`Venue map: ${venueName}`}
          src={mapSrc}
          width="100%"
          height="320"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  // Fallback: styled placeholder map
  return (
    <div
      className="map-container"
      role="region"
      aria-label="Venue navigation map"
      style={{
        height: "320px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        background: "radial-gradient(ellipse at center, #1a2030 0%, #06080d 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid lines for stadium feel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📍</div>
        <p style={{ color: "#fff", fontWeight: "600", fontSize: "1.1rem" }}>{venueName}</p>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
          {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
        </p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ display: "inline-block", marginTop: "16px", padding: "8px 20px", fontSize: "0.85rem" }}
          aria-label={`Open ${venueName} in Google Maps`}
        >
          Open in Google Maps ↗
        </a>
      </div>
    </div>
  );
}

export default GoogleMapEmbed;
