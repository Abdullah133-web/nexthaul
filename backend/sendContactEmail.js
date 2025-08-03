// backend/sendContactEmail.js
const nodemailer = require('nodemailer');

const sendContactEmail = async (formData) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: 'support@nexthaul.net',     // <-- Replace with your Zoho email
      pass: 'XRSpVejattkL',                 // <-- Your Zoho App Password
    },
  });

  const mailOptions = {
    from: '"Nexthaul Contact" <support@nexthaul.net>', // Replace this too
    to: 'support@nexthaul.net', // Email where messages should go
    subject: '🚛 New Contact Submission - Nexthaul',
    html: `
      <h2>Contact Form Submission</h2>
      <p><strong>Role:</strong> ${formData.role}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>LLC Name:</strong> ${formData.llcName}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Message:</strong></p>
      <p>${formData.message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    return { success: true };
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendContactEmail;
