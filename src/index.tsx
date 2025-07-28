import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import RootApp from './RootApp';
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga4';

// Initialize Google Analytics
const MEASUREMENT_ID = 'G-N4JEFWM0PX';
ReactGA.initialize(MEASUREMENT_ID);

// Optional: Auto apply dark mode if system prefers it
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
document.body.classList.toggle('dark-mode', prefersDark);

// Mount app
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);

reportWebVitals();
