'use client';

import { useState, useEffect } from 'react';
import CalculatorInput from './CalculatorInput';
import { formatCurrency, formatPercent } from '../utils/formatters';

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [compoundingFrequency, setCompoundingFrequency] = useState('12');
  const [futureValue, setFutureValue] = useState(0);
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    if (principal && interestRate && years) {
      const P = parseFloat(principal);
      const r = parseFloat(interestRate) / 100;
      const t = parseFloat(years);
      const n = parseInt(compoundingFrequency);
      const PMT = monthlyContribution ? parseFloat(monthlyContribution) : 0;
      
      // Calculate future value with monthly contributions
      // Using the formula: FV = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n))
      const base = 1 + r/n;
      const exp = n * t;
      const futureVal = P * Math.pow(base, exp) + 
                       PMT * ((Math.pow(base, exp) - 1) / (r/n));

      if (isFinite(futureVal) && futureVal > 0) {
        setFutureValue(futureVal);
        const totalContrib = P + (PMT * 12 * t);
        setTotalContributions(totalContrib);
        setTotalInterest(futureVal - totalContrib);
      } else {
        setFutureValue(0);
        setTotalContributions(0);
        setTotalInterest(0);
      }
    }
  }, [principal, monthlyContribution, interestRate, years, compoundingFrequency]);

  const compoundingOptions = [
    { value: '1', label: 'Annually' },
    { value: '2', label: 'Semi-annually' },
    { value: '4', label: 'Quarterly' },
    { value: '12', label: 'Monthly' },
    { value: '365', label: 'Daily' }
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Compound Interest Calculator</h2>
      
      <CalculatorInput
        label="Initial Investment"
        value={principal}
        onChange={setPrincipal}
        type="currency"
        prefix="$"
        placeholder="0.00"
      />

      <CalculatorInput
        label="Monthly Contribution"
        value={monthlyContribution}
        onChange={setMonthlyContribution}
        type="currency"
        prefix="$"
        placeholder="0.00"
      />

      <CalculatorInput
        label="Annual Interest Rate"
        value={interestRate}
        onChange={setInterestRate}
        type="number"
        suffix="%"
        placeholder="0.00"
        step="0.01"
        min="0"
        max="100"
      />

      <CalculatorInput
        label="Time Period (Years)"
        value={years}
        onChange={setYears}
        type="number"
        placeholder="Years"
        min="1"
        max="50"
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Compounding Frequency
        </label>
        <select
          value={compoundingFrequency}
          onChange={(e) => setCompoundingFrequency(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {compoundingOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Future Value</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(futureValue)}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Total Contributions</h3>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalContributions)}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Total Interest Earned</h3>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalInterest)}</p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Return on Investment</h3>
          <p className="text-lg font-semibold text-gray-900">
            {formatPercent((totalInterest / totalContributions) * 100)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompoundInterestCalculator; 