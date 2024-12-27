import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CssBaseline } from '@mui/material'; // Added to apply Material-UI's baseline styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssBaseline /> {/* Apply Material-UI's baseline styles */}
    <App />
  </React.StrictMode>
);
