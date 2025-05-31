'use client';

import { validateCurrencyInput } from '../utils/formatters';

const CalculatorInput = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  prefix,
  suffix,
  className = '',
  min,
  max,
  step,
  isDarkMode = false
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    if (type === 'currency') {
      if (validateCurrencyInput(newValue) || newValue === '') {
        onChange(newValue);
      }
    } else {
      onChange(newValue);
    }
  };

  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} sm:text-sm`}>{prefix}</span>
          </div>
        )}
        <input
          type={type === 'currency' ? 'text' : type}
          value={value}
          onChange={handleChange}
          className={`block w-full rounded-md ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-emerald-500' 
              : 'bg-white border-gray-300 text-gray-700 focus:ring-emerald-500'
          } pl-7 pr-12 focus:border-transparent sm:text-sm transition-colors duration-200 ${className}`}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} sm:text-sm`}>{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorInput; 