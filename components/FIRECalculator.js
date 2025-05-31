'use client';
import { useState } from 'react';

const FIRECalculator = () => {
    const [currentAge, setCurrentAge] = useState('');
    const [retirementAge, setRetirementAge] = useState('');
    const [monthlyExpenses, setMonthlyExpenses] = useState('');
    const [currentSavings, setCurrentSavings] = useState('');
    const [expectedReturn, setExpectedReturn] = useState('');
    const [inflationRate, setInflationRate] = useState('');
    const [result, setResult] = useState(null);

    const calculateFIRE = () => {
        const age = parseFloat(currentAge);
        const retireAge = parseFloat(retirementAge);
        const expenses = parseFloat(monthlyExpenses) * 12; // Annual expenses
        const savings = parseFloat(currentSavings);
        const returnRate = parseFloat(expectedReturn) / 100;
        const inflation = parseFloat(inflationRate) / 100;
        
        if ([age, retireAge, expenses, returnRate, inflation].some(isNaN)) {
            alert('Please enter valid numbers');
            return;
        }

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

        setResult({
            requiredCorpus: requiredCorpus.toFixed(2),
            monthlyInvestmentNeeded: monthlyInvestmentNeeded.toFixed(2),
            futureAnnualExpenses: futureAnnualExpenses.toFixed(2),
            yearsToRetirement
        });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">FIRE Calculator</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Age</label>
                    <input
                        type="number"
                        value={currentAge}
                        onChange={(e) => setCurrentAge(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your current age"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Desired Retirement Age</label>
                    <input
                        type="number"
                        value={retirementAge}
                        onChange={(e) => setRetirementAge(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter retirement age"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Monthly Expenses (₹)</label>
                    <input
                        type="number"
                        value={monthlyExpenses}
                        onChange={(e) => setMonthlyExpenses(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter current monthly expenses"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Savings (₹)</label>
                    <input
                        type="number"
                        value={currentSavings}
                        onChange={(e) => setCurrentSavings(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter current savings"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Expected Return Rate (%)</label>
                    <input
                        type="number"
                        value={expectedReturn}
                        onChange={(e) => setExpectedReturn(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter expected return rate"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Expected Inflation Rate (%)</label>
                    <input
                        type="number"
                        value={inflationRate}
                        onChange={(e) => setInflationRate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter expected inflation rate"
                    />
                </div>

                <button
                    onClick={calculateFIRE}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Calculate FIRE Numbers
                </button>

                {result && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">Your FIRE Numbers:</h3>
                        <div className="space-y-2">
                            <p className="text-sm">Years to Retirement: {result.yearsToRetirement} years</p>
                            <p className="text-sm">Future Annual Expenses: ₹{result.futureAnnualExpenses}</p>
                            <p className="text-sm font-semibold">Required Retirement Corpus: ₹{result.requiredCorpus}</p>
                            <p className="text-sm font-semibold">Required Monthly Investment: ₹{result.monthlyInvestmentNeeded}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            Note: This calculation uses the 4% withdrawal rule and assumes constant inflation and return rates.
                            Actual results may vary based on market conditions and lifestyle changes.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FIRECalculator; 