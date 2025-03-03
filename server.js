const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = 3000;

// ✅ Twilio Credentials (Directly in Code)
const accountSid = 'AC3bdfe45853860bad2307724f5522da23';
const authToken = 'dc6484114be4be7e920ac40b0eaa0cd7';
const twilioNumber = '+17177948897';

const client = new twilio(accountSid, authToken);

// ✅ Enable CORS for frontend requests
app.use(cors({ origin: '*' }));
app.use(express.json());

// ✅ Function to Convert to GSM-7 Encoding (Fixes SIM800L UCS2 Issue)
function convertToGSM7(text) {
    const gsm7Chars = "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\x1BÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
    return text.split("").map(char => (gsm7Chars.includes(char) ? char : "?")).join(""); // Replace non-GSM7 chars
}

// ✅ SMS API Endpoint (Only Sends Latitude & Longitude)
app.post('/send-sms', async (req, res) => {
    const { to, latitude, longitude } = req.body;

    if (!to || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ success: false, error: 'Missing "to", "latitude", or "longitude" field' });
    }

    // ✅ Ensure Message is GSM-7 Encoded (Fix for SIM800L)
    let messageBody = `Drone called! ${latitude},${longitude}`;
    messageBody = convertToGSM7(messageBody);

    try {
        const sms = await client.messages.create({ body: messageBody, from: twilioNumber, to });
        console.log('📩 Message Sent! SID:', sms.sid);
        res.json({ success: true, message: 'SMS sent!', sid: sms.sid });
    } catch (err) {
        console.error('❌ Twilio Error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ✅ Start Server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
