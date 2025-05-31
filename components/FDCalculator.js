'use client';
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';

const FDCalculator = ({ isDarkMode }) => {
    const [formData, setFormData] = useState({
        principal: 10000,
        rate: 5,
        years: 5,
        compoundingFrequency: '12'
    });

    const [results, setResults] = useState({
        maturityAmount: 0,
        interest: 0,
        effectiveRate: 0,
        chartData: []
    });

    const calculateResults = () => {
        const { principal, rate, years, compoundingFrequency } = formData;
        const n = parseFloat(compoundingFrequency);
        const r = rate / 100;
        
        // Calculate maturity amount using compound interest formula
        const maturityAmount = principal * Math.pow(1 + r/n, n * years);
        const interest = maturityAmount - principal;
        
        // Calculate effective annual rate
        const effectiveRate = (Math.pow(1 + r/n, n) - 1) * 100;

        // Generate chart data
        const chartData = [];
        for (let year = 0; year <= years; year++) {
            const amount = principal * Math.pow(1 + r/n, n * year);
            chartData.push({
                year,
                balance: Math.round(amount),
                interest: Math.round(amount - principal)
            });
        }

        setResults({
            maturityAmount,
            interest,
            effectiveRate: effectiveRate.toFixed(2),
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

    const compoundingOptions = [
        { value: '1', label: 'Annually' },
        { value: '2', label: 'Semi-annually' },
        { value: '4', label: 'Quarterly' },
        { value: '12', label: 'Monthly' },
        { value: '365', label: 'Daily' }
    ];

    return (
        <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-200`}>
            <div className="flex items-center gap-3 mb-6">
                <Calculator className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} size={28} />
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Fixed Deposit (FD) Calculator</h2>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Maturity Amount</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${Math.round(results.maturityAmount).toLocaleString()}
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Interest Earned</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${Math.round(results.interest).toLocaleString()}
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Effective Annual Rate</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
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
                    isDarkMode={isDarkMode}
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
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Time Period (Years)"
                    value={formData.years}
                    onChange={(value) => handleInputChange('years', value)}
                    type="number"
                    min="1"
                    max="30"
                    placeholder="Years"
                    isDarkMode={isDarkMode}
                />

                <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                        Compounding Frequency
                    </label>
                    <select
                        value={formData.compoundingFrequency}
                        onChange={(e) => handleInputChange('compoundingFrequency', e.target.value)}
                        className={`block w-full rounded-md ${
                            isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                : 'bg-white border-gray-300 text-gray-700'
                        } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-200`}
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
                data={results.chartData}
                type="area"
                stacked={false}
                height={400}
                yAxisLabel="Amount ($)"
                isDarkMode={isDarkMode}
                series={[
                    { key: 'balance', name: 'Total Value', color: isDarkMode ? '#34D399' : '#10B981' },
                    { key: 'interest', name: 'Interest Earned', color: isDarkMode ? '#60A5FA' : '#3B82F6' }
                ]}
            />
        </div>
    );
};

export default FDCalculator; 