# Email Status Checker

## Overview
Email Status Checker is a web application that helps you verify if you have previously contacted a list of email addresses. 

**How it works:**
1.  **Upload**: You upload an Excel file (`.xlsx`, `.xls`) containing email addresses.
2.  **Authenticate**: You sign in with your Google account.
3.  **Verify**: The app checks your Gmail "Sent" folder to see if you have sent emails to any of the addresses in your list.
4.  **Results**: It displays a status for each email: "Sent", "Not Found", or "Error".

## Features
*   **Excel Parsing**: Automatically extracts email addresses from uploaded spreadsheets.
*   **Gmail Integration**: Securely connects to your Gmail account using OAuth 2.0.
*   **Real-time Status**: Checks valid emails against your sent history.
*   **Secure**: uses Google's official APIs and does not store your emails permanently; tokens are stored locally for session management.
*   **Modern UI**: Built with React and Tailwind CSS for a clean, responsive experience.

## Tech Stack
*   **Frontend**: React, Vite, Tailwind CSS, Lucide React (Icons), SheetJS (xlsx)
*   **Backend**: Node.js, Express, Googleapis (Gmail API)

## Prerequisites
*   Node.js (v14+ recommended)
*   npm
*   A Google Cloud Project with the **Gmail API** enabled.
*   OAuth 2.0 Credentials (Client ID and Client Secret) from Google Cloud Console.

## Installation & Setup

### 1. Backend Setup
1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory with your Google credentials:
    ```env
    PORT=5001
    GOOGLE_CLIENT_ID=your_client_id
    GOOGLE_CLIENT_SECRET=your_client_secret
    GOOGLE_REDIRECT_URI=http://localhost:5173
    ```
    > **Note:** Ensure your Google Cloud Console "Authorized redirect URIs" matches `http://localhost:5173` exactly.

4.  Start the server:
    ```bash
    node index.js
    ```
    The server will run on `http://localhost:5001`.

### 2. Frontend Setup
1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The client will run on `http://localhost:5173`.

## Usage
1.  Open the frontend URL (`http://localhost:5173`) in your browser.
2.  Click **"Sign in with Google"** to authorize access to your Gmail account (read-only access to messages).
3.  Click the upload area to select your Excel file containing email addresses.
4.  Once loaded, click **"Verify Emails"**.
5.  View the status of each email in the table. Hover over "Error" badges for detailed troubleshooting info.

## Troubleshooting
*   **CORS Errors**: Ensure the backend `PORT` matches what the frontend expects (default `5001`) and that your `GOOGLE_REDIRECT_URI` is correctly configured in both the `.env` file and Google Cloud Console.
*   **Auth Errors**: If you get a 403 or "Error bad request", double-check that your Google Cloud Project has the correct testing users added (if in testing mode) or is published.

## License
MIT
