'use client';

import { useState, useEffect } from 'react';
import CalculatorInput from './CalculatorInput';
import { formatCurrency, formatPercent, getMonthlyRate } from '../utils/formatters';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    if (loanAmount && interestRate && loanTerm) {
      const principal = parseFloat(loanAmount);
      const monthlyRate = getMonthlyRate(parseFloat(interestRate));
      const numberOfPayments = parseFloat(loanTerm) * 12;

      // Calculate monthly payment using the standard US loan amortization formula
      const monthlyPmt = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      if (isFinite(monthlyPmt) && monthlyPmt > 0) {
        setMonthlyPayment(monthlyPmt);
        const totalPmt = monthlyPmt * numberOfPayments;
        setTotalPayment(totalPmt);
        setTotalInterest(totalPmt - principal);
      } else {
        setMonthlyPayment(0);
        setTotalPayment(0);
        setTotalInterest(0);
      }
    } else {
      setMonthlyPayment(0);
      setTotalPayment(0);
      setTotalInterest(0);
    }
  }, [loanAmount, interestRate, loanTerm]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Loan Calculator</h2>
      
      <CalculatorInput
        label="Loan Amount"
        value={loanAmount}
        onChange={setLoanAmount}
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
        label="Loan Term (Years)"
        value={loanTerm}
        onChange={setLoanTerm}
        type="number"
        placeholder="Years"
        min="1"
        max="50"
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Monthly Payment</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyPayment)}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Total Interest</h3>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalInterest)}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Total Payment</h3>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalPayment)}</p>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator; 