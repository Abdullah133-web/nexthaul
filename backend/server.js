// backend/server.js
const express = require('express');
const cors = require('cors');
const sendContactEmail = require('./sendContactEmail');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { role, email, llcName, phone, message } = req.body;

  // Basic Validation
  if (!role || !email || !llcName || !phone || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const result = await sendContactEmail({ role, email, llcName, phone, message });

  if (result.success) {
    return res.status(200).json({ message: "Message sent successfully!" });
  } else {
    return res.status(500).json({ error: result.error || "Failed to send message." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Nexthaul backend running on http://localhost:${PORT}`);
});
