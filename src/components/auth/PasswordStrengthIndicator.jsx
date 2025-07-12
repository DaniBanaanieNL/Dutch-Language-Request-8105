import React from 'react';
import { validatePasswordStrength } from '../../utils/passwordUtils';
import SafeIcon from '../../common/SafeIcon';
import { FiCheck, FiX } from 'react-icons/fi';

function PasswordStrengthIndicator({ password }) {
  if (!password) return null;

  const validation = validatePasswordStrength(password);
  
  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'Sterk': return 'text-green-600';
      case 'Gemiddeld': return 'text-yellow-600';
      case 'Zwak': return 'text-orange-600';
      default: return 'text-red-600';
    }
  };

  const getProgressColor = (strength) => {
    switch (strength) {
      case 'Sterk': return 'bg-green-500';
      case 'Gemiddeld': return 'bg-yellow-500';
      case 'Zwak': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600">Wachtwoordsterkte:</span>
        <span className={`font-medium ${getStrengthColor(validation.strength)}`}>
          {validation.strength}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(validation.strength)}`}
          style={{ width: `${(validation.score / 5) * 100}%` }}
        ></div>
      </div>
      
      <div className="space-y-1">
        <div className={`flex items-center ${validation.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
          <SafeIcon icon={validation.checks.length ? FiCheck : FiX} className="mr-2 text-xs" />
          <span>Minimaal 8 karakters</span>
        </div>
        <div className={`flex items-center ${validation.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
          <SafeIcon icon={validation.checks.lowercase ? FiCheck : FiX} className="mr-2 text-xs" />
          <span>Kleine letters (a-z)</span>
        </div>
        <div className={`flex items-center ${validation.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
          <SafeIcon icon={validation.checks.uppercase ? FiCheck : FiX} className="mr-2 text-xs" />
          <span>Hoofdletters (A-Z)</span>
        </div>
        <div className={`flex items-center ${validation.checks.numbers ? 'text-green-600' : 'text-gray-400'}`}>
          <SafeIcon icon={validation.checks.numbers ? FiCheck : FiX} className="mr-2 text-xs" />
          <span>Cijfers (0-9)</span>
        </div>
        <div className={`flex items-center ${validation.checks.special ? 'text-green-600' : 'text-gray-400'}`}>
          <SafeIcon icon={validation.checks.special ? FiCheck : FiX} className="mr-2 text-xs" />
          <span>Speciale karakters (!@#$%^&*)</span>
        </div>
      </div>
    </div>
  );
}

export default PasswordStrengthIndicator;