import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import RootApp from './RootApp';
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga4';

// ✅ Google Analytics for NextHaul
const MEASUREMENT_ID = 'G-N4JEFWM0PX';
if (MEASUREMENT_ID) {
  ReactGA.initialize(MEASUREMENT_ID);
  ReactGA.send("pageview");
}

// ✅ Optional: Set dark mode based on system preference
if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark-mode');
} else {
  document.body.classList.remove('dark-mode');
}

// ✅ React 18 root rendering
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RootApp />
    </React.StrictMode>
  );
} else {
  console.error("❌ Root element not found! Make sure your index.html has <div id='root'></div>");
}

// ✅ Optional: Web Vitals reporting
reportWebVitals();
