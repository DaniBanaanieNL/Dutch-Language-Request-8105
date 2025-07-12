import React, { useState, useRef, useEffect } from 'react';

function VerificationCodeInput({ length = 4, value, onChange, disabled }) {
  const [code, setCode] = useState(value || Array(length).fill(''));
  const inputRefs = useRef([]);

  // Update parent component when code changes
  useEffect(() => {
    if (onChange) {
      onChange(code.join(''));
    }
  }, [code, onChange]);

  // Update local state when value prop changes
  useEffect(() => {
    if (value) {
      const valueArray = value.split('').slice(0, length);
      const newCode = [...Array(length).fill('').map((_, i) => valueArray[i] || '')];
      setCode(newCode);
    }
  }, [value, length]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    
    // Only allow digits
    if (!/^\d*$/.test(val)) return;
    
    // Only take the last character if multiple were pasted
    const digit = val.slice(-1);
    
    // Update the code array
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    
    // Auto-focus next input if this one is filled
    if (digit && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move focus to previous input on backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    
    // Get pasted data
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if it's a numeric string
    if (!/^\d+$/.test(pastedData)) return;
    
    // Fill the inputs with the pasted digits
    const digits = pastedData.split('').slice(0, length);
    const newCode = [...Array(length).fill('').map((_, i) => digits[i] || '')];
    setCode(newCode);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex].focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength="1"
          value={code[index] || ''}
          onChange={e => handleChange(e, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-12 h-14 text-center text-2xl font-bold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            disabled ? 'bg-gray-100 text-gray-400' : 'bg-white'
          }`}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default VerificationCodeInput;