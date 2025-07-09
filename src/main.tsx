import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("App starting...");

createRoot(document.getElementById("root")!).render(<App />);

// Unregister any existing service workers to prevent fetch interference
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log("Service worker unregistered:", registration);
    }
  });
}
