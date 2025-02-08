const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = 3000;

// ✅ Twilio Credentials (Directly Inside server.js)
const accountSid = 'ACe4028e07aabb3c1e3da733149e5b2dc0';
const authToken = '80cd85c700e30db37fd82c95b0403648';
const twilioNumber = '+16677713723';

const client = new twilio(accountSid, authToken);

// ✅ Enable CORS for Frontend URL
app.use(cors({ origin: '*' }));
app.use(express.json());

// ✅ SMS API Endpoint
app.post('/send-sms', async (req, res) => {
    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ success: false, error: 'Missing "to" or "message" field' });
    }

    try {
        const sms = await client.messages.create({ body: message, from: twilioNumber, to });
        console.log('📩 Message Sent! SID:', sms.sid);
        res.json({ success: true, message: 'SMS sent!', sid: sms.sid });
    } catch (err) {
        console.error('❌ Twilio Error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ✅ Start Server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
