import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { EventProvider, useEvent } from "./context/EventContext";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./components/AuthGuard";
import Navigation from "./components/Navigation";
import DemoModeBanner from "./components/DemoModeBanner";
import { trackPageView } from "./services/analytics";

const HomePage = lazy(() => import("./pages/HomePage"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const HeatmapPage = lazy(() => import("./pages/HeatmapPage"));
const QueuePage = lazy(() => import("./pages/QueuePage"));
const LocatorPage = lazy(() => import("./pages/LocatorPage"));
const AlertsPage = lazy(() => import("./pages/AlertsPage"));

/** Tracks page views on every route change via Google Analytics. */
function AnalyticsTracker() {
  const location = useLocation();
  useEffect(() => {
    const titles = {
      "/": "Home",
      "/wallet": "Wallet",
      "/heatmap": "Heatmap",
      "/queue": "Queue",
      "/locator": "Locator",
      "/alerts": "Alerts",
    };
    trackPageView(location.pathname, titles[location.pathname] ?? location.pathname);
  }, [location]);
  return null;
}

function AppContent() {
  const { settings } = useEvent();

  return (
    <main
      id="main-content"
      className={`app-shell${settings.highContrast ? " app-shell--high-contrast" : ""}${
        settings.largeText ? " app-shell--large-text" : ""
      }`}
    >
      <AnalyticsTracker />
      <Suspense fallback={<div className="loading-skeleton fade-in">Loading…</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/locator" element={<LocatorPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
        </Routes>
      </Suspense>
      <Navigation />
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <BrowserRouter>
          <DemoModeBanner />
          {/* Skip-to-content link for keyboard users */}
          <a
            href="#main-content"
            className="skip-link"
            onFocus={(e) => (e.target.style.top = "0")}
            onBlur={(e) => (e.target.style.top = "-100px")}
          >
            Skip to main content
          </a>
          <AuthGuard>
            <AppContent />
          </AuthGuard>
        </BrowserRouter>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
