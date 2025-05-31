'use client'
import React, { useState, useEffect, Suspense } from 'react'
import SIPCalculator from '../components/SIPCalculator'
import FDCalculator from '../components/FDCalculator'
import CAGRCalculator from '../components/CAGRCalculator'
import RDCalculator from '../components/RDCalculator'
import GoalSIPCalculator from '../components/GoalSIPCalculator'
import FIRECalculator from '../components/FIRECalculator'
import HRACalculator from '../components/HRACalculator'
import MutualFundCalculator from '../components/MutualFundCalculator'
import TaxCalculator from '../components/TaxCalculator'
import LoanCalculator from '../components/LoanCalculator'
import MortgageCalculator from '../components/MortgageCalculator'
import CompoundInterestCalculator from '../components/CompoundInterestCalculator'
import FinanceChat from '../components/FinanceChat'
import { useSearchParams } from 'next/navigation'

function CalculatorSelector() {
    const searchParams = useSearchParams()
    const calculator = searchParams.get('calculator')
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        // Check system theme preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true)
        }

        // Listen for theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = (e) => setIsDarkMode(e.matches)
        mediaQuery.addListener(handleChange)

        return () => mediaQuery.removeListener(handleChange)
    }, [])

    const getCalculatorComponent = () => {
        switch(calculator) {
            case 'sip':
                return <SIPCalculator />
            case 'fd':
                return <FDCalculator />
            case 'cagr':
                return <CAGRCalculator />
            case 'rd':
                return <RDCalculator />
            case 'goal-sip':
                return <GoalSIPCalculator />
            case 'fire':
                return <FIRECalculator />
            case 'hra':
                return <HRACalculator />
            case 'mutual-fund':
                return <MutualFundCalculator />
            case 'tax':
                return <TaxCalculator />
            case 'loan':
                return <LoanCalculator />
            case 'mortgage':
                return <MortgageCalculator />
            case 'compound':
                return <CompoundInterestCalculator />
            default:
                return null
        }
    }

    const CalculatorComponent = getCalculatorComponent()

    if (!calculator) {
        return (
            <div className="max-w-4xl mx-auto">
                <FinanceChat isDarkMode={isDarkMode} />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            {React.cloneElement(CalculatorComponent, { isDarkMode })}
        </div>
    )
}

export default function Home() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        // Check system theme preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true)
        }

        // Listen for theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = (e) => setIsDarkMode(e.matches)
        mediaQuery.addListener(handleChange)

        return () => mediaQuery.removeListener(handleChange)
    }, [])

    return (
        <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-emerald-50'} transition-colors duration-200`}>
            <div className="container mx-auto py-8 px-4">
                <Suspense fallback={
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="animate-pulse">
                            <div className={`h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-emerald-200'} rounded w-3/4 mx-auto mb-4`}></div>
                            <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-emerald-200'} rounded w-1/2 mx-auto`}></div>
                        </div>
                    </div>
                }>
                    <CalculatorSelector />
                </Suspense>
            </div>
        </main>
    )
}
