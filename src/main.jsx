import { Buffer } from 'buffer';
import process from 'process/browser';

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

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
