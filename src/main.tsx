
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

console.log('Clerk key status:', PUBLISHABLE_KEY ? 'Found' : 'Missing');
console.log('App starting...');

// Temporary bypass for debugging - remove this once Clerk is set up
if (!PUBLISHABLE_KEY) {
  console.warn("Missing Clerk Publishable Key - running without authentication");
  createRoot(document.getElementById("root")!).render(
    <App />
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  );
}

// Comment out service worker registration temporarily to avoid conflicts
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('SW registered: ', registration);
//       })
//       .catch((registrationError) => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }
