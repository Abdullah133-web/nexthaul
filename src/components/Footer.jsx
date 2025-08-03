import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>📧 For support: <a href="mailto:support@nexthaul.net">support@nexthaul.net</a></p>
        
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
        </div>

        <p>&copy; {new Date().getFullYear()} Nexthaul. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
