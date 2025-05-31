'use client'
import React, { useState, Suspense, useEffect } from 'react'
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
import ChaseAccountLink from '../components/ChaseAccountLink'
import { useSearchParams } from 'next/navigation'

function CalculatorSelector() {
    const searchParams = useSearchParams()
    const calculator = searchParams.get('calculator')
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setIsDarkMode(darkModeMediaQuery.matches)

        const handleChange = (e) => {
            setIsDarkMode(e.matches)
        }

        darkModeMediaQuery.addEventListener('change', handleChange)
        return () => darkModeMediaQuery.removeEventListener('change', handleChange)
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
            <div className="max-w-4xl mx-auto space-y-8">
                <ChaseAccountLink isDarkMode={isDarkMode} />
                <FinanceChat />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {CalculatorComponent}
            <ChaseAccountLink isDarkMode={isDarkMode} />
        </div>
    )
}

export default function Home() {
    return (
        <main className="min-h-screen bg-emerald-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="container mx-auto py-8 px-4">
                <Suspense fallback={
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="animate-pulse">
                            <div className="h-8 bg-emerald-200 dark:bg-emerald-800 rounded w-3/4 mx-auto mb-4"></div>
                            <div className="h-4 bg-emerald-200 dark:bg-emerald-800 rounded w-1/2 mx-auto"></div>
                        </div>
                    </div>
                }>
                    <CalculatorSelector />
                </Suspense>
            </div>
        </main>
    )
}
