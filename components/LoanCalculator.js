'use client';

import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';
import { formatCurrency, formatPercent, getMonthlyRate } from '../utils/formatters';

const LoanCalculator = () => {
  const [formData, setFormData] = useState({
    loanAmount: 10000,
    interestRate: 5,
    loanTerm: 5
  });

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0,
    chartData: []
  });

  const calculateResults = () => {
    const { loanAmount, interestRate, loanTerm } = formData;
    const principal = parseFloat(loanAmount);
    const monthlyRate = getMonthlyRate(parseFloat(interestRate));
    const numberOfPayments = parseFloat(loanTerm) * 12;

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) return;

    // Calculate monthly payment using the standard US loan amortization formula
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    if (!isFinite(monthlyPayment) || monthlyPayment <= 0) return;

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    // Generate amortization schedule for the chart
    const chartData = [];
    let remainingBalance = principal;
    let totalPaidSoFar = 0;
    let interestPaidSoFar = 0;

    for (let month = 0; month <= numberOfPayments; month++) {
      if (month === 0) {
        chartData.push({
          year: 0,
          balance: remainingBalance,
          paid: 0,
          interest: 0
        });
        continue;
      }

      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      totalPaidSoFar += monthlyPayment;
      interestPaidSoFar += interestPayment;

      if (month % 12 === 0 || month === numberOfPayments) {
        chartData.push({
          year: (month / 12).toFixed(1),
          balance: Math.max(0, remainingBalance),
          paid: totalPaidSoFar,
          interest: interestPaidSoFar
        });
      }
    }

    setResults({
      monthlyPayment,
      totalInterest,
      totalPayment,
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Loan Calculator</h2>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Monthly Payment</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(results.monthlyPayment)}
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Total Interest</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(results.totalInterest)}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Total Payment</div>
          <div className="text-2xl font-bold text-purple-600">
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
        />

        <CalculatorInput
          label="Loan Term"
          value={formData.loanTerm}
          onChange={(value) => handleInputChange('loanTerm', value)}
          type="number"
          suffix=" years"
          min="1"
          max="30"
        />
      </div>

      {/* Explanation */}
      <div className="mb-8 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
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
        series={[
          { key: 'balance', name: 'Remaining Balance', color: '#EF4444' },
          { key: 'paid', name: 'Amount Paid', color: '#10B981' },
          { key: 'interest', name: 'Interest Paid', color: '#3B82F6' }
        ]}
      />
    </div>
  );
};

export default LoanCalculator; 