import React, { createContext, useContext, useState, useEffect } from 'react';

const DevModeContext = createContext();

export function DevModeProvider({ children }) {
  const [isDevMode, setIsDevMode] = useState(false);
  const [errors, setErrors] = useState([]);
  
  // Initialize from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('devMode') === 'true';
    setIsDevMode(savedMode);
  }, []);
  
  // Toggle dev mode
  const toggleDevMode = () => {
    const newMode = !isDevMode;
    setIsDevMode(newMode);
    localStorage.setItem('devMode', String(newMode));
  };
  
  // Add error to the list
  const logError = (error) => {
    if (!isDevMode) return;
    
    const errorObj = {
      id: Date.now(),
      message: error.message || String(error),
      stack: error.stack,
      timestamp: new Date().toISOString(),
      details: error.details || null,
      code: error.code || null
    };
    
    setErrors(prev => [errorObj, ...prev].slice(0, 10)); // Keep last 10 errors
  };
  
  // Clear all errors
  const clearErrors = () => {
    setErrors([]);
  };
  
  // Clear a specific error
  const clearError = (errorId) => {
    setErrors(prev => prev.filter(err => err.id !== errorId));
  };
  
  return (
    <DevModeContext.Provider value={{ 
      isDevMode, 
      toggleDevMode, 
      errors, 
      logError, 
      clearErrors,
      clearError
    }}>
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  const context = useContext(DevModeContext);
  if (!context) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
}

// Global error handler
export function setupGlobalErrorHandling() {
  if (typeof window !== 'undefined') {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError.apply(console, args);
      
      // Get current context if available
      try {
        const devModeContext = document.querySelector('#root')?.__REACT_DEVMODE_CONTEXT__;
        if (devModeContext && devModeContext.logError && args[0]) {
          devModeContext.logError(args[0]);
        }
      } catch (e) {
        // Fail silently if we can't access the context
      }
    };
  }
}