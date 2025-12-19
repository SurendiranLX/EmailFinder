import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import StatusTable from './components/StatusTable';
import { parseExcel } from './utils/excelParser';
import { Mail, ShieldCheck, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

function App() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    // Check for auth code in URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      handleAuthCallback(code);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check local storage for tokens
    const storedTokens = localStorage.getItem('gmail_tokens');
    if (storedTokens) {
      setTokens(JSON.parse(storedTokens));
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthCallback = async (code) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/callback`, { code });
      setTokens(res.data);
      localStorage.setItem('gmail_tokens', JSON.stringify(res.data));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/url`);
      window.location.href = res.data.url;
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) {
      setEmails([]);
      return;
    }

    try {
      setLoading(true);
      const extractedEmails = await parseExcel(file);
      setEmails(extractedEmails.map(email => ({ email, status: 'Pending' })));
    } catch (error) {
      console.error('Parse error:', error);
      alert('Failed to parse Excel file.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!isAuthenticated) {
      alert('Please sign in with Google first.');
      return;
    }
    if (emails.length === 0) return;

    setChecking(true);
    // Optimistic update
    setEmails(prev => prev.map(e => ({ ...e, status: 'Checking' })));

    try {
      const response = await axios.post(`${API_URL}/check-status`, {
        emails: emails.map(e => e.email),
        tokens
      });

      // Update with results
      // Create a map for O(1) lookup
      const resultMap = new Map(response.data.results.map(r => [r.email, r]));

      setEmails(prev => prev.map(e => ({
        ...e,
        status: resultMap.get(e.email)?.status || 'Error',
        error: resultMap.get(e.email)?.error
      })));

    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please sign in again.');
        setIsAuthenticated(false);
        setTokens(null);
        localStorage.removeItem('gmail_tokens');
      } else {
        console.error('Check status error:', error);
        alert('Failed to check status.');
        setEmails(prev => prev.map(e => ({ ...e, status: 'Pending' })));
      }
    } finally {
      setChecking(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('gmail_tokens');
    setTokens(null);
    setIsAuthenticated(false);
    setEmails([]); // Clear data on logout
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-600/20">
              <Mail size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              EmailStatus<span className="text-slate-700 font-medium">Checker</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-700 hover:bg-red-100 flex items-center gap-2 transition-all hover:shadow-sm"
              >
                <ShieldCheck size={16} />
                Logout
              </button>
            ) : (
              <button
                onClick={login}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-all hover:shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Verify your sent emails effortlessly.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Upload an Excel sheet containing email addresses, and we'll check your Gmail Sent folder to verify if they've been contacted.
          </p>
        </div>

        <FileUpload onFileSelect={handleFileSelect} />

        {loading && (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
          </div>
        )}

        {!loading && emails.length > 0 && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-slate-800">Results</h3>
              <button
                onClick={handleCheckStatus}
                disabled={checking || !isAuthenticated}
                className={`
                            px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 text-white flex items-center gap-2 transition-all
                            ${checking || !isAuthenticated
                    ? 'bg-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-105 active:scale-95'
                  }
                        `}
              >
                {checking ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                {checking ? 'Checking Status...' : 'Verify Emails'}
              </button>
            </div>
            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-start gap-3">
                <ShieldCheck size={18} className="mt-0.5 shrink-0" />
                <p>You need to sign in with your Google account to verify verify these emails against your Sent folder.</p>
              </div>
            )}

            <StatusTable data={emails} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
