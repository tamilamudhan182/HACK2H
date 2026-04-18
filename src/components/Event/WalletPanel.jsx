function WalletPanel({ attendee, wallet, settings, onAddMoney, onBuyPass, onToggleSetting }) {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      {/* The Physical Card */}
      <section style={{ 
        background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.02))",
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-4)",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)",
        backdropFilter: "blur(24px)"
      }}>
        {/* Holographic effect */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "150px", height: "150px", background: "radial-gradient(circle, rgba(212,175,55,0.4), transparent 70%)", filter: "blur(30px)", opacity: 0.5 }}></div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
          <div>
            <p style={{ textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>Digital Access Pass</p>
            <h2 style={{ fontSize: "2.2rem", marginTop: "8px", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>INR {wallet.balance.toFixed(2)}</h2>
          </div>
          <div style={{ background: "#fff", padding: "8px", borderRadius: "8px", display: "grid", gridTemplateColumns: "repeat(3, 8px)", gap: "2px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
            {/* Mock QR Code */}
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{ width: "8px", height: "8px", background: i % 2 === 0 ? "#000" : "transparent" }}></div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", position: "relative", zIndex: 1 }}>
          <div>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Cardholder</p>
            <p style={{ fontWeight: "600", letterSpacing: "0.05em", fontSize: "1.1rem" }}>{attendee.name}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Seat</p>
            <p style={{ fontWeight: "600", letterSpacing: "0.05em", fontSize: "1.1rem" }}>{attendee.seatLabel}</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="wallet-actions" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-3)" }}>
        <button className="btn-primary" onClick={() => onAddMoney("UPI", 500)}>+ Add INR 500</button>
        <button className="btn-secondary" onClick={() => onBuyPass()}>Buy Metro Pass</button>
      </section>

      {/* Transaction History */}
      <h3 style={{ marginTop: "var(--spacing-3)" }}>Recent Activity</h3>
      <section style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
        {wallet.history.map((tx) => (
          <div key={tx.id} className="panel-card" style={{ padding: "var(--spacing-3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontWeight: "600", color: "#fff" }}>{tx.label}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{tx.timestamp} • {tx.channel}</p>
            </div>
            <strong style={{ fontSize: "1.1rem", color: tx.type === "credit" ? "var(--color-accent)" : "var(--color-danger)" }}>
              {tx.type === "credit" ? "+" : "-"}INR {Math.abs(tx.amount)}
            </strong>
          </div>
        ))}
      </section>
      
      {/* Settings */}
      <h3 style={{ marginTop: "var(--spacing-3)" }}>Settings</h3>
      <section className="panel-card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: "500" }}>High Contrast Mode</span>
          <button 
            onClick={() => onToggleSetting("highContrast")} 
            style={{ width: "48px", height: "28px", background: settings.highContrast ? "var(--color-primary)" : "rgba(255,255,255,0.1)", borderRadius: "14px", position: "relative", transition: "all 0.3s" }}
          >
            <div style={{ position: "absolute", top: "4px", left: settings.highContrast ? "24px" : "4px", width: "20px", height: "20px", background: "#fff", borderRadius: "50%", transition: "left 0.3s", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}></div>
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: "500" }}>Large Text</span>
          <button 
            onClick={() => onToggleSetting("largeText")} 
            style={{ width: "48px", height: "28px", background: settings.largeText ? "var(--color-primary)" : "rgba(255,255,255,0.1)", borderRadius: "14px", position: "relative", transition: "all 0.3s" }}
          >
            <div style={{ position: "absolute", top: "4px", left: settings.largeText ? "24px" : "4px", width: "20px", height: "20px", background: "#fff", borderRadius: "50%", transition: "left 0.3s", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}></div>
          </button>
        </div>
      </section>
    </div>
  );
}

export default WalletPanel;
