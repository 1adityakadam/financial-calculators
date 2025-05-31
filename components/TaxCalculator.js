'use client';
import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { STATE_TAX_DATA } from '../utils/stateTaxData';

const FEDERAL_BRACKETS_2024 = {
    single: [
        { min: 0, max: 11600, rate: 10 },
        { min: 11600, max: 47150, rate: 12 },
        { min: 47150, max: 100525, rate: 22 },
        { min: 100525, max: 191950, rate: 24 },
        { min: 191950, max: 243725, rate: 32 },
        { min: 243725, max: 609350, rate: 35 },
        { min: 609350, max: Infinity, rate: 37 }
    ],
    married: [
        { min: 0, max: 23200, rate: 10 },
        { min: 23200, max: 94300, rate: 12 },
        { min: 94300, max: 201050, rate: 22 },
        { min: 201050, max: 383900, rate: 24 },
        { min: 383900, max: 487450, rate: 32 },
        { min: 487450, max: 731200, rate: 35 },
        { min: 731200, max: Infinity, rate: 37 }
    ]
};

const STANDARD_DEDUCTION_2024 = {
    single: 14600,
    married: 29200
};

const calculateTaxForBrackets = (income, brackets) => {
    let remainingIncome = income;
    let totalTax = 0;

    for (let i = 0; i < brackets.length; i++) {
        const bracket = brackets[i];
        const taxableInBracket = Math.min(
            Math.max(0, remainingIncome),
            bracket.max - bracket.min
        );
        
        totalTax += (taxableInBracket * bracket.rate) / 100;
        remainingIncome -= taxableInBracket;

        if (remainingIncome <= 0) break;
    }

    return totalTax;
};

const TaxCalculator = () => {
    const [income, setIncome] = useState('');
    const [filingStatus, setFilingStatus] = useState('single');
    const [state, setState] = useState('CA');
    const [deductionType, setDeductionType] = useState('standard');
    const [itemizedDeductions, setItemizedDeductions] = useState('');
    const [results, setResults] = useState(null);

    const calculateTax = () => {
        const numericIncome = parseFloat(income.replace(/,/g, '')) || 0;
        const deduction = deductionType === 'standard' 
            ? STANDARD_DEDUCTION_2024[filingStatus]
            : parseFloat(itemizedDeductions.replace(/,/g, '')) || 0;

        const taxableIncome = Math.max(0, numericIncome - deduction);
        
        // Calculate Federal Tax
        const federalTax = calculateTaxForBrackets(
            taxableIncome,
            FEDERAL_BRACKETS_2024[filingStatus]
        );

        // Calculate State Tax
        const stateTax = calculateTaxForBrackets(
            taxableIncome,
            STATE_TAX_DATA[state].brackets
        );

        const totalTax = federalTax + stateTax;
        const effectiveRate = (totalTax / numericIncome * 100) || 0;

        setResults({
            taxableIncome: taxableIncome.toFixed(2),
            federalTax: federalTax.toFixed(2),
            stateTax: stateTax.toFixed(2),
            totalTax: totalTax.toFixed(2),
            effectiveRate: effectiveRate.toFixed(2),
            takeHome: (numericIncome - totalTax).toFixed(2)
        });
    };

    const formatCurrency = (value) => {
        if (!value) return '';
        const number = value.replace(/[^\d.]/g, '');
        const parts = number.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    const handleIncomeChange = (e) => {
        const formatted = formatCurrency(e.target.value);
        setIncome(formatted);
    };

    const handleItemizedDeductionsChange = (e) => {
        const formatted = formatCurrency(e.target.value);
        setItemizedDeductions(formatted);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Tax Calculator 2024</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Annual Income
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <input
                                type="text"
                                value={income}
                                onChange={handleIncomeChange}
                                className="pl-8 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your annual income"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filing Status
                        </label>
                        <select
                            value={filingStatus}
                            onChange={(e) => setFilingStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="single">Single</option>
                            <option value="married">Married Filing Jointly</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                        </label>
                        <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {Object.entries(STATE_TAX_DATA).map(([code, { name }]) => (
                                <option key={code} value={code}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deduction Type
                        </label>
                        <select
                            value={deductionType}
                            onChange={(e) => setDeductionType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="standard">Standard Deduction</option>
                            <option value="itemized">Itemized Deductions</option>
                        </select>
                    </div>

                    {deductionType === 'itemized' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Itemized Deductions Total
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="text"
                                    value={itemizedDeductions}
                                    onChange={handleItemizedDeductionsChange}
                                    className="pl-8 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter total itemized deductions"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={calculateTax}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Calculate Tax
                    </button>
                </div>

                {results && (
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Summary</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Taxable Income:</p>
                                <p className="text-lg font-semibold">${formatCurrency(results.taxableIncome)}</p>
                            </div>
                            
                            <div>
                                <p className="text-sm text-gray-600">Federal Tax:</p>
                                <p className="text-lg font-semibold">${formatCurrency(results.federalTax)}</p>
                            </div>
                            
                            <div>
                                <p className="text-sm text-gray-600">State Tax ({STATE_TAX_DATA[state].name}):</p>
                                <p className="text-lg font-semibold">${formatCurrency(results.stateTax)}</p>
                            </div>
                            
                            <div>
                                <p className="text-sm text-gray-600">Total Tax:</p>
                                <p className="text-lg font-semibold">${formatCurrency(results.totalTax)}</p>
                            </div>
                            
                            <div>
                                <p className="text-sm text-gray-600">Effective Tax Rate:</p>
                                <p className="text-lg font-semibold">{results.effectiveRate}%</p>
                            </div>
                            
                            <div>
                                <p className="text-sm text-gray-600">Take-Home Income:</p>
                                <p className="text-lg font-semibold">${formatCurrency(results.takeHome)}</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-800">
                                Note: This is an estimate based on 2024 tax brackets. Actual tax liability may vary based on credits, additional deductions, and other factors.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaxCalculator; 