'use client';
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';

const HRACalculator = ({ isDarkMode }) => {
    const [formData, setFormData] = useState({
        basicSalary: 50000,
        hra: 20000,
        rentPaid: 25000,
        cityType: 'metro'
    });

    const [results, setResults] = useState({
        exemptedHRA: 0,
        taxableHRA: 0,
        basicPercent: 0,
        rentMinusBasic: 0,
        actualHRA: 0,
        chartData: []
    });

    const calculateResults = () => {
        const { basicSalary, hra, rentPaid, cityType } = formData;
        
        // Calculate HRA exemption based on the minimum of:
        // 1. Actual HRA received
        // 2. Rent paid - 10% of basic salary
        // 3. 50% of basic salary (for metro) or 40% (for non-metro)
        
        const basicPercent = cityType === 'metro' ? 0.5 : 0.4;
        const rentMinusBasic = Math.max(0, rentPaid - (0.1 * basicSalary));
        const maxExemption = basicSalary * basicPercent;
        
        const exemptedHRA = Math.min(
            hra,
            rentMinusBasic,
            maxExemption
        );
        
        const taxableHRA = Math.max(0, hra - exemptedHRA);

        // Generate chart data
        const chartData = [
            {
                category: 'Actual',
                amount: hra
            },
            {
                category: 'Exempted',
                amount: exemptedHRA
            },
            {
                category: 'Taxable',
                amount: taxableHRA
            }
        ];

        setResults({
            exemptedHRA,
            taxableHRA,
            basicPercent: basicPercent * 100,
            rentMinusBasic,
            actualHRA: hra,
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
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>HRA Calculator</h2>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Exempted HRA</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${Math.round(results.exemptedHRA).toLocaleString()}
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Taxable HRA</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${Math.round(results.taxableHRA).toLocaleString()}
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Basic Limit</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {results.basicPercent}%
                    </div>
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <CalculatorInput
                    label="Basic Salary (Monthly)"
                    value={formData.basicSalary}
                    onChange={(value) => handleInputChange('basicSalary', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="HRA Received (Monthly)"
                    value={formData.hra}
                    onChange={(value) => handleInputChange('hra', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                    isDarkMode={isDarkMode}
                />

                <CalculatorInput
                    label="Rent Paid (Monthly)"
                    value={formData.rentPaid}
                    onChange={(value) => handleInputChange('rentPaid', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                    isDarkMode={isDarkMode}
                />

                <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                        City Type
                    </label>
                    <select
                        value={formData.cityType}
                        onChange={(e) => handleInputChange('cityType', e.target.value)}
                        className={`block w-full rounded-md ${
                            isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                : 'bg-white border-gray-300 text-gray-700'
                        } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-200`}
                    >
                        <option value="metro">Metro City</option>
                        <option value="non-metro">Non-Metro City</option>
                    </select>
                </div>
            </div>

            {/* Explanation */}
            <div className={`mb-8 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-md text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                    With a basic salary of ${formData.basicSalary}, HRA received of ${formData.hra}, and rent paid of ${formData.rentPaid},
                    your exempted HRA is ${Math.round(results.exemptedHRA)}. This means ${Math.round(results.taxableHRA)} of your HRA is taxable.
                    The exemption is calculated based on the minimum of actual HRA received, rent paid minus 10% of basic salary, and {results.basicPercent}% of basic salary.
                </p>
            </div>

            {/* Chart */}
            <InvestmentChart 
                data={results.chartData}
                type="bar"
                stacked={false}
                height={400}
                yAxisLabel="Amount ($)"
                isDarkMode={isDarkMode}
                series={[
                    { key: 'amount', name: 'Amount', color: isDarkMode ? '#34D399' : '#10B981' }
                ]}
            />
        </div>
    );
};

export default HRACalculator; 