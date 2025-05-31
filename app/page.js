'use client'
import React, { useState } from 'react'
import SIPCalculator from '../components/SIPCalculator'
import FDCalculator from '../components/FDCalculator'
import CAGRCalculator from '../components/CAGRCalculator'
import RDCalculator from '../components/RDCalculator'
import GoalSIPCalculator from '../components/GoalSIPCalculator'
import FIRECalculator from '../components/FIRECalculator'
import HRACalculator from '../components/HRACalculator'
import MutualFundCalculator from '../components/MutualFundCalculator'
import TaxCalculator from '../components/TaxCalculator'
import CalculatorGrid from '../components/CalculatorGrid'
import Chatbot from '../components/Chatbot'
import { Calculator, ArrowLeft } from 'lucide-react'
import LoanCalculator from '../components/LoanCalculator'
import MortgageCalculator from '../components/MortgageCalculator'
import CompoundInterestCalculator from '../components/CompoundInterestCalculator'

const calculators = [
  {
    id: 'loan',
    name: 'Loan Calculator',
    description: 'Calculate monthly payments and total interest for any loan',
    component: LoanCalculator
  },
  {
    id: 'mortgage',
    name: 'Mortgage Calculator',
    description: 'Calculate mortgage payments including property tax and insurance',
    component: MortgageCalculator
  },
  {
    id: 'compound',
    name: 'Compound Interest',
    description: 'See how your investments can grow with compound interest',
    component: CompoundInterestCalculator
  },
  {
    id: 'sip',
    name: 'SIP Calculator',
    description: 'Calculate returns on Systematic Investment Plans',
    component: SIPCalculator
  },
  {
    id: 'fd',
    name: 'Fixed Deposit Calculator',
    description: 'Calculate maturity amount and interest earned on Fixed Deposits',
    component: FDCalculator
  },
  {
    id: 'cagr',
    name: 'CAGR Calculator',
    description: 'Calculate Compound Annual Growth Rate of your investments',
    component: CAGRCalculator
  },
  {
    id: 'rd',
    name: 'Recurring Deposit Calculator',
    description: 'Calculate returns on Recurring Deposits',
    component: RDCalculator
  },
  {
    id: 'goal-sip',
    name: 'Goal SIP Calculator',
    description: 'Plan your SIP investments based on your financial goals',
    component: GoalSIPCalculator
  },
  {
    id: 'fire',
    name: 'FIRE Calculator',
    description: 'Plan for Financial Independence and Early Retirement',
    component: FIRECalculator
  },
  {
    id: 'hra',
    name: 'HRA Calculator',
    description: 'Calculate House Rent Allowance tax benefits',
    component: HRACalculator
  },
  {
    id: 'mutual-fund',
    name: 'Mutual Fund Calculator',
    description: 'Calculate returns on Mutual Fund investments',
    component: MutualFundCalculator
  },
  {
    id: 'tax',
    name: 'Tax Calculator',
    description: 'Calculate your income tax liability',
    component: TaxCalculator
  }
]

export default function Home() {
  const [activeCalculator, setActiveCalculator] = useState('loan')

  const ActiveCalculatorComponent = calculators.find(calc => calc.id === activeCalculator)?.component

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Financial Calculators
          </h1>
          <p className="text-lg text-gray-600">
            Make informed financial decisions with our US standard calculators
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px">
              {calculators.map((calculator) => (
                <button
                  key={calculator.id}
                  onClick={() => setActiveCalculator(calculator.id)}
                  className={`
                    flex-1 min-w-[200px] py-4 px-1 text-center border-b-2 text-sm font-medium
                    ${activeCalculator === calculator.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  <span className="block text-sm">{calculator.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {calculators.find(calc => calc.id === activeCalculator)?.name}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {calculators.find(calc => calc.id === activeCalculator)?.description}
              </p>
            </div>

            {ActiveCalculatorComponent && <ActiveCalculatorComponent />}
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>All calculations are based on US financial standards and practices.</p>
          <p className="mt-1">Dollar amounts are in USD ($)</p>
        </footer>
      </div>
    </main>
  )
}
