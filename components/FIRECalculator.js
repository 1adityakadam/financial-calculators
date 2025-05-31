'use client';
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';

const FIRECalculator = () => {
    const [formData, setFormData] = useState({
        currentAge: 30,
        retirementAge: 45,
        monthlyExpenses: 5000,
        currentSavings: 100000,
        expectedReturn: 8,
        inflationRate: 3
    });

    const [results, setResults] = useState({
        requiredCorpus: 0,
        monthlyInvestmentNeeded: 0,
        futureAnnualExpenses: 0,
        yearsToRetirement: 0,
        chartData: []
    });

    const calculateResults = () => {
        const { currentAge, retirementAge, monthlyExpenses, currentSavings, expectedReturn, inflationRate } = formData;
        const age = parseFloat(currentAge);
        const retireAge = parseFloat(retirementAge);
        const expenses = parseFloat(monthlyExpenses) * 12; // Annual expenses
        const savings = parseFloat(currentSavings);
        const returnRate = parseFloat(expectedReturn) / 100;
        const inflation = parseFloat(inflationRate) / 100;
        
        if ([age, retireAge, expenses, returnRate, inflation].some(isNaN)) return;

        // Calculate years until retirement
        const yearsToRetirement = retireAge - age;
        
        // Calculate inflation-adjusted expenses at retirement
        const futureAnnualExpenses = expenses * Math.pow(1 + inflation, yearsToRetirement);
        
        // Using the 4% rule (25x annual expenses) for retirement corpus
        const requiredCorpus = futureAnnualExpenses * 25;
        
        // Calculate how much the current savings will grow to
        const futureSavings = savings * Math.pow(1 + returnRate, yearsToRetirement);
        
        // Calculate additional corpus needed
        const additionalCorpusNeeded = requiredCorpus - futureSavings;
        
        // Calculate monthly investment needed
        // PMT = FV * r / ((1 + r)^n - 1)
        const monthlyRate = returnRate / 12;
        const totalMonths = yearsToRetirement * 12;
        const monthlyInvestmentNeeded = 
            (additionalCorpusNeeded * monthlyRate) / 
            (Math.pow(1 + monthlyRate, totalMonths) - 1);

        // Generate data for the chart
        const chartData = [];
        let currentYear = age;
        let currentValue = savings;
        let totalInvested = savings;
        const monthlyInvestment = monthlyInvestmentNeeded;

        while (currentYear <= retireAge + 30) { // Project 30 years past retirement
            const isRetired = currentYear >= retireAge;
            
            if (!isRetired) {
                // During accumulation phase
                totalInvested += monthlyInvestment * 12;
                currentValue = currentValue * (1 + returnRate) + monthlyInvestment * 12;
            } else {
                // During retirement phase
                const yearsSinceRetirement = currentYear - retireAge;
                const withdrawalAmount = futureAnnualExpenses * Math.pow(1 + inflation, yearsSinceRetirement);
                currentValue = currentValue * (1 + returnRate) - withdrawalAmount;
            }

            chartData.push({
                year: currentYear,
                portfolio: Math.max(0, currentValue),
                invested: totalInvested,
                expenses: isRetired ? futureAnnualExpenses * Math.pow(1 + inflation, currentYear - retireAge) : 0
            });

            currentYear++;
        }

        setResults({
            requiredCorpus,
            monthlyInvestmentNeeded,
            futureAnnualExpenses,
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
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <Calculator className="text-blue-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-800">FIRE Calculator</h2>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Required Corpus</div>
                    <div className="text-2xl font-bold text-green-600">
                        ${Math.round(results.requiredCorpus).toLocaleString()}
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Monthly Investment</div>
                    <div className="text-2xl font-bold text-blue-600">
                        ${Math.round(results.monthlyInvestmentNeeded).toLocaleString()}
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Years to FIRE</div>
                    <div className="text-2xl font-bold text-purple-600">
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
                    max="80"
                />

                <CalculatorInput
                    label="Retirement Age"
                    value={formData.retirementAge}
                    onChange={(value) => handleInputChange('retirementAge', value)}
                    type="number"
                    min="35"
                    max="90"
                />

                <CalculatorInput
                    label="Monthly Expenses"
                    value={formData.monthlyExpenses}
                    onChange={(value) => handleInputChange('monthlyExpenses', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                />

                <CalculatorInput
                    label="Current Savings"
                    value={formData.currentSavings}
                    onChange={(value) => handleInputChange('currentSavings', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                />

                <CalculatorInput
                    label="Expected Return Rate"
                    value={formData.expectedReturn}
                    onChange={(value) => handleInputChange('expectedReturn', value)}
                    type="number"
                    suffix="%"
                    step="0.1"
                    min="0"
                    max="20"
                />

                <CalculatorInput
                    label="Inflation Rate"
                    value={formData.inflationRate}
                    onChange={(value) => handleInputChange('inflationRate', value)}
                    type="number"
                    suffix="%"
                    step="0.1"
                    min="0"
                    max="10"
                />
            </div>

            {/* Explanation */}
            <div className="mb-8 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>
                    To retire at age {formData.retirementAge} with monthly expenses of ${formData.monthlyExpenses.toLocaleString()},
                    you'll need a corpus of ${Math.round(results.requiredCorpus).toLocaleString()}.
                    Starting with ${formData.currentSavings.toLocaleString()} in savings,
                    you need to invest ${Math.round(results.monthlyInvestmentNeeded).toLocaleString()} monthly
                    to reach your FIRE goal in {results.yearsToRetirement} years.
                    Your annual expenses at retirement will be ${Math.round(results.futureAnnualExpenses).toLocaleString()}.
                </p>
            </div>

            {/* Chart */}
            <InvestmentChart 
                data={results.chartData}
                type="line"
                stacked={false}
                height={400}
                yAxisLabel="Amount ($)"
                series={[
                    { key: 'portfolio', name: 'Portfolio Value', color: '#8B5CF6' },
                    { key: 'invested', name: 'Amount Invested', color: '#10B981' },
                    { key: 'expenses', name: 'Annual Expenses', color: '#EF4444' }
                ]}
            />
        </div>
    );
};

export default FIRECalculator; 