'use client';

import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';
import { formatCurrency, formatPercent, getMonthlyRate } from '../utils/formatters';

const LoanCalculator = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({
    loanAmount: 300000,
    interestRate: 5.5,
    loanTerm: 30
  });

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0,
    chartData: []
  });

  const calculateResults = () => {
    const { loanAmount, interestRate, loanTerm } = formData;
    const monthlyRate = interestRate / 1200; // Convert annual rate to monthly decimal
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly payment using the loan amortization formula
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    // Generate amortization schedule for the chart
    let balance = loanAmount;
    let totalPaid = 0;
    let interestPaid = 0;
    const chartData = [];

    for (let year = 0; year <= loanTerm; year++) {
      chartData.push({
        year,
        balance: Math.round(balance),
        paid: Math.round(totalPaid),
        interest: Math.round(interestPaid)
      });

      // Calculate for next year
      for (let month = 0; month < 12 && year < loanTerm; month++) {
        const interestForMonth = balance * monthlyRate;
        const principalForMonth = monthlyPayment - interestForMonth;
        
        balance -= principalForMonth;
        totalPaid += monthlyPayment;
        interestPaid += interestForMonth;
      }
    }

    setResults({
      monthlyPayment,
      totalPayment,
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

  return (
    <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-200`}>
      <div className="flex items-center gap-3 mb-6">
        <Calculator className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} size={28} />
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Loan Calculator</h2>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Monthly Payment</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {formatCurrency(results.monthlyPayment)}
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Total Interest</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {formatCurrency(results.totalInterest)}
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Total Payment</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {formatCurrency(results.totalPayment)}
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CalculatorInput
          label="Loan Amount"
          value={formData.loanAmount}
          onChange={(value) => handleInputChange('loanAmount', value)}
          type="currency"
          prefix="$"
          placeholder="0.00"
          isDarkMode={isDarkMode}
        />

        <CalculatorInput
          label="Annual Interest Rate"
          value={formData.interestRate}
          onChange={(value) => handleInputChange('interestRate', value)}
          type="number"
          suffix="%"
          step="0.1"
          min="0"
          max="30"
          isDarkMode={isDarkMode}
        />

        <CalculatorInput
          label="Loan Term"
          value={formData.loanTerm}
          onChange={(value) => handleInputChange('loanTerm', value)}
          type="number"
          suffix=" years"
          min="1"
          max="30"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Explanation */}
      <div className={`mb-8 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-md text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <p>
          A ${formData.loanAmount.toLocaleString()} loan at {formData.interestRate}% annual interest for {formData.loanTerm} years
          will require monthly payments of ${Math.round(results.monthlyPayment).toLocaleString()}.
          You will pay ${Math.round(results.totalInterest).toLocaleString()} in interest over the life of the loan.
        </p>
      </div>

      {/* Chart */}
      <InvestmentChart 
        data={results.chartData}
        type="area"
        stacked={false}
        height={400}
        yAxisLabel="Amount ($)"
        isDarkMode={isDarkMode}
        series={[
          { key: 'balance', name: 'Remaining Balance', color: isDarkMode ? '#EF4444' : '#DC2626' },
          { key: 'paid', name: 'Amount Paid', color: isDarkMode ? '#34D399' : '#10B981' },
          { key: 'interest', name: 'Interest Paid', color: isDarkMode ? '#60A5FA' : '#3B82F6' }
        ]}
      />
    </div>
  );
};

export default LoanCalculator; 