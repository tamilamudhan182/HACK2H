import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventProvider, useEvent } from "./context/EventContext";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import WalletPage from "./pages/WalletPage";
import HeatmapPage from "./pages/HeatmapPage";
import QueuePage from "./pages/QueuePage";
import LocatorPage from "./pages/LocatorPage";
import AlertsPage from "./pages/AlertsPage";

function AppContent() {
  const { settings } = useEvent();

  return (
    <main
      className={`app-shell${settings.highContrast ? " app-shell--high-contrast" : ""}${
        settings.largeText ? " app-shell--large-text" : ""
      }`}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/heatmap" element={<HeatmapPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/locator" element={<LocatorPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
      </Routes>
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
