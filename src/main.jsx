import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Service worker disabled for now (PWA setup, but cache conflict with API)
// Re-enable after fixing cache strategy
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     const swPath = '/sw.js';
//     navigator.serviceWorker
//       .register(swPath)
//       .then((reg) => {
//         console.log('Service worker registered:', reg.scope);
//       })
//       .catch((err) => {
//         console.warn('Service worker registration failed:', err);
//       });
//   });
// }
