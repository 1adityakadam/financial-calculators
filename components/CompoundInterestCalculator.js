'use client';

import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';
import InflationAdjustedReturns from './InflationAdjustedReturns';
import { formatCurrency, formatPercent } from '../utils/formatters';

const CompoundInterestCalculator = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({
    principal: 10000,
    annualContribution: 1200,
    rate: 8,
    years: 10,
    compoundingFrequency: 12 // monthly
  });

  const [results, setResults] = useState({
    futureValue: 0,
    totalContributions: 0,
    totalInterest: 0,
    chartData: []
  });

  const calculateResults = () => {
    const { principal, annualContribution, rate, years, compoundingFrequency } = formData;
    const P = parseFloat(principal);
    const PMT = parseFloat(annualContribution) / compoundingFrequency;
    const r = parseFloat(rate) / 100 / compoundingFrequency;
    const n = compoundingFrequency * parseFloat(years);

    if (P <= 0 || r <= 0 || n <= 0) return;

    // Calculate future value with regular contributions
    const futureValue = P * Math.pow(1 + r, n) + 
        PMT * ((Math.pow(1 + r, n) - 1) / r);

    const totalContributions = P + (PMT * n);
    const totalInterest = futureValue - totalContributions;

    // Generate data points for the chart
    const chartData = [];
    const pointsPerYear = 4; // quarterly points
    const totalPoints = years * pointsPerYear;
    const timeStep = compoundingFrequency / pointsPerYear;

    for (let i = 0; i <= totalPoints; i++) {
      const periods = i * timeStep;
      const timeInYears = periods / compoundingFrequency;
      const regularContributions = PMT * periods;
      const currentValue = P * Math.pow(1 + r, periods) + 
          PMT * ((Math.pow(1 + r, periods) - 1) / r);
      
      chartData.push({
        year: timeInYears.toFixed(1),
        invested: P + regularContributions,
        returns: currentValue - (P + regularContributions),
        total: currentValue
      });
    }

    setResults({
      futureValue,
      totalContributions,
      totalInterest,
      chartData
    });
  };

  useEffect(() => {
    calculateResults();
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const compoundingOptions = [
    { value: '1', label: 'Annually' },
    { value: '2', label: 'Semi-annually' },
    { value: '4', label: 'Quarterly' },
    { value: '12', label: 'Monthly' },
    { value: '365', label: 'Daily' }
  ];

  return (
    <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-200`}>
      <div className="flex items-center gap-3 mb-6">
        <Calculator className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} size={28} />
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Compound Interest Calculator</h2>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Total Investment</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {formatCurrency(results.totalContributions)}
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Total Interest</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {formatCurrency(results.totalInterest)}
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Future Value</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {formatCurrency(results.futureValue)}
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CalculatorInput
          label="Initial Principal"
          value={formData.principal}
          onChange={(value) => handleInputChange('principal', value)}
          type="currency"
          prefix="$"
          placeholder="0.00"
          isDarkMode={isDarkMode}
        />

        <CalculatorInput
          label="Annual Contribution"
          value={formData.annualContribution}
          onChange={(value) => handleInputChange('annualContribution', value)}
          type="currency"
          prefix="$"
          placeholder="0.00"
          isDarkMode={isDarkMode}
        />

        <CalculatorInput
          label="Interest Rate"
          value={formData.rate}
          onChange={(value) => handleInputChange('rate', value)}
          type="number"
          suffix="%"
          step="0.1"
          min="0"
          max="30"
          isDarkMode={isDarkMode}
        />

        <CalculatorInput
          label="Time Period"
          value={formData.years}
          onChange={(value) => handleInputChange('years', value)}
          type="number"
          suffix=" years"
          min="1"
          max="50"
          isDarkMode={isDarkMode}
        />

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
            Compounding Frequency
          </label>
          <select
            value={formData.compoundingFrequency}
            onChange={(e) => handleInputChange('compoundingFrequency', parseInt(e.target.value))}
            className={`block w-full rounded-md ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-700'
            } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-200`}
          >
            {compoundingOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Explanation */}
      <div className={`mb-8 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-md text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <p>
          An initial investment of {formatCurrency(formData.principal)} with annual contributions of {formatCurrency(formData.annualContribution)},
          compounding {formData.compoundingFrequency === 1 ? 'annually' : 
                     formData.compoundingFrequency === 2 ? 'semi-annually' :
                     formData.compoundingFrequency === 4 ? 'quarterly' :
                     formData.compoundingFrequency === 12 ? 'monthly' : 'daily'} at {formData.rate}% interest
          will grow to {formatCurrency(results.futureValue)} in {formData.years} years.
        </p>
      </div>

      {/* Inflation-Adjusted Returns */}
      <InflationAdjustedReturns
        futureValue={results.futureValue}
        years={formData.years}
        isDarkMode={isDarkMode}
        nominalReturn={formData.rate}
      />

      {/* Chart */}
      <InvestmentChart 
        data={results.chartData}
        type="area"
        stacked={true}
        height={400}
        yAxisLabel="Amount ($)"
        isDarkMode={isDarkMode}
        series={[
          { key: 'invested', name: 'Total Contributions', color: isDarkMode ? '#34D399' : '#10B981' },
          { key: 'returns', name: 'Interest Earned', color: isDarkMode ? '#60A5FA' : '#3B82F6' }
        ]}
      />
    </div>
  );
};

export default CompoundInterestCalculator; 