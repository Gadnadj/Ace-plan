import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register service worker for PWA (production only)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = '/sw.js';
    navigator.serviceWorker
      .register(swPath)
      .then((reg) => {
        // registration successful
        console.log('Service worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
  });
}
