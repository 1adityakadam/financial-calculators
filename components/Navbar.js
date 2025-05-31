'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const calculators = [
        { name: 'SIP Calculator', path: '/?calculator=sip' },
        { name: 'FD Calculator', path: '/?calculator=fd' },
        { name: 'CAGR Calculator', path: '/?calculator=cagr' },
        { name: 'RD Calculator', path: '/?calculator=rd' },
        { name: 'Goal SIP Calculator', path: '/?calculator=goal-sip' },
        { name: 'FIRE Calculator', path: '/?calculator=fire' },
        { name: 'HRA Calculator', path: '/?calculator=hra' },
        { name: 'Mutual Fund Calculator', path: '/?calculator=mutual-fund' },
        { name: 'Tax Calculator', path: '/?calculator=tax' },
        { name: 'Loan Calculator', path: '/?calculator=loan' },
        { name: 'Mortgage Calculator', path: '/?calculator=mortgage' },
        { name: 'Compound Interest Calculator', path: '/?calculator=compound' }
    ];

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
                            Financial Calculators
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                            >
                                Calculators
                                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        {calculators.map((calculator) => (
                                            <Link
                                                key={calculator.path}
                                                href={calculator.path}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                {calculator.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 