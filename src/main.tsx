import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Lenis from 'lenis';

console.log("App starting...");

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA install prompt
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  touchMultiplier: 2,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
