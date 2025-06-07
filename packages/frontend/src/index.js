import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { WebSocketProvider } from './context/WebSocketContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProviderCustom } from './context/ThemeModeContext';

import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WebSocketProvider>
      <AuthProvider>
        <ThemeProviderCustom>
          <App />
        </ThemeProviderCustom>
      </AuthProvider>
    </WebSocketProvider>
  </React.StrictMode>
);

reportWebVitals();
