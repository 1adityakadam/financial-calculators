'use client';
import { useState } from 'react';

const HRACalculator = () => {
    const [basicSalary, setBasicSalary] = useState('');
    const [hraReceived, setHraReceived] = useState('');
    const [rentPaid, setRentPaid] = useState('');
    const [cityType, setCityType] = useState('metro'); // metro or non-metro
    const [result, setResult] = useState(null);

    const calculateHRA = () => {
        const basic = parseFloat(basicSalary);
        const hra = parseFloat(hraReceived);
        const rent = parseFloat(rentPaid);

        if (isNaN(basic) || isNaN(hra) || isNaN(rent)) {
            alert('Please enter valid numbers');
            return;
        }

        // Calculate HRA exemption based on the minimum of:
        // 1. Actual HRA received
        // 2. 50% of basic salary for metro cities (40% for non-metro)
        // 3. Rent paid - 10% of basic salary

        const basicPercent = cityType === 'metro' ? 0.5 : 0.4;
        const condition1 = hra;
        const condition2 = basic * basicPercent;
        const condition3 = rent - (basic * 0.1);

        const exemption = Math.min(
            condition1,
            condition2,
            Math.max(0, condition3) // Ensure it's not negative
        );

        const taxableHRA = Math.max(0, hra - exemption);

        setResult({
            hraExemption: exemption.toFixed(2),
            taxableHRA: taxableHRA.toFixed(2),
            calculations: {
                actualHRA: condition1.toFixed(2),
                percentOfBasic: condition2.toFixed(2),
                rentLessBasic: condition3.toFixed(2)
            }
        });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">HRA Calculator</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Basic Salary (Monthly) (₹)</label>
                    <input
                        type="number"
                        value={basicSalary}
                        onChange={(e) => setBasicSalary(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter basic salary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">HRA Received (Monthly) (₹)</label>
                    <input
                        type="number"
                        value={hraReceived}
                        onChange={(e) => setHraReceived(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter HRA received"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Rent Paid (Monthly) (₹)</label>
                    <input
                        type="number"
                        value={rentPaid}
                        onChange={(e) => setRentPaid(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter rent paid"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">City Type</label>
                    <select
                        value={cityType}
                        onChange={(e) => setCityType(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="metro">Metro City (50% of Basic)</option>
                        <option value="non-metro">Non-Metro City (40% of Basic)</option>
                    </select>
                </div>

                <button
                    onClick={calculateHRA}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Calculate HRA Exemption
                </button>

                {result && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">Results:</h3>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-green-600">HRA Exemption: ₹{result.hraExemption}</p>
                            <p className="text-sm font-semibold text-red-600">Taxable HRA: ₹{result.taxableHRA}</p>
                            
                            <div className="mt-4 text-xs text-gray-600">
                                <p className="font-medium">Calculation Details:</p>
                                <p>1. Actual HRA received: ₹{result.calculations.actualHRA}</p>
                                <p>2. {cityType === 'metro' ? '50%' : '40%'} of Basic Salary: ₹{result.calculations.percentOfBasic}</p>
                                <p>3. Rent paid - 10% of Basic: ₹{result.calculations.rentLessBasic}</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            Note: HRA exemption is calculated as the minimum of the above three conditions.
                            Please consult a tax professional for detailed tax implications.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HRACalculator; 