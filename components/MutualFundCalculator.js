'use client';
import { useState } from 'react';

const MutualFundCalculator = () => {
    const [investmentType, setInvestmentType] = useState('lumpsum');
    const [amount, setAmount] = useState('');
    const [monthlyInvestment, setMonthlyInvestment] = useState('');
    const [years, setYears] = useState('');
    const [expectedReturn, setExpectedReturn] = useState('');
    const [result, setResult] = useState(null);

    const calculateLumpsum = () => {
        const p = parseFloat(amount);
        const r = parseFloat(expectedReturn) / 100;
        const t = parseFloat(years);

        const futureValue = p * Math.pow(1 + r, t);
        const totalInvestment = p;
        const totalReturns = futureValue - totalInvestment;

        return {
            futureValue,
            totalInvestment,
            totalReturns
        };
    };

    const calculateSIP = () => {
        const p = parseFloat(monthlyInvestment);
        const r = parseFloat(expectedReturn) / 100 / 12; // Monthly rate
        const t = parseFloat(years) * 12; // Total months

        const futureValue = p * ((Math.pow(1 + r, t) - 1) / r) * (1 + r);
        const totalInvestment = p * t;
        const totalReturns = futureValue - totalInvestment;

        return {
            futureValue,
            totalInvestment,
            totalReturns
        };
    };

    const calculate = () => {
        if (investmentType === 'lumpsum') {
            if (isNaN(parseFloat(amount)) || isNaN(parseFloat(expectedReturn)) || isNaN(parseFloat(years))) {
                alert('Please enter valid numbers');
                return;
            }
        } else {
            if (isNaN(parseFloat(monthlyInvestment)) || isNaN(parseFloat(expectedReturn)) || isNaN(parseFloat(years))) {
                alert('Please enter valid numbers');
                return;
            }
        }

        const results = investmentType === 'lumpsum' ? calculateLumpsum() : calculateSIP();
        
        setResult({
            futureValue: results.futureValue.toFixed(2),
            totalInvestment: results.totalInvestment.toFixed(2),
            totalReturns: results.totalReturns.toFixed(2),
            xirr: ((results.totalReturns / results.totalInvestment) * 100 / parseFloat(years)).toFixed(2)
        });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Mutual Fund Calculator</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Investment Type</label>
                    <select
                        value={investmentType}
                        onChange={(e) => setInvestmentType(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="lumpsum">Lump Sum</option>
                        <option value="sip">SIP (Monthly)</option>
                    </select>
                </div>

                {investmentType === 'lumpsum' ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Investment Amount (₹)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter investment amount"
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Monthly Investment (₹)</label>
                        <input
                            type="number"
                            value={monthlyInvestment}
                            onChange={(e) => setMonthlyInvestment(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter monthly investment"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Expected Return Rate (% per annum)</label>
                    <input
                        type="number"
                        value={expectedReturn}
                        onChange={(e) => setExpectedReturn(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter expected return rate"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Investment Period (Years)</label>
                    <input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter investment period"
                    />
                </div>

                <button
                    onClick={calculate}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Calculate Returns
                </button>

                {result && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">Investment Returns:</h3>
                        <div className="space-y-2">
                            <p className="text-sm">Total Investment: ₹{result.totalInvestment}</p>
                            <p className="text-sm text-green-600">Total Returns: ₹{result.totalReturns}</p>
                            <p className="text-sm font-semibold">Future Value: ₹{result.futureValue}</p>
                            <p className="text-sm">Average Annual Return: {result.xirr}%</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            Note: These calculations assume a constant rate of return.
                            Actual returns may vary based on market conditions and fund performance.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MutualFundCalculator; 