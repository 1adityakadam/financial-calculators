'use client';

import { useState, useEffect } from 'react';
import CalculatorInput from './CalculatorInput';
import { formatCurrency, formatPercent, getMonthlyRate } from '../utils/formatters';

const MortgageCalculator = () => {
  const [homePrice, setHomePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('30');
  const [propertyTax, setPropertyTax] = useState('');
  const [insurance, setInsurance] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [pmi, setPmi] = useState(0);
  const [totalMonthlyPayment, setTotalMonthlyPayment] = useState(0);

  useEffect(() => {
    if (homePrice && downPayment && interestRate) {
      const price = parseFloat(homePrice);
      const down = parseFloat(downPayment);
      const loanAmount = price - down;
      const monthlyRate = getMonthlyRate(parseFloat(interestRate));
      const numberOfPayments = parseFloat(loanTerm) * 12;

      // Calculate base monthly mortgage payment
      const monthlyPmt = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      // Calculate PMI (Private Mortgage Insurance) if down payment is less than 20%
      const downPaymentPercent = (down / price) * 100;
      const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * 0.01) / 12 : 0;
      
      // Calculate monthly property tax and insurance
      const monthlyTax = propertyTax ? parseFloat(propertyTax) / 12 : 0;
      const monthlyInsurance = insurance ? parseFloat(insurance) / 12 : 0;

      if (isFinite(monthlyPmt) && monthlyPmt > 0) {
        setMonthlyPayment(monthlyPmt);
        setPmi(monthlyPMI);
        setTotalMonthlyPayment(monthlyPmt + monthlyPMI + monthlyTax + monthlyInsurance);
      } else {
        setMonthlyPayment(0);
        setPmi(0);
        setTotalMonthlyPayment(0);
      }
    }
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, insurance]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mortgage Calculator</h2>
      
      <CalculatorInput
        label="Home Price"
        value={homePrice}
        onChange={setHomePrice}
        type="currency"
        prefix="$"
        placeholder="0.00"
      />

      <CalculatorInput
        label="Down Payment"
        value={downPayment}
        onChange={setDownPayment}
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
        placeholder="30"
        min="15"
        max="30"
      />

      <CalculatorInput
        label="Annual Property Tax"
        value={propertyTax}
        onChange={setPropertyTax}
        type="currency"
        prefix="$"
        placeholder="0.00"
      />

      <CalculatorInput
        label="Annual Home Insurance"
        value={insurance}
        onChange={setInsurance}
        type="currency"
        prefix="$"
        placeholder="0.00"
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Principal & Interest</h3>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(monthlyPayment)}</p>
        </div>
        
        {pmi > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">PMI</h3>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(pmi)}</p>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Property Tax & Insurance</h3>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency((propertyTax ? parseFloat(propertyTax) / 12 : 0) + 
                          (insurance ? parseFloat(insurance) / 12 : 0))}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Monthly Payment</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonthlyPayment)}</p>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator; 