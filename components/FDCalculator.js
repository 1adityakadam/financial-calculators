'use client';
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';

const FDCalculator = () => {
    const [formData, setFormData] = useState({
        principal: 10000,
        rate: 5,
        years: 5,
        compoundingFrequency: '4' // Quarterly by default
    });

    const [results, setResults] = useState({
        maturityAmount: 0,
        interest: 0,
        yearlyData: [],
        effectiveRate: 0
    });

    const calculateResults = () => {
        const { principal, rate, years, compoundingFrequency } = formData;
        const p = parseFloat(principal);
        const r = parseFloat(rate) / 100;
        const t = parseFloat(years);
        const n = parseFloat(compoundingFrequency);

        if (p <= 0 || r <= 0 || t <= 0) {
            return;
        }

        // Calculate effective annual rate
        const effectiveRate = (Math.pow(1 + r/n, n) - 1) * 100;

        // Calculate final maturity amount
        const maturityAmount = p * Math.pow(1 + r/n, n*t);
        const interest = maturityAmount - p;

        // Generate data points for the chart
        const yearlyData = [];
        const pointsPerYear = 4; // We'll show quarterly points
        const totalPoints = t * pointsPerYear;

        for (let i = 0; i <= totalPoints; i++) {
            const timeInYears = i / pointsPerYear;
            const currentValue = p * Math.pow(1 + r/n, n * timeInYears);
            
            yearlyData.push({
                year: timeInYears.toFixed(2),
                invested: p,
                interest: currentValue - p,
                total: currentValue
            });
        }

        setResults({
            maturityAmount,
            interest,
            yearlyData,
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

    const compoundingOptions = [
        { value: '1', label: 'Annually' },
        { value: '2', label: 'Semi-annually' },
        { value: '4', label: 'Quarterly' },
        { value: '12', label: 'Monthly' },
        { value: '365', label: 'Daily' }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <Calculator className="text-blue-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-800">Fixed Deposit Calculator</h2>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Maturity Amount</div>
                    <div className="text-2xl font-bold text-green-600">
                        ${Math.round(results.maturityAmount).toLocaleString()}
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Interest Earned</div>
                    <div className="text-2xl font-bold text-blue-600">
                        ${Math.round(results.interest).toLocaleString()}
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Effective Annual Rate</div>
                    <div className="text-2xl font-bold text-purple-600">
                        {results.effectiveRate}%
                    </div>
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <CalculatorInput
                    label="Principal Amount"
                    value={formData.principal}
                    onChange={(value) => handleInputChange('principal', value)}
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
                    label="Time Period (Years)"
                    value={formData.years}
                    onChange={(value) => handleInputChange('years', value)}
                    type="number"
                    min="1"
                    max="30"
                    placeholder="Years"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Compounding Frequency
                    </label>
                    <select
                        value={formData.compoundingFrequency}
                        onChange={(e) => handleInputChange('compoundingFrequency', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                        {compoundingOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Explanation */}
            <div className="mb-8 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>
                    Your investment of ${formData.principal.toLocaleString()} will grow to ${Math.round(results.maturityAmount).toLocaleString()} in {formData.years} years,
                    earning ${Math.round(results.interest).toLocaleString()} in interest with {compoundingOptions.find(opt => opt.value === formData.compoundingFrequency)?.label.toLowerCase()} compounding.
                </p>
            </div>

            {/* Chart */}
            <InvestmentChart 
                data={results.yearlyData}
                type="area"
                stacked={true}
                height={400}
                yAxisLabel="Amount ($)"
                series={[
                    { key: 'invested', name: 'Principal Amount', color: '#10B981' },
                    { key: 'interest', name: 'Interest Earned', color: '#3B82F6' }
                ]}
            />
        </div>
    );
};

export default FDCalculator; 