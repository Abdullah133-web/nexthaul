import React from 'react';
import './AboutUs.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <div className="about-container">
      <Navbar />

      <section className="about-hero">
        <h1>Driving the Future of Freight</h1>
        <p className="tagline">Where Technology Meets Trucking</p>
      </section>

      <section className="founder-section">
        <div className="founder-card">
          <h2>Leadership & Vision</h2>
          <p>
            Nexthaul was born from a relentless drive to solve real-world inefficiencies in the logistics space. From day one, our mission has been to empower carriers, drivers, and brokers through intuitive tools and powerful automation.
          </p>
          <p>
            Guided by principles of transparency, innovation, and trust, Nexthaul is engineered to be more than just a platform — it's a movement to redefine how modern freight logistics should work.
          </p>
        </div>
      </section>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          To revolutionize trucking logistics with simplicity and intelligence. We eliminate inefficiencies, enhance transparency, and offer a centralized solution for load management, compliance, and live tracking.
        </p>
      </section>

      <section className="why-section">
        <h2>Why Nexthaul?</h2>
        <ul>
          <li>✅ Streamlined operations for carriers and drivers</li>
          <li>✅ Powerful tools for brokers to manage loads</li>
          <li>✅ Real-time compliance & document management</li>
          <li>✅ Live tracking, seamless communication, and smart analytics</li>
        </ul>
      </section>

      <section className="journey-section">
        <h2>Our Journey</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="dot" />
            <div className="content">
              <h4>2024 — The Vision Begins</h4>
              <p>Frustrated by outdated systems, the blueprint for Nexthaul was born.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="dot" />
            <div className="content">
              <h4>2025 — Platform Launch</h4>
              <p>Nexthaul launches with load tracking, driver compliance, and broker tools.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="dot" />
            <div className="content">
              <h4>Future — Beyond Freight</h4>
              <p>We aim to expand into ELD, insurance, and global freight innovation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="achievements-section">
        <h2>Key Achievements</h2>
        <ul>
          <li>🚛 100+ carriers onboarded within 2 months</li>
          <li>📈 500+ loads managed seamlessly</li>
          <li>🔐 100% compliance rate through document automation</li>
          <li>🌐 Rapidly growing user base across the U.S.</li>
        </ul>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
