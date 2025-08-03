import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';

function LandingPage({ onStart }) {
  return (
    <div className="landing-container">
      {/* ... all other sections ... */}

      <footer className="footer">
        <div className="footer-section">
          <h4>About Nexthaul</h4>
          <p>Nexthaul simplifies logistics for carriers, brokers, and drivers across the U.S.</p>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: <a href="mailto:support@nexthaul.net">support@nexthaul.net</a></p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Nexthaul. All rights reserved.</p>
          <p style={{ fontSize: '12px', color: 'gray', marginTop: '0.5rem' }}>
            *Nexthaul is not affiliated with or endorsed by the Federal Motor Carrier Safety Administration (FMCSA).
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
