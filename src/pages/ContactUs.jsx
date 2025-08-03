import React, { useState } from 'react';
import './ContactUs.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    llc_name: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('⏳ Submitting your message...');
    setError(null);

    const { error } = await supabase
      .from('contact_submissions')
      .insert([{ ...formData }]);

    if (error) {
      console.error('Submission failed:', error.message);
      setError(`❌ Message failed to send: ${error.message}`);
      setStatus('');
    } else {
      setShowPopup(true);
      setStatus('');
      setFormData({
        role: '',
        email: '',
        llc_name: '',
        phone: '',
        message: '',
      });
      setTimeout(() => setShowPopup(false), 4000);
    }
  };

  return (
    <div className="contact-container">
      <Navbar />

      <div className="contact-content">
        <h1>Contact Us</h1>
        <p>Have a question or idea? We'd love to hear from you.</p>

        <form onSubmit={handleSubmit} className="contact-form">
          {error && <p className="error-msg">{error}</p>}
          {status && <p className="status-msg">{status}</p>}

          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select your role</option>
            <option value="driver">Driver</option>
            <option value="broker">Broker</option>
            <option value="carrier">Carrier</option>
            <option value="other">Other</option>
          </select>

          <label>Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <label>LLC Name</label>
          <input
            type="text"
            name="llc_name"
            required
            value={formData.llc_name}
            onChange={handleChange}
          />

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Message</label>
          <textarea
            name="message"
            rows="4"
            required
            value={formData.message}
            onChange={handleChange}
          />

          <button type="submit">Send Message</button>
        </form>

        {showPopup && (
          <div className="success-popup">
            ✅ Message sent! We'll get back to you shortly.
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
