'use client';

import { useState } from 'react';
import CalculatorInput from './CalculatorInput';

const InflationAdjustedReturns = ({ 
  futureValue, 
  years, 
  isDarkMode,
  nominalReturn 
}) => {
  const [inflationRate, setInflationRate] = useState(3);
  
  // Calculate real return using Fisher equation
  // Real Return = ((1 + Nominal Return) / (1 + Inflation Rate)) - 1
  const realReturn = ((1 + (nominalReturn / 100)) / (1 + (inflationRate / 100))) - 1;
  
  // Calculate inflation-adjusted future value
  const adjustedFutureValue = futureValue / Math.pow(1 + (inflationRate / 100), years);

  return (
    <div className={`mb-8 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} rounded-lg transition-colors duration-200`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        Inflation-Adjusted Returns
      </h3>
      
      <div className="mb-4">
        <CalculatorInput
          label="Inflation Rate"
          value={inflationRate}
          onChange={setInflationRate}
          type="number"
          suffix="%"
          step="0.1"
          min="0"
          max="20"
          isDarkMode={isDarkMode}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center">
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
            Real Return Rate
          </div>
          <div className={`text-xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {(realReturn * 100).toFixed(2)}%
          </div>
        </div>
        <div className="text-center">
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
            Inflation-Adjusted Value
          </div>
          <div className={`text-xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ${Math.round(adjustedFutureValue).toLocaleString()}
          </div>
        </div>
      </div>

      <div className={`mt-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <p>
          Accounting for {inflationRate}% annual inflation, your real return rate is {(realReturn * 100).toFixed(2)}%.
          The future value of ${Math.round(futureValue).toLocaleString()} will have the same purchasing power as ${Math.round(adjustedFutureValue).toLocaleString()} today.
        </p>
      </div>
    </div>
  );
};

export default InflationAdjustedReturns; 