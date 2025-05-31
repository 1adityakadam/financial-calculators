'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, Moon, Sun } from 'lucide-react';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Check system dark mode preference
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);

        // Listen for system dark mode changes
        const handleChange = (e) => {
            setIsDarkMode(e.matches);
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        darkModeMediaQuery.addEventListener('change', handleChange);
        
        // Initial dark mode setup
        if (darkModeMediaQuery.matches) {
            document.documentElement.classList.add('dark');
        }

        // Handle click outside dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            darkModeMediaQuery.removeEventListener('change', handleChange);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const calculators = [
        { name: 'Financial Assistant', path: '/' },
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
        <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-colors duration-200`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link 
                            href="/" 
                            className={`text-xl font-bold ${
                                isDarkMode 
                                    ? 'text-emerald-400 hover:text-emerald-300' 
                                    : 'text-emerald-600 hover:text-emerald-800'
                            } transition-colors duration-200`}
                        >
                            Financial Calculators
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-full ${
                                isDarkMode 
                                    ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } transition-colors duration-200`}
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                                    isDarkMode 
                                        ? 'text-gray-200 hover:bg-gray-700' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                } focus:outline-none transition-colors duration-200`}
                            >
                                Calculators
                                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                            </button>
                            
                            {isDropdownOpen && (
                                <div className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg ${
                                    isDarkMode 
                                        ? 'bg-gray-800 ring-1 ring-gray-700' 
                                        : 'bg-white ring-1 ring-black ring-opacity-5'
                                } z-50`}>
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        {calculators.map((calculator) => (
                                            <Link
                                                key={calculator.path}
                                                href={calculator.path}
                                                className={`block px-4 py-2 text-sm ${
                                                    isDarkMode 
                                                        ? 'text-gray-200 hover:bg-gray-700' 
                                                        : 'text-gray-700 hover:bg-emerald-50'
                                                } transition-colors duration-200`}
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