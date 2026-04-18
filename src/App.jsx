import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventProvider, useEvent } from "./context/EventContext";
import Navigation from "./components/Navigation";

const HomePage = lazy(() => import("./pages/HomePage"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const HeatmapPage = lazy(() => import("./pages/HeatmapPage"));
const QueuePage = lazy(() => import("./pages/QueuePage"));
const LocatorPage = lazy(() => import("./pages/LocatorPage"));
const AlertsPage = lazy(() => import("./pages/AlertsPage"));

function AppContent() {
  const { settings } = useEvent();

  return (
    <main
      className={`app-shell${settings.highContrast ? " app-shell--high-contrast" : ""}${
        settings.largeText ? " app-shell--large-text" : ""
      }`}
    >
      <Suspense fallback={<div className="loading-skeleton fade-in">Loading component mapping...</div>}>
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
    <EventProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </EventProvider>
  );
}

export default App;
