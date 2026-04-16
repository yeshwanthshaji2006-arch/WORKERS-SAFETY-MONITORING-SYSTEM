const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 EMAIL CONFIG (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yeshwanthshaji2006@gmail.com",
    pass: "oveuwjxslosgkpjv"
  }
});

// 🚨 ALERT API
app.post("/send-alert", async (req, res) => {
  try {
    const data = req.body;

    let cause = "Normal";
    let precaution = "No action needed";

    if (data.FALL == 1) {
      cause = "Worker fall detected";
      precaution = "Check worker immediately and provide medical help.";
    } else if (data.CO > 2500) {
      cause = "High gas exposure,go with safety measures";
      precaution = "Move worker to fresh air immediately.";
    }

    const lat = data.LAT || 0;
    const lng = data.LNG || 0;

    const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;

    const message = `
WORKER IDENTITY: ${data.ID || "RAVI KUMAR W-102"}

HR: ${data.HR}
CO: ${data.CO}

CAUSE:
${cause}

SAFETY PRECAUTIONS:
${precaution}

LOCATION:
${mapLink}
`;

    await transporter.sendMail({
      from: "yeshwanthshaji2006@gmail.com",
      to: "shajivanitha@gmail.com",
      subject: "🚨 WORKER SAFETY ALERT",
      text: message
    });

    console.log("✅ ALERT SENT");
    res.send("Alert sent");

  } catch (err) {
    console.log(err);
    res.status(500).send("Error sending alert");
  }
});

// 🚀 START SERVER
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});