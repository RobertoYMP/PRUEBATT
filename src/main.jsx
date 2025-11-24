// src/main.jsx
import { Buffer } from 'buffer';
import process from 'process';

window.global = window;
window.Buffer = window.Buffer || Buffer;
window.process = window.process || process;

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/theme.css';
import './styles/typography.css';
import './styles/global.css';

import { NotificationProvider } from './context/NotificationContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotificationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NotificationProvider>
  </React.StrictMode>
);
