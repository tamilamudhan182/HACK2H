import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { reportWebVitals } from "./utils/webVitals";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Report Core Web Vitals to Google Analytics
reportWebVitals();

// Register service worker for offline support and fast repeat loads
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[SW] Registration failed:", err);
    });
  });
}
