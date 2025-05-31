'use client';
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';

const RDCalculator = () => {
    const [formData, setFormData] = useState({
        monthlyDeposit: 1000,
        rate: 5,
        months: 60 // 5 years default
    });

    const [results, setResults] = useState({
        maturityAmount: 0,
        totalDeposit: 0,
        interestEarned: 0,
        monthlyData: [],
        effectiveRate: 0
    });

    const calculateResults = () => {
        const { monthlyDeposit, rate, months } = formData;
        const p = parseFloat(monthlyDeposit);
        const r = parseFloat(rate) / 100 / 12; // Monthly interest rate
        const t = parseFloat(months);

        if (p <= 0 || r <= 0 || t <= 0) {
            return;
        }

        // Calculate effective annual rate
        const effectiveRate = (Math.pow(1 + r, 12) - 1) * 100;

        // RD Maturity Amount Formula: P * n * (1 + r * (n+1)/2)
        // where n is the number of months
        const maturityAmount = p * t * (1 + r * (t + 1) / 2);
        const totalDeposit = p * t;
        const interestEarned = maturityAmount - totalDeposit;

        // Generate monthly data for the chart
        const monthlyData = [];
        for (let month = 0; month <= t; month++) {
            const depositedSoFar = p * month;
            const currentValue = p * month * (1 + r * (month + 1) / 2);
            
            monthlyData.push({
                year: (month / 12).toFixed(1),
                invested: depositedSoFar,
                interest: currentValue - depositedSoFar,
                total: currentValue
            });
        }

        setResults({
            maturityAmount,
            totalDeposit,
            interestEarned,
            monthlyData,
            effectiveRate: effectiveRate.toFixed(2)
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
                <h2 className="text-2xl font-bold text-gray-800">Recurring Deposit Calculator</h2>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Total Deposit</div>
                    <div className="text-2xl font-bold text-green-600">
                        ${Math.round(results.totalDeposit).toLocaleString()}
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Interest Earned</div>
                    <div className="text-2xl font-bold text-blue-600">
                        ${Math.round(results.interestEarned).toLocaleString()}
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Maturity Amount</div>
                    <div className="text-2xl font-bold text-purple-600">
                        ${Math.round(results.maturityAmount).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <CalculatorInput
                    label="Monthly Deposit"
                    value={formData.monthlyDeposit}
                    onChange={(value) => handleInputChange('monthlyDeposit', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                />

                <CalculatorInput
                    label="Interest Rate (% per year)"
                    value={formData.rate}
                    onChange={(value) => handleInputChange('rate', value)}
                    type="number"
                    suffix="%"
                    step="0.1"
                    min="0"
                    max="20"
                />

                <CalculatorInput
                    label="Time Period (Months)"
                    value={formData.months}
                    onChange={(value) => handleInputChange('months', value)}
                    type="number"
                    min="1"
                    max="360"
                    placeholder="Months"
                />
            </div>

            {/* Explanation */}
            <div className="mb-8 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>
                    Monthly deposits of ${formData.monthlyDeposit.toLocaleString()} for {formData.months} months at {formData.rate}% annual interest
                    will grow to ${Math.round(results.maturityAmount).toLocaleString()}, earning ${Math.round(results.interestEarned).toLocaleString()} in interest.
                    The effective annual rate is {results.effectiveRate}%.
                </p>
            </div>

            {/* Chart */}
            <InvestmentChart 
                data={results.monthlyData}
                type="area"
                stacked={true}
                height={400}
                yAxisLabel="Amount ($)"
                series={[
                    { key: 'invested', name: 'Total Deposit', color: '#10B981' },
                    { key: 'interest', name: 'Interest Earned', color: '#3B82F6' }
                ]}
            />
        </div>
    );
};

export default RDCalculator; 