'use client';

import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';
import { formatCurrency, formatPercent, getMonthlyRate } from '../utils/formatters';
import InflationAdjustedReturns from './InflationAdjustedReturns';

const MortgageCalculator = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({
    homePrice: 300000,
    downPayment: 60000,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTax: 3000,
    insurance: 1200
  });

  const [results, setResults] = useState({
    monthlyPayment: 0,
    pmi: 0,
    totalMonthlyPayment: 0,
    chartData: []
  });

  const calculateResults = () => {
    const { homePrice, downPayment, interestRate, loanTerm, propertyTax, insurance } = formData;
    const price = parseFloat(homePrice);
    const down = parseFloat(downPayment);
    const loanAmount = price - down;
    const monthlyRate = getMonthlyRate(parseFloat(interestRate));
    const numberOfPayments = parseFloat(loanTerm) * 12;

    if (price <= 0 || down < 0 || monthlyRate <= 0 || numberOfPayments <= 0) return;

    // Calculate base monthly mortgage payment
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    if (!isFinite(monthlyPayment) || monthlyPayment <= 0) return;

    // Calculate PMI (Private Mortgage Insurance) if down payment is less than 20%
    const downPaymentPercent = (down / price) * 100;
    const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * 0.01) / 12 : 0;
    
    // Calculate monthly property tax and insurance
    const monthlyTax = propertyTax ? parseFloat(propertyTax) / 12 : 0;
    const monthlyInsurance = insurance ? parseFloat(insurance) / 12 : 0;

    const totalMonthlyPayment = monthlyPayment + monthlyPMI + monthlyTax + monthlyInsurance;

    // Generate amortization schedule for the chart
    const chartData = [];
    let remainingBalance = loanAmount;
    let totalPaidSoFar = down; // Include down payment in equity
    let interestPaidSoFar = 0;

    for (let month = 0; month <= numberOfPayments; month++) {
      if (month === 0) {
        chartData.push({
          year: 0,
          balance: remainingBalance,
          equity: down,
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
          equity: price - Math.max(0, remainingBalance),
          interest: interestPaidSoFar
        });
      }
    }

    setResults({
      monthlyPayment,
      pmi: monthlyPMI,
      totalMonthlyPayment,
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
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Mortgage Calculator</h2>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Principal & Interest</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {formatCurrency(results.monthlyPayment)}
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Monthly Escrow</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {formatCurrency((formData.propertyTax / 12) + (formData.insurance / 12))}
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Total Payment</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {formatCurrency(results.totalMonthlyPayment)}
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CalculatorInput
          label="Home Price"
          value={formData.homePrice}
          onChange={(value) => handleInputChange('homePrice', value)}
          type="currency"
          prefix="$"
          placeholder="0.00"
          isDarkMode={isDarkMode}
        />

        <CalculatorInput
          label="Down Payment"
          value={formData.downPayment}
          onChange={(value) => handleInputChange('downPayment', value)}
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
          min="15"
          max="30"
          isDarkMode={isDarkMode}
        />

        <CalculatorInput
          label="Annual Property Tax"
          value={formData.propertyTax}
          onChange={(value) => handleInputChange('propertyTax', value)}
          type="currency"
          prefix="$"
          placeholder="0.00"
          isDarkMode={isDarkMode}
        />

        <CalculatorInput
          label="Annual Home Insurance"
          value={formData.insurance}
          onChange={(value) => handleInputChange('insurance', value)}
          type="currency"
          prefix="$"
          placeholder="0.00"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Explanation */}
      <div className={`mb-8 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-md text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <p>
          For a ${formData.homePrice.toLocaleString()} home with ${formData.downPayment.toLocaleString()} down payment at {formData.interestRate}% interest,
          your monthly payment will be ${Math.round(results.monthlyPayment).toLocaleString()} (principal & interest)
          {results.pmi > 0 ? ` plus ${formatCurrency(results.pmi)} PMI` : ''} plus ${formatCurrency((formData.propertyTax / 12) + (formData.insurance / 12))} for taxes and insurance,
          for a total monthly payment of ${Math.round(results.totalMonthlyPayment).toLocaleString()}.
        </p>
      </div>

      {/* Inflation-Adjusted Returns */}
      <InflationAdjustedReturns
        futureValue={formData.homePrice}
        years={formData.loanTerm}
        isDarkMode={isDarkMode}
        nominalReturn={formData.interestRate}
      />

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
          { key: 'equity', name: 'Home Equity', color: isDarkMode ? '#34D399' : '#10B981' },
          { key: 'interest', name: 'Interest Paid', color: isDarkMode ? '#60A5FA' : '#3B82F6' }
        ]}
      />
    </div>
  );
};

export default MortgageCalculator; 