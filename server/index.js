const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',
    'https://email-finder-d51q5ezg6-surendiran87s-projects.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('Email Status Checker API is running');
});

// Auth Route placeholders
const { getAuthUrl, getTokens, checkEmailStatus, oauth2Client } = require('./gmailClient');

app.get('/api/auth/url', (req, res) => {
    const url = getAuthUrl();
    res.json({ url });
});

app.post('/api/auth/callback', async (req, res) => {
    const { code } = req.body;
    try {
        const tokens = await getTokens(code);
        res.json(tokens);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/check-status', async (req, res) => {
    const { emails, tokens } = req.body;

    if (!tokens) {
        return res.status(401).json({ error: 'No tokens provided' });
    }

    oauth2Client.setCredentials(tokens);

    try {
        const results = await Promise.all(emails.map(email => checkEmailStatus(oauth2Client, email)));
        res.json({ results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process' });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
