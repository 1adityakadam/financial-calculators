'use client';
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import InvestmentChart from './InvestmentChart';
import CalculatorInput from './CalculatorInput';

const GoalSIPCalculator = () => {
    const [formData, setFormData] = useState({
        goalAmount: 100000,
        years: 5,
        expectedReturn: 10,
        existingInvestment: 0
    });

    const [results, setResults] = useState({
        monthlySIP: 0,
        totalInvestment: 0,
        wealthGained: 0,
        monthlyData: [],
        goalProgress: 0
    });

    const calculateResults = () => {
        const { goalAmount, years, expectedReturn, existingInvestment } = formData;
        const P = parseFloat(goalAmount);
        const t = parseFloat(years);
        const r = parseFloat(expectedReturn) / 100 / 12; // Monthly rate
        const existing = parseFloat(existingInvestment) || 0;

        if (P <= 0 || t <= 0 || r <= 0) {
            return;
        }

        // Future Value after accounting for existing investment
        const targetFV = P - (existing * Math.pow(1 + r, t * 12));
        
        // Monthly SIP = FV / {(1 + r)^n - 1} / (1 + r)
        // where n is total number of months
        const n = t * 12;
        const monthlySIP = (targetFV * r) / (Math.pow(1 + r, n) - 1);
        
        const totalInvestment = (monthlySIP * n) + existing;
        const wealthGained = P - totalInvestment;

        // Generate monthly data for the chart
        const monthlyData = [];
        for (let month = 0; month <= n; month++) {
            const sipInvestment = monthlySIP * month;
            const totalInvested = sipInvestment + existing;
            
            // Calculate future value of both SIP and existing investment
            const sipFV = monthlySIP * ((Math.pow(1 + r, month) - 1) / r) * (1 + r);
            const existingFV = existing * Math.pow(1 + r, month);
            const totalFV = sipFV + existingFV;
            
            monthlyData.push({
                year: (month / 12).toFixed(1),
                invested: totalInvested,
                returns: totalFV - totalInvested,
                total: totalFV,
                goal: P
            });
        }

        setResults({
            monthlySIP,
            totalInvestment,
            wealthGained,
            monthlyData,
            goalProgress: (totalInvestment / P) * 100
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
                <h2 className="text-2xl font-bold text-gray-800">Goal SIP Calculator</h2>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Required Monthly SIP</div>
                    <div className="text-2xl font-bold text-green-600">
                        ${Math.round(results.monthlySIP).toLocaleString()}
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Total Investment</div>
                    <div className="text-2xl font-bold text-blue-600">
                        ${Math.round(results.totalInvestment).toLocaleString()}
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Wealth Gained</div>
                    <div className="text-2xl font-bold text-purple-600">
                        ${Math.round(results.wealthGained).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <CalculatorInput
                    label="Target Goal Amount"
                    value={formData.goalAmount}
                    onChange={(value) => handleInputChange('goalAmount', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                />

                <CalculatorInput
                    label="Time to Achieve Goal (Years)"
                    value={formData.years}
                    onChange={(value) => handleInputChange('years', value)}
                    type="number"
                    min="1"
                    max="30"
                    placeholder="Years"
                />

                <CalculatorInput
                    label="Expected Annual Return"
                    value={formData.expectedReturn}
                    onChange={(value) => handleInputChange('expectedReturn', value)}
                    type="number"
                    suffix="%"
                    step="0.1"
                    min="0"
                    max="30"
                />

                <CalculatorInput
                    label="Existing Investment (Optional)"
                    value={formData.existingInvestment}
                    onChange={(value) => handleInputChange('existingInvestment', value)}
                    type="currency"
                    prefix="$"
                    placeholder="0.00"
                />
            </div>

            {/* Explanation */}
            <div className="mb-8 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                <p>
                    To reach your goal of ${formData.goalAmount.toLocaleString()} in {formData.years} years,
                    you need to invest ${Math.round(results.monthlySIP).toLocaleString()} monthly at {formData.expectedReturn}% annual return.
                    {formData.existingInvestment > 0 && ` Your existing investment of $${formData.existingInvestment.toLocaleString()} has been considered in the calculation.`}
                </p>
            </div>

            {/* Chart */}
            <InvestmentChart 
                data={results.monthlyData}
                type="line"
                stacked={false}
                height={400}
                yAxisLabel="Amount ($)"
                series={[
                    { key: 'total', name: 'Total Value', color: '#8B5CF6' },
                    { key: 'invested', name: 'Amount Invested', color: '#10B981' },
                    { key: 'goal', name: 'Goal Amount', color: '#EF4444' }
                ]}
            />
        </div>
    );
};

export default GoalSIPCalculator; 