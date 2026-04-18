import { NavLink } from "react-router-dom";

function Navigation() {
  const tabs = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/wallet", label: "Wallet", icon: "💳" },
    { to: "/heatmap", label: "Heatmap", icon: "🗺️" },
    { to: "/queue", label: "Queue", icon: "⏳" },
    { to: "/locator", label: "Locator", icon: "📍" },
    { to: "/alerts", label: "Alerts", icon: "🔔" },
  ];

  return (
    <nav className="nav-dock">
      {tabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span style={{ fontSize: "1.25rem", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>{tab.icon}</span>
          <span style={{ fontSize: "0.65rem", fontWeight: "600", letterSpacing: "0.02em" }}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default Navigation;
