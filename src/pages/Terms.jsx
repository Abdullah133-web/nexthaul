import React from 'react';
import './PolicyPages.css';

const Terms = () => {
  return (
    <div className="policy-container">
      <h1>Terms & Conditions</h1>
      <p>
        These Terms govern your access and use of the Nexthaul platform. By signing up, you agree to abide by these rules.
      </p>

      <h2>Usage</h2>
      <ul>
        <li>You must provide accurate business and driver information.</li>
        <li>Using Nexthaul for fraudulent or illegal activities is strictly prohibited.</li>
        <li>We reserve the right to suspend accounts that violate these terms.</li>
      </ul>

      <h2>Payments</h2>
      <p>
        All paid plans are billed monthly or annually based on your subscription. You may cancel anytime, and cancellations take effect at the end of the billing period.
      </p>

      <h2>Contact</h2>
      <p>
        For questions, reach out to <a href="mailto:support@nexthaul.net">support@nexthaul.net</a>.
      </p>
    </div>
  );
};

export default Terms;
