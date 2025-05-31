'use client';
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';

const GoalSIPCalculator = ({ isDarkMode }) => {
    const [formData, setFormData] = useState({
        goalAmount: 1000000,
        years: 10,
        expectedReturn: 12,
        existingAmount: 0
    });

    const [results, setResults] = useState({
        monthlySIP: 0,
        totalInvestment: 0,
        wealthGained: 0,
        chartData: []
    });

    const calculateResults = () => {
        const { goalAmount, years, expectedReturn, existingAmount } = formData;
        const monthlyRate = expectedReturn / 1200; // Convert annual rate to monthly decimal
        const months = years * 12;

        // Calculate future value of existing investment
        const futureExistingAmount = existingAmount * Math.pow(1 + expectedReturn / 100, years);

        // Calculate required additional corpus
        const additionalRequired = goalAmount - futureExistingAmount;

        // Calculate required monthly SIP using PMT formula
        const monthlySIP = (additionalRequired * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
        const totalInvestment = monthlySIP * months + existingAmount;
        const wealthGained = goalAmount - totalInvestment;

        // Generate chart data
        const chartData = [];
        let currentValue = existingAmount;
        let totalInvested = existingAmount;

        for (let year = 0; year <= years; year++) {
            chartData.push({
                year,
                invested: Math.round(totalInvested),
                wealth: Math.round(currentValue - totalInvested),
                total: Math.round(currentValue)
            });

            if (year < years) {
                currentValue = currentValue * (1 + expectedReturn / 100) + (monthlySIP * 12);
                totalInvested += monthlySIP * 12;
            }
        }

        setResults({
            monthlySIP,
            totalInvestment,
            wealthGained,
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
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Goal-based Systematic Investment Plan (SIP) Calculator</h2>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Required Monthly SIP</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${Math.round(results.monthlySIP).toLocaleString()}
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Total Investment</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${Math.round(results.totalInvestment).toLocaleString()}
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Wealth Gained</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${Math.round(results.wealthGained).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <CalculatorInput
                    label="Goal Amount"
                    value={formData.goalAmount}
                    onChange={(value) => handleInputChange('goalAmount', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Time Period"
                    value={formData.years}
                    onChange={(value) => handleInputChange('years', value)}
                    type="number"
                    suffix=" years"
                    min="1"
                    max="30"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Expected Return Rate"
                    value={formData.expectedReturn}
                    onChange={(value) => handleInputChange('expectedReturn', value)}
                    type="number"
                    suffix="%"
                    step="0.1"
                    min="1"
                    max="30"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Existing Investment"
                    value={formData.existingAmount}
                    onChange={(value) => handleInputChange('existingAmount', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Explanation */}
            <div className={`mb-8 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-md text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                    To reach your goal of ${formData.goalAmount.toLocaleString()} in {formData.years} years with {formData.expectedReturn}% returns,
                    you need to invest ${Math.round(results.monthlySIP).toLocaleString()} monthly.
                    Your total investment of ${Math.round(results.totalInvestment).toLocaleString()} will grow to ${formData.goalAmount.toLocaleString()},
                    generating ${Math.round(results.wealthGained).toLocaleString()} in wealth.
                </p>
            </div>

            {/* Chart */}
            <InvestmentChart 
                data={results.chartData}
                type="area"
                stacked={true}
                height={400}
                yAxisLabel="Amount ($)"
                isDarkMode={isDarkMode}
                series={[
                    { key: 'invested', name: 'Amount Invested', color: isDarkMode ? '#34D399' : '#10B981' },
                    { key: 'wealth', name: 'Wealth Gained', color: isDarkMode ? '#60A5FA' : '#3B82F6' }
                ]}
            />
        </div>
    );
};

export default GoalSIPCalculator; 