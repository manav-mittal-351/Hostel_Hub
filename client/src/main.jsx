import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// --- Extension Error Shield ---
// Suppressing harmless but noisy browser extension/internal Chromium errors
const suppressBrowserErrors = () => {
    const originalError = console.error;
    const noisyErrors = [
        'translate-page',
        'save-page',
        'play() request was interrupted',
        'A listener indicated an asynchronous response'
    ];

    console.error = (...args) => {
        const message = args.join(' ');
        if (noisyErrors.some(noisy => message.includes(noisy))) {
            return; // Silence internal browser noise
        }
        originalError.apply(console, args);
    };

    window.addEventListener('unhandledrejection', (event) => {
        const message = event.reason?.message || '';
        if (noisyErrors.some(noisy => message.includes(noisy))) {
            event.preventDefault(); // Prevent crash loop from browser extensions
        }
    });
};
suppressBrowserErrors();
// -----------------------------

// Set axios base URL for API requests
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>,
)
