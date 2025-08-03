import React, { useEffect } from 'react';
import './LandingPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  useEffect(() => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach((counter) => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const current = +counter.innerText;
        const increment = Math.ceil(target / 100);
        if (current < target) {
          counter.innerText = current + increment;
          setTimeout(updateCount, 30);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  }, []);

  return (
    <div className="landing-container">
      <Navbar />

      <header className="hero-section">
        <h1>Revolutionize Your Trucking Operations</h1>
        <p>
          Manage loads, track drivers, upload documents, and monitor real-time delivery — all in one powerful platform.
        </p>
        <a href="/signup" className="cta-btn">Get Started</a>
      </header>

      <section className="features-section" id="features">
        <h2>Powerful Features</h2>
        <div className="features-grid">
          <div className="feature-box">
            <h3>📦 Load Management</h3>
            <p>Create, assign, and track loads easily with real-time updates.</p>
          </div>
          <div className="feature-box">
            <h3>📍 Live Tracking</h3>
            <p>See pickup/drop-off in real-time on an interactive map.</p>
          </div>
          <div className="feature-box">
            <h3>📁 Compliance Uploads</h3>
            <p>Upload MC, CDL, insurance & get document expiry alerts.</p>
          </div>
        </div>
      </section>

      <section className="counter-section">
        <div className="counter-box">
          <h2 className="counter" data-target="1200">0</h2>
          <p>Loads Delivered</p>
        </div>
        <div className="counter-box">
          <h2 className="counter" data-target="150">0</h2>
          <p>Active Drivers</p>
        </div>
        <div className="counter-box">
          <h2 className="counter" data-target="10">0</h2>
          <p>States Covered</p>
        </div>
      </section>

      <section className="testimonials-section" id="testimonials">
        <h2>What Our Clients Say</h2>
        <blockquote>
          "Nexthaul transformed how we manage our logistics. Game changer!"
          <br /><span>- Sarah J., Fleet Manager</span>
        </blockquote>
        <blockquote>
          "Live tracking and digital compliance made my life easy."
          <br /><span>- Mike T., Broker</span>
        </blockquote>
      </section>

      <section className="pricing-section" id="pricing">
        <h2>Pricing</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Starter</h3>
            <p>$0 / month</p>
            <ul>
              <li>Up to 10 Loads</li>
              <li>1 User</li>
              <li>Email Support</li>
            </ul>
          </div>
          <div className="pricing-card featured">
            <h3>Pro</h3>
            <p>$29 / month</p>
            <ul>
              <li>Unlimited Loads</li>
              <li>5 Users</li>
              <li>Priority Support</li>
            </ul>
          </div>
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <p>Custom</p>
            <ul>
              <li>Unlimited Features</li>
              <li>Unlimited Users</li>
              <li>Dedicated Manager</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />

      <footer className="footer">
        <div className="footer-content">
          <p>
            📧 For support: <a href="mailto:support@nexthaul.net">support@nexthaul.net</a>
          </p>
          <p>&copy; {new Date().getFullYear()} Nexthaul. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
