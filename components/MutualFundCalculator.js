'use client';
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';

const MutualFundCalculator = ({ isDarkMode }) => {
    const [formData, setFormData] = useState({
        investmentType: 'lumpsum',
        amount: 10000,
        monthlyInvestment: 1000,
        years: 5,
        expectedReturn: 12
    });

    const [results, setResults] = useState({
        futureValue: 0,
        totalInvestment: 0,
        totalReturns: 0,
        xirr: 0,
        chartData: []
    });

    const calculateResults = () => {
        const { investmentType, amount, monthlyInvestment, years, expectedReturn } = formData;
        let futureValue, totalInvestment, totalReturns, chartData = [];

        if (investmentType === 'lumpsum') {
            const p = parseFloat(amount);
            const r = parseFloat(expectedReturn) / 100;
            const t = parseFloat(years);

            if (p <= 0 || r <= 0 || t <= 0) return;

            futureValue = p * Math.pow(1 + r, t);
            totalInvestment = p;
            totalReturns = futureValue - totalInvestment;

            // Generate yearly data for chart
            for (let year = 0; year <= t; year++) {
                const currentValue = p * Math.pow(1 + r, year);
                chartData.push({
                    year,
                    invested: p,
                    returns: currentValue - p,
                    total: currentValue
                });
            }
        } else {
            const p = parseFloat(monthlyInvestment);
            const r = parseFloat(expectedReturn) / 100 / 12; // Monthly rate
            const t = parseFloat(years) * 12; // Total months

            if (p <= 0 || r <= 0 || t <= 0) return;

            futureValue = p * ((Math.pow(1 + r, t) - 1) / r) * (1 + r);
            totalInvestment = p * t;
            totalReturns = futureValue - totalInvestment;

            // Generate monthly data for chart
            for (let month = 0; month <= t; month++) {
                const invested = p * month;
                const currentValue = p * ((Math.pow(1 + r, month) - 1) / r) * (1 + r);
                chartData.push({
                    year: (month / 12).toFixed(1),
                    invested,
                    returns: currentValue - invested,
                    total: currentValue
                });
            }
        }
        
        setResults({
            futureValue,
            totalInvestment,
            totalReturns,
            xirr: (totalReturns / totalInvestment) * 100 / parseFloat(years),
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
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Mutual Fund Calculator</h2>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Total Investment</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${Math.round(results.totalInvestment).toLocaleString()}
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Total Returns</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${Math.round(results.totalReturns).toLocaleString()}
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Future Value</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${Math.round(results.futureValue).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Investment Type</label>
                    <select
                        value={formData.investmentType}
                        onChange={(e) => handleInputChange('investmentType', e.target.value)}
                        className={`block w-full rounded-md ${
                            isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                : 'bg-white border-gray-300 text-gray-700'
                        } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-200`}
                    >
                        <option value="lumpsum">Lump Sum</option>
                        <option value="sip">SIP (Monthly)</option>
                    </select>
                </div>

                {formData.investmentType === 'lumpsum' ? (
                    <CalculatorInput
                        label="Investment Amount"
                        value={formData.amount}
                        onChange={(value) => handleInputChange('amount', value)}
                        type="currency"
                        prefix="$"
                        placeholder="0.00"
                        isDarkMode={isDarkMode}
                    />
                ) : (
                    <CalculatorInput
                        label="Monthly Investment"
                        value={formData.monthlyInvestment}
                        onChange={(value) => handleInputChange('monthlyInvestment', value)}
                        type="currency"
                        prefix="$"
                        placeholder="0.00"
                        isDarkMode={isDarkMode}
                    />
                )}

                <CalculatorInput
                    label="Expected Return Rate"
                    value={formData.expectedReturn}
                    onChange={(value) => handleInputChange('expectedReturn', value)}
                    type="number"
                    suffix="%"
                    step="0.1"
                    min="0"
                    max="30"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Investment Period"
                    value={formData.years}
                    onChange={(value) => handleInputChange('years', value)}
                    type="number"
                    suffix=" years"
                    min="1"
                    max="40"
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Explanation */}
            <div className={`mb-8 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-md text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                    {formData.investmentType === 'lumpsum' 
                        ? `A one-time investment of $${formData.amount.toLocaleString()} `
                        : `Monthly investments of $${formData.monthlyInvestment.toLocaleString()} `}
                    for {formData.years} years at {formData.expectedReturn}% annual return will grow to ${Math.round(results.futureValue).toLocaleString()},
                    generating ${Math.round(results.totalReturns).toLocaleString()} in returns.
                    The average annual return on investment is {results.xirr.toFixed(2)}%.
                </p>
            </div>

            {/* Chart */}
            <InvestmentChart 
                data={results.chartData}
                type={formData.investmentType === 'lumpsum' ? 'line' : 'area'}
                stacked={formData.investmentType === 'sip'}
                height={400}
                yAxisLabel="Amount ($)"
                isDarkMode={isDarkMode}
                series={[
                    { key: 'total', name: 'Total Value', color: '#8B5CF6' },
                    { key: 'invested', name: 'Amount Invested', color: '#10B981' },
                    { key: 'returns', name: 'Returns Generated', color: '#3B82F6' }
                ]}
            />
        </div>
    );
};

export default MutualFundCalculator; 