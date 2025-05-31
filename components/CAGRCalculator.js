'use client';
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';

const CAGRCalculator = ({ isDarkMode }) => {
    const [formData, setFormData] = useState({
        initialValue: 10000,
        finalValue: 20000,
        years: 5
    });

    const [results, setResults] = useState({
        cagr: 0,
        yearlyData: [],
        absoluteGrowth: 0,
        totalReturn: 0
    });

    const calculateResults = () => {
        const { initialValue, finalValue, years } = formData;

        if (initialValue <= 0 || finalValue <= 0 || years <= 0) {
            return;
        }

        // Calculate CAGR
        const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
        const absoluteGrowth = finalValue - initialValue;
        const totalReturn = (absoluteGrowth / initialValue) * 100;

        // Generate yearly data for the chart
        const yearlyData = [];
        const growthRate = Math.pow(finalValue / initialValue, 1 / years);

        for (let year = 0; year <= years; year++) {
            const currentValue = initialValue * Math.pow(growthRate, year);
            const invested = initialValue;
            const returns = currentValue - initialValue;

            yearlyData.push({
                year,
                invested,
                returns,
                total: currentValue
            });
        }

        setResults({
            cagr: cagr.toFixed(2),
            yearlyData,
            absoluteGrowth,
            totalReturn: totalReturn.toFixed(2)
        });
    };

    useEffect(() => {
        calculateResults();
    }, [formData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: parseFloat(value) || 0
        }));
    };

    return (
        <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-200`}>
            <div className="flex items-center gap-3 mb-6">
                <Calculator className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} size={28} />
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>CAGR Calculator</h2>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>CAGR</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {results.cagr}%
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Absolute Growth</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${results.absoluteGrowth.toLocaleString()}
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Total Return</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {results.totalReturn}%
                    </div>
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <CalculatorInput
                    label="Initial Investment"
                    value={formData.initialValue}
                    onChange={(value) => handleInputChange('initialValue', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Final Value"
                    value={formData.finalValue}
                    onChange={(value) => handleInputChange('finalValue', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Time Period (Years)"
                    value={formData.years}
                    onChange={(value) => handleInputChange('years', value)}
                    type="number"
                    min="1"
                    max="50"
                    placeholder="Years"
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Explanation */}
            <div className={`mb-8 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-md text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                    CAGR of {results.cagr}% means your investment grew at an average rate of {results.cagr}% per year,
                    turning ${formData.initialValue.toLocaleString()} into ${formData.finalValue.toLocaleString()} over {formData.years} years.
                </p>
            </div>

            {/* Chart */}
            <InvestmentChart 
                data={results.yearlyData}
                type="line"
                stacked={false}
                height={400}
                yAxisLabel="Amount ($)"
                series={[
                    { key: 'total', name: 'Total Value', color: '#8B5CF6' },
                    { key: 'invested', name: 'Initial Investment', color: '#10B981' }
                ]}
            />
        </div>
    );
};

export default CAGRCalculator; 