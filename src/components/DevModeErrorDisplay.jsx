import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { FiX, FiAlertTriangle, FiTerminal, FiEye, FiTrash2 } from 'react-icons/fi';
import { useDevMode } from '../context/DevModeContext';

function DevModeErrorDisplay() {
  const { isDevMode, errors, clearErrors, clearError } = useDevMode();
  const [expandedError, setExpandedError] = React.useState(null);
  
  if (!isDevMode || errors.length === 0) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-red-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <SafeIcon icon={FiAlertTriangle} className="mr-2" />
            <h3 className="font-bold">Dev Mode: {errors.length} Error{errors.length !== 1 ? 's' : ''}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={clearErrors}
              className="p-1 rounded bg-red-800 hover:bg-red-700 text-white"
              title="Clear all errors"
            >
              <SafeIcon icon={FiTrash2} />
            </button>
            <button 
              onClick={() => setExpandedError(null)}
              className="p-1 rounded bg-red-800 hover:bg-red-700 text-white"
              title="Close error details"
            >
              <SafeIcon icon={FiX} />
            </button>
          </div>
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto">
          <AnimatePresence>
            {errors.map(error => (
              <motion.div 
                key={error.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-2 bg-red-700 rounded p-2"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{error.message}</p>
                    <p className="text-xs text-red-200">
                      {new Date(error.timestamp).toLocaleTimeString()}
                      {error.code && <span className="ml-2">Code: {error.code}</span>}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button 
                      onClick={() => setExpandedError(expandedError === error.id ? null : error.id)}
                      className="p-1 rounded hover:bg-red-600 text-white"
                      title="View details"
                    >
                      <SafeIcon icon={FiEye} size={14} />
                    </button>
                    <button 
                      onClick={() => clearError(error.id)}
                      className="p-1 rounded hover:bg-red-600 text-white"
                      title="Dismiss"
                    >
                      <SafeIcon icon={FiX} size={14} />
                    </button>
                  </div>
                </div>
                
                {expandedError === error.id && error.stack && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 bg-red-900 p-2 rounded overflow-x-auto"
                  >
                    <div className="flex items-center text-xs mb-1">
                      <SafeIcon icon={FiTerminal} className="mr-1" />
                      <span>Stack Trace</span>
                    </div>
                    <pre className="text-xs whitespace-pre-wrap font-mono text-red-100">
                      {error.stack}
                    </pre>
                    
                    {error.details && (
                      <div className="mt-2">
                        <div className="flex items-center text-xs mb-1">
                          <SafeIcon icon={FiTerminal} className="mr-1" />
                          <span>Additional Details</span>
                        </div>
                        <pre className="text-xs whitespace-pre-wrap font-mono text-red-100">
                          {typeof error.details === 'object' 
                            ? JSON.stringify(error.details, null, 2) 
                            : error.details}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default DevModeErrorDisplay;