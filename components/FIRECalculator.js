'use client';
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';

const FIRECalculator = ({ isDarkMode }) => {
    const [formData, setFormData] = useState({
        currentAge: 30,
        retirementAge: 45,
        monthlyExpenses: 5000,
        currentSavings: 100000,
        monthlyInvestment: 3000,
        expectedReturn: 8,
        inflationRate: 3,
        withdrawalRate: 4
    });

    const [results, setResults] = useState({
        requiredCorpus: 0,
        monthlyInvestmentNeeded: 0,
        yearsToRetirement: 0,
        chartData: []
    });

    const calculateResults = () => {
        const { currentAge, retirementAge, monthlyExpenses, currentSavings, monthlyInvestment, expectedReturn, inflationRate, withdrawalRate } = formData;
        
        // Calculate future monthly expenses accounting for inflation
        const yearsToRetirement = retirementAge - currentAge;
        const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflationRate/100, yearsToRetirement);
        
        // Calculate required corpus based on withdrawal rate
        const requiredCorpus = (futureMonthlyExpenses * 12) / (withdrawalRate/100);
        
        // Calculate how current savings will grow
        const realReturn = ((1 + expectedReturn/100) / (1 + inflationRate/100) - 1) * 100;
        const monthlyRate = realReturn / 1200;
        const months = yearsToRetirement * 12;
        
        // Future value of current savings
        const futureSavings = currentSavings * Math.pow(1 + realReturn/100, yearsToRetirement);
        
        // Future value of monthly investments
        const futureInvestments = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        
        // Total future value
        const totalFutureValue = futureSavings + futureInvestments;
        
        // Calculate required monthly investment to reach target
        const additionalRequired = Math.max(0, requiredCorpus - totalFutureValue);
        const monthlyInvestmentNeeded = (additionalRequired * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
        
        // Generate chart data
        const chartData = [];
        let currentValue = currentSavings;
        let totalInvested = currentSavings;
        
        for (let year = 0; year <= yearsToRetirement; year++) {
            chartData.push({
                year: currentAge + year,
                currentValue: Math.round(currentValue),
                targetValue: Math.round(requiredCorpus * Math.pow(1 + inflationRate/100, year - yearsToRetirement)),
                totalInvested: Math.round(totalInvested)
            });
            
            currentValue = currentValue * (1 + realReturn/100) + (monthlyInvestment * 12);
            totalInvested += monthlyInvestment * 12;
        }

        setResults({
            requiredCorpus,
            monthlyInvestmentNeeded,
            yearsToRetirement,
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
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Financial Independence, Retire Early (FIRE) Calculator</h2>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Required Corpus</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${Math.round(results.requiredCorpus).toLocaleString()}
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Monthly Investment</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${Math.round(results.monthlyInvestmentNeeded).toLocaleString()}
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Years to FIRE</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {results.yearsToRetirement}
                    </div>
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <CalculatorInput
                    label="Current Age"
                    value={formData.currentAge}
                    onChange={(value) => handleInputChange('currentAge', value)}
                    type="number"
                    min="18"
                    max="70"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Retirement Age"
                    value={formData.retirementAge}
                    onChange={(value) => handleInputChange('retirementAge', value)}
                    type="number"
                    min="35"
                    max="75"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Monthly Expenses"
                    value={formData.monthlyExpenses}
                    onChange={(value) => handleInputChange('monthlyExpenses', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Current Savings"
                    value={formData.currentSavings}
                    onChange={(value) => handleInputChange('currentSavings', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Monthly Investment"
                    value={formData.monthlyInvestment}
                    onChange={(value) => handleInputChange('monthlyInvestment', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
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
                    max="20"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Inflation Rate"
                    value={formData.inflationRate}
                    onChange={(value) => handleInputChange('inflationRate', value)}
                    type="number"
                    suffix="%"
                    step="0.1"
                    min="1"
                    max="10"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Withdrawal Rate"
                    value={formData.withdrawalRate}
                    onChange={(value) => handleInputChange('withdrawalRate', value)}
                    type="number"
                    suffix="%"
                    step="0.1"
                    min="2"
                    max="10"
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Explanation */}
            <div className={`mb-8 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-md text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                    To retire at age {formData.retirementAge} with monthly expenses of ${formData.monthlyExpenses.toLocaleString()},
                    you'll need a corpus of ${Math.round(results.requiredCorpus).toLocaleString()}. This assumes a {formData.withdrawalRate}% withdrawal rate
                    and {formData.inflationRate}% inflation. With your current savings and investment plan, you need to invest 
                    ${Math.round(results.monthlyInvestmentNeeded).toLocaleString()} monthly to reach your FIRE goal.
                </p>
            </div>

            {/* Chart */}
            <InvestmentChart 
                data={results.chartData}
                type="line"
                stacked={false}
                height={400}
                yAxisLabel="Amount ($)"
                isDarkMode={isDarkMode}
                series={[
                    { key: 'currentValue', name: 'Portfolio Value', color: isDarkMode ? '#34D399' : '#10B981' },
                    { key: 'targetValue', name: 'Required Corpus', color: isDarkMode ? '#F87171' : '#EF4444' },
                    { key: 'totalInvested', name: 'Total Invested', color: isDarkMode ? '#60A5FA' : '#3B82F6' }
                ]}
            />
        </div>
    );
};

export default FIRECalculator; 