import React from 'react';
import './LandingPage.css';

function LandingPage({ onStart }) {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo">Nexthaul</div>
        <button className="login-btn" onClick={onStart}>Login</button>
      </nav>

      <header className="landing-header">
        <h2>Streamline Your Trucking Operations</h2>
        <p>Manage loads, track drivers, upload documents, and monitor real-time delivery—all in one platform.</p>
        <button className="cta-btn" onClick={onStart}>Get Started</button>
      </header>

      <section className="features-section">
        <div className="feature">
          <h3>📦 Load Management</h3>
          <p>Easily assign, edit, and monitor loads with real-time updates.</p>
        </div>
        <div className="feature">
          <h3>📍 Live Tracking</h3>
          <p>Track pickup and drop-off locations with interactive maps.</p>
        </div>
        <div className="feature">
          <h3>📁 Compliance Uploads</h3>
          <p>Store important documents like insurance, MC numbers, and licenses.</p>
        </div>
      </section>

      <section className="counters-section">
        <div className="counter-box">
          <h2 className="counter" data-target="1200">1200</h2>
          <p>Loads Delivered</p>
        </div>
        <div className="counter-box">
          <h2 className="counter" data-target="150">150</h2>
          <p>Active Drivers</p>
        </div>
        <div className="counter-box">
          <h2 className="counter" data-target="10">10</h2>
          <p>States Covered</p>
        </div>
      </section>

      <section className="pricing-section">
        <h2>Pricing</h2>
        <div className="pricing-boxes">
          <div className="pricing-box">
            <h3>Starter</h3>
            <p><strong>$0/month</strong></p>
            <ul>
              <li>Up to 10 Loads</li>
              <li>1 User</li>
              <li>Email Support</li>
            </ul>
          </div>
          <div className="pricing-box featured">
            <h3>Pro</h3>
            <p><strong>$29/month</strong></p>
            <ul>
              <li>Unlimited Loads</li>
              <li>Up to 5 Users</li>
              <li>Priority Support</li>
            </ul>
          </div>
          <div className="pricing-box">
            <h3>Enterprise</h3>
            <p><strong>Custom</strong></p>
            <ul>
              <li>Advanced Features</li>
              <li>Unlimited Users</li>
              <li>Dedicated Support</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What Our Clients Say</h2>
        <div className="testimonial">
          <p>"Nexthaul transformed how we manage loads. Everything is in one place now!"</p>
          <strong>- Sarah J., Fleet Manager</strong>
        </div>
        <div className="testimonial">
          <p>"Live tracking and document uploads made our compliance so easy!"</p>
          <strong>- Mike T., Broker</strong>
        </div>
      </section>

      <footer className="landing-footer">
        &copy; {new Date().getFullYear()} Nexthaul. All rights reserved.
        <p style={{ fontSize: '12px', color: 'gray', marginTop: '0.5rem' }}>
          *Nexthaul is not affiliated with or endorsed by the Federal Motor Carrier Safety Administration (FMCSA).
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
