import React, { useState, useEffect } from 'react';
import SafeIcon from '../../common/SafeIcon';
import { FiClock } from 'react-icons/fi';

function CountdownTimer({ expiryTimeInSeconds = 1800, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(expiryTimeInSeconds);
  const [isExpired, setIsExpired] = useState(false);
  
  useEffect(() => {
    // Start countdown
    if (timeLeft <= 0) {
      setIsExpired(true);
      if (onExpire) onExpire();
      return;
    }
    
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(intervalId);
          setIsExpired(true);
          if (onExpire) onExpire();
          return 0;
        }
        return newTime;
      });
    }, 1000);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [timeLeft, onExpire]);
  
  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate percentage for progress bar
  const progressPercentage = (timeLeft / expiryTimeInSeconds) * 100;
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-2 text-gray-600">
        <SafeIcon icon={FiClock} className="mr-2" />
        <span className={`font-mono ${isExpired ? 'text-red-500' : ''}`}>
          {isExpired ? 'Verlopen' : formatTime()}
        </span>
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${isExpired ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${progressPercentage}%`, transition: 'width 1s linear' }}
        ></div>
      </div>
      
      {isExpired && (
        <p className="text-sm text-red-500 mt-2">
          De verificatiecode is verlopen. Vraag een nieuwe code aan.
        </p>
      )}
    </div>
  );
}

export default CountdownTimer;