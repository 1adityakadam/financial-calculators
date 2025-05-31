'use client';
import { useState } from 'react';

const TaxCalculator = () => {
    const [income, setIncome] = useState('');
    const [state, setState] = useState('CA');
    const [filingStatus, setFilingStatus] = useState('single');
    const [result, setResult] = useState(null);

    // 2023 Federal Tax Brackets
    const federalBrackets = {
        single: [
            { rate: 0.10, limit: 11000 },
            { rate: 0.12, limit: 44725 },
            { rate: 0.22, limit: 95375 },
            { rate: 0.24, limit: 182100 },
            { rate: 0.32, limit: 231250 },
            { rate: 0.35, limit: 578125 },
            { rate: 0.37, limit: Infinity }
        ],
        married: [
            { rate: 0.10, limit: 22000 },
            { rate: 0.12, limit: 89450 },
            { rate: 0.22, limit: 190750 },
            { rate: 0.24, limit: 364200 },
            { rate: 0.32, limit: 462500 },
            { rate: 0.35, limit: 693750 },
            { rate: 0.37, limit: Infinity }
        ]
    };

    // Simplified state tax rates (2023) - Just a few states as example
    const stateTaxRates = {
        CA: [
            { rate: 0.01, limit: 10099 },
            { rate: 0.02, limit: 23942 },
            { rate: 0.04, limit: 37788 },
            { rate: 0.06, limit: 52455 },
            { rate: 0.08, limit: 66295 },
            { rate: 0.093, limit: 338639 },
            { rate: 0.103, limit: 406364 },
            { rate: 0.113, limit: 677275 },
            { rate: 0.123, limit: Infinity }
        ],
        NY: [
            { rate: 0.04, limit: 8500 },
            { rate: 0.045, limit: 11700 },
            { rate: 0.0525, limit: 13900 },
            { rate: 0.059, limit: 80650 },
            { rate: 0.0597, limit: 215400 },
            { rate: 0.0633, limit: 1077550 },
            { rate: 0.0685, limit: 5000000 },
            { rate: 0.0882, limit: Infinity }
        ],
        TX: [], // No state income tax
        FL: [], // No state income tax
    };

    const calculateTaxForBrackets = (income, brackets) => {
        let remainingIncome = income;
        let totalTax = 0;
        let previousLimit = 0;

        for (const bracket of brackets) {
            const taxableInThisBracket = Math.min(
                remainingIncome,
                bracket.limit - previousLimit
            );

            if (taxableInThisBracket <= 0) break;

            totalTax += taxableInThisBracket * bracket.rate;
            remainingIncome -= taxableInThisBracket;
            previousLimit = bracket.limit;
        }

        return totalTax;
    };

    const calculate = () => {
        const annualIncome = parseFloat(income);

        if (isNaN(annualIncome)) {
            alert('Please enter a valid income amount');
            return;
        }

        // Calculate Federal Tax
        const federalTax = calculateTaxForBrackets(
            annualIncome,
            federalBrackets[filingStatus]
        );

        // Calculate State Tax
        const stateTax = stateTaxRates[state].length
            ? calculateTaxForBrackets(annualIncome, stateTaxRates[state])
            : 0;

        // Calculate totals
        const totalTax = federalTax + stateTax;
        const effectiveRate = (totalTax / annualIncome) * 100;
        const takeHomePay = annualIncome - totalTax;

        setResult({
            federalTax: federalTax.toFixed(2),
            stateTax: stateTax.toFixed(2),
            totalTax: totalTax.toFixed(2),
            effectiveRate: effectiveRate.toFixed(2),
            takeHomePay: takeHomePay.toFixed(2),
            monthlyTakeHome: (takeHomePay / 12).toFixed(2)
        });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">US Tax Calculator (2023)</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Annual Income ($)</label>
                    <input
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your annual income"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Filing Status</label>
                    <select
                        value={filingStatus}
                        onChange={(e) => setFilingStatus(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="single">Single</option>
                        <option value="married">Married Filing Jointly</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                    </select>
                </div>

                <button
                    onClick={calculate}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Calculate Taxes
                </button>

                {result && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">Tax Breakdown:</h3>
                        <div className="space-y-2">
                            <p className="text-sm">Federal Tax: ${result.federalTax}</p>
                            <p className="text-sm">State Tax: ${result.stateTax}</p>
                            <p className="text-sm font-semibold text-red-600">Total Tax: ${result.totalTax}</p>
                            <p className="text-sm">Effective Tax Rate: {result.effectiveRate}%</p>
                            <div className="border-t pt-2 mt-2">
                                <p className="text-sm font-semibold text-green-600">Annual Take-Home: ${result.takeHomePay}</p>
                                <p className="text-sm">Monthly Take-Home: ${result.monthlyTakeHome}</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            Note: This is a simplified calculation and does not include deductions, credits, or local taxes.
                            Please consult a tax professional for detailed tax planning.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaxCalculator; 