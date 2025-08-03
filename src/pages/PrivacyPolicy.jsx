import React from 'react';
import './PolicyPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">
      <h1>Privacy Policy</h1>
      <p>
        Nexthaul respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we handle your information when you use our platform.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Contact Information (Name, Email, Phone)</li>
        <li>Company Details (LLC Name, MC Number)</li>
        <li>Usage Data (Load Activity, Uploaded Documents)</li>
      </ul>

      <h2>How We Use Your Data</h2>
      <p>
        We use your data to provide services like load matching, compliance verification, document management, and account communication. We never sell your data.
      </p>

      <h2>Your Rights</h2>
      <p>
        You can request access, updates, or deletion of your data at any time by contacting <a href="mailto:support@nexthaul.net">support@nexthaul.net</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
