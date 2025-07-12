import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import {AuthProvider} from './context/AuthContext.jsx';
import {DevModeProvider, setupGlobalErrorHandling} from './context/DevModeContext.jsx';
import './index.css';

// Setup global error handling
setupGlobalErrorHandling();

const root = createRoot(document.getElementById('root'));

// Store DevMode context in a global reference for global error handling
root.render(
  <StrictMode>
    <DevModeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DevModeProvider>
  </StrictMode>
);