'use client';
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';

const HRACalculator = () => {
    const [formData, setFormData] = useState({
        basicSalary: 50000,
        hraReceived: 20000,
        rentPaid: 25000,
        cityType: 'metro' // metro or non-metro
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
        const { basicSalary, hraReceived, rentPaid, cityType } = formData;
        const basic = parseFloat(basicSalary);
        const hra = parseFloat(hraReceived);
        const rent = parseFloat(rentPaid);

        if (basic <= 0 || hra <= 0 || rent <= 0) return;

        // Calculate HRA exemption based on the least of:
        // 1. Actual HRA received
        // 2. 50% of basic salary for metro cities, 40% for non-metro
        // 3. Rent paid minus 10% of basic salary
        const basicPercent = cityType === 'metro' ? 0.5 : 0.4;
        const basicComponent = basic * basicPercent;
        const rentMinusBasic = rent - (basic * 0.1);
        const exemptedHRA = Math.min(
            hra,
            basicComponent,
            Math.max(0, rentMinusBasic)
        );
        const taxableHRA = hra - exemptedHRA;

        // Generate data for the chart
        const chartData = [
            {
                category: 'Components',
                'Basic Salary': basic,
                'HRA Received': hra,
                'Rent Paid': rent,
                'Exempted HRA': exemptedHRA,
                'Taxable HRA': taxableHRA
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
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <Calculator className="text-blue-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-800">HRA Calculator</h2>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Exempted HRA</div>
                    <div className="text-2xl font-bold text-green-600">
                        ${Math.round(results.exemptedHRA).toLocaleString()}
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Taxable HRA</div>
                    <div className="text-2xl font-bold text-blue-600">
                        ${Math.round(results.taxableHRA).toLocaleString()}
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Basic Limit</div>
                    <div className="text-2xl font-bold text-purple-600">
                        {results.basicPercent}%
                    </div>
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <CalculatorInput
                    label="Basic Salary"
                    value={formData.basicSalary}
                    onChange={(value) => handleInputChange('basicSalary', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                />

                <CalculatorInput
                    label="HRA Received"
                    value={formData.hraReceived}
                    onChange={(value) => handleInputChange('hraReceived', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                />

                <CalculatorInput
                    label="Rent Paid"
                    value={formData.rentPaid}
                    onChange={(value) => handleInputChange('rentPaid', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        City Type
                    </label>
                    <select
                        value={formData.cityType}
                        onChange={(e) => handleInputChange('cityType', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                        <option value="metro">Metropolitan City</option>
                        <option value="non-metro">Non-Metropolitan City</option>
                    </select>
                </div>
            </div>

            {/* Explanation */}
            <div className="mb-8 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>
                    With a basic salary of ${formData.basicSalary.toLocaleString()}, HRA received of ${formData.hraReceived.toLocaleString()},
                    and rent paid of ${formData.rentPaid.toLocaleString()} in a {formData.cityType === 'metro' ? 'metropolitan' : 'non-metropolitan'} city,
                    your exempted HRA is ${Math.round(results.exemptedHRA).toLocaleString()} and taxable HRA is ${Math.round(results.taxableHRA).toLocaleString()}.
                </p>
            </div>

            {/* Chart */}
            <InvestmentChart 
                data={results.chartData}
                type="bar"
                stacked={false}
                height={400}
                yAxisLabel="Amount ($)"
                series={[
                    { key: 'Basic Salary', name: 'Basic Salary', color: '#10B981' },
                    { key: 'HRA Received', name: 'HRA Received', color: '#3B82F6' },
                    { key: 'Rent Paid', name: 'Rent Paid', color: '#8B5CF6' },
                    { key: 'Exempted HRA', name: 'Exempted HRA', color: '#059669' },
                    { key: 'Taxable HRA', name: 'Taxable HRA', color: '#EF4444' }
                ]}
            />
        </div>
    );
};

export default HRACalculator; 