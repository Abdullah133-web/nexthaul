import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import RootApp from './RootApp';
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga4';

// ✅ Google Analytics
const MEASUREMENT_ID = 'G-N4JEFWM0PX';
if (MEASUREMENT_ID) {
  ReactGA.initialize(MEASUREMENT_ID);
}

// ✅ Dark Mode Toggle (optional but clean)
if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark-mode');
} else {
  document.body.classList.remove('dark-mode');
}

// ✅ React 18 createRoot API
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RootApp />
    </React.StrictMode>
  );
} else {
  console.error("❌ Root element not found!");
}

reportWebVitals();
