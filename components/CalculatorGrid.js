'use client'
import React from 'react'
import { 
  Calculator, 
  TrendingUp, 
  PiggyBank, 
  Target, 
  Flame, 
  Home, 
  PieChart, 
  Receipt,
  DollarSign
} from 'lucide-react'

const calculators = [
  { id: 'sip', name: 'SIP Calculator', icon: Calculator, description: 'Systematic Investment Plan' },
  { id: 'fd', name: 'FD Calculator', icon: PiggyBank, description: 'Fixed Deposit Returns' },
  { id: 'cagr', name: 'CAGR Calculator', icon: TrendingUp, description: 'Compound Annual Growth Rate' },
  { id: 'rd', name: 'RD Calculator', icon: DollarSign, description: 'Recurring Deposit' },
  { id: 'goal-sip', name: 'Goal SIP Calculator', icon: Target, description: 'Goal-based SIP Planning' },
  { id: 'fire', name: 'FIRE Calculator', icon: Flame, description: 'Financial Independence' },
  { id: 'hra', name: 'HRA Calculator', icon: Home, description: 'House Rent Allowance' },
  { id: 'mutual-fund', name: 'MF Calculator', icon: PieChart, description: 'Mutual Fund Returns' },
  { id: 'tax', name: 'Tax Calculator', icon: Receipt, description: 'Income Tax Calculator' },
]

export default function CalculatorGrid({ onCalculatorSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {calculators.map((calc) => {
        const IconComponent = calc.icon
        return (
          <div
            key={calc.id}
            onClick={() => onCalculatorSelect(calc.id)}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl cursor-pointer hover:scale-105 transform transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <IconComponent className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{calc.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{calc.description}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
