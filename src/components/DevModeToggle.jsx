import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { FiCode } from 'react-icons/fi';
import { useDevMode } from '../context/DevModeContext';

function DevModeToggle() {
  const { isDevMode, toggleDevMode } = useDevMode();
  
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleDevMode}
      className={`fixed bottom-20 right-4 z-40 p-3 rounded-full shadow-lg ${
        isDevMode ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
      }`}
      title={isDevMode ? 'Disable Dev Mode' : 'Enable Dev Mode'}
    >
      <SafeIcon icon={FiCode} className={isDevMode ? 'animate-pulse' : ''} />
    </motion.button>
  );
}

export default DevModeToggle;