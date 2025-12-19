const { google } = require('googleapis');
require('dotenv').config();

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

function getAuthUrl() {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
}

async function getTokens(code) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
}

async function checkEmailStatus(auth, emailToVerify) {
    const gmail = google.gmail({ version: 'v1', auth });
    try {
        // Search in 'sent' messages
        const res = await gmail.users.messages.list({
            userId: 'me',
            q: `to:${emailToVerify} label:SENT`,
            maxResults: 1
        });

        const hasSent = res.data.resultSizeEstimate > 0 || (res.data.messages && res.data.messages.length > 0);
        return { email: emailToVerify, status: hasSent ? 'Sent' : 'Not Found' };
    } catch (error) {
        console.error(`Error checking ${emailToVerify}:`, error);
        return { email: emailToVerify, status: 'Error', error: error.message };
    }
}

module.exports = {
    oauth2Client,
    getAuthUrl,
    getTokens,
    checkEmailStatus
};
