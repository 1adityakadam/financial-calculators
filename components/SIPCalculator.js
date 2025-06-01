'use client'
import React, { useState, useEffect } from 'react'
import { Calculator } from 'lucide-react'
import InvestmentChart from './InvestmentChart'

export default function SIPCalculator({ isDarkMode }) {
  const [formData, setFormData] = useState({
    method: 'sip',
    monthlyAmount: 500,
    lumpSumAmount: 10000,
    expectedReturn: 10,
    timePeriod: 10
  })
  
  const [results, setResults] = useState({
    investedAmount: 0,
    returnsGenerated: 0,
    totalAmount: 0,
    chartData: []
  })

  const calculateInvestment = () => {
    const { method, monthlyAmount, lumpSumAmount, expectedReturn, timePeriod } = formData
    const monthlyRate = expectedReturn / 100 / 12
    const totalMonths = timePeriod * 12

    let futureValue, investedAmount, chartData = []

    if (method === 'sip') {
      // SIP Formula: FV = P * {[(1 + r)^n - 1] / r} * (1 + r)
      futureValue = monthlyAmount * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate))
      investedAmount = monthlyAmount * totalMonths

      // Generate year-wise data for SIP
      for (let year = 1; year <= timePeriod; year++) {
        const monthsCompleted = year * 12
        const yearlyInvested = monthlyAmount * monthsCompleted
        const yearlyFV = monthlyAmount * (((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) * (1 + monthlyRate))
        
        chartData.push({
          year,
          invested: Math.round(yearlyInvested),
          returns: Math.round(yearlyFV - yearlyInvested),
          total: Math.round(yearlyFV)
        })
      }
    } else {
      // Lump Sum Formula: FV = P * (1 + r)^t
      const annualRate = expectedReturn / 100
      futureValue = lumpSumAmount * Math.pow(1 + annualRate, timePeriod)
      investedAmount = lumpSumAmount

      // Generate year-wise data for Lump Sum
      for (let year = 1; year <= timePeriod; year++) {
        const yearlyFV = lumpSumAmount * Math.pow(1 + annualRate, year)
        
        chartData.push({
          year,
          invested: Math.round(lumpSumAmount),
          returns: Math.round(yearlyFV - lumpSumAmount),
          total: Math.round(yearlyFV)
        })
      }
    }

    const returnsGenerated = futureValue - investedAmount
    
    setResults({
      investedAmount: Math.round(investedAmount),
      returnsGenerated: Math.round(returnsGenerated),
      totalAmount: Math.round(futureValue),
      chartData
    })
  }

  useEffect(() => {
    calculateInvestment()
  }, [formData])

  const handleInputChange = (field, value) => {
    let parsedValue = parseFloat(value)
    
    // Input validation
    switch (field) {
      case 'monthlyAmount':
        parsedValue = Math.min(Math.max(parsedValue, 100), 5000)
        break
      case 'lumpSumAmount':
        parsedValue = Math.min(Math.max(parsedValue, 1000), 100000)
        break
      case 'expectedReturn':
        parsedValue = Math.min(Math.max(parsedValue, 1), 20)
        break
      case 'timePeriod':
        parsedValue = Math.min(Math.max(parsedValue, 1), 30)
        break
    }

    if (!isNaN(parsedValue)) {
      setFormData(prev => ({
        ...prev,
        [field]: parsedValue
      }))
    }
  }

  return (
    <div className={`calculator-card max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-200`}>
      <div className="flex items-center gap-3 mb-6">
        <Calculator className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} size={28} />
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Systematic Investment Plan (SIP) Calculator</h2>
      </div>

      {/* Effective Returns Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Invested Amount</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ${results.investedAmount.toLocaleString()}
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Returns Generated</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ${results.returnsGenerated.toLocaleString()}
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'} p-4 rounded-lg text-center transition-colors duration-200`}>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Total Amount</div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ${results.totalAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
            Investment Method
          </label>
          <select 
            className={`w-full p-2 border rounded-md ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-700'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200`}
            value={formData.method}
            onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
          >
            <option value="sip">Systematic Investment Plan (SIP)</option>
            <option value="lumpsum">Lump Sum Investment</option>
          </select>
        </div>

        {formData.method === 'sip' ? (
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
              Monthly SIP Amount ($)
            </label>
            <input
              type="number"
              min="100"
              max="5000"
              value={formData.monthlyAmount}
              onChange={(e) => handleInputChange('monthlyAmount', e.target.value)}
              className={`w-full p-2 border rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200`}
              placeholder="Enter amount between $100-$5000"
            />
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Min: $100 | Max: $5,000</div>
          </div>
        ) : (
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
              Lump Sum Amount ($)
            </label>
            <input
              type="number"
              min="1000"
              max="100000"
              step="1000"
              value={formData.lumpSumAmount}
              onChange={(e) => handleInputChange('lumpSumAmount', e.target.value)}
              className={`w-full p-2 border rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200`}
              placeholder="Enter amount between $1,000-$100,000"
            />
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Min: $1,000 | Max: $100,000</div>
          </div>
        )}

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
            Expected Return (% per year)
          </label>
          <input
            type="number"
            min="1"
            max="20"
            step="0.5"
            value={formData.expectedReturn}
            onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
            className={`w-full p-2 border rounded-md ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-700'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200`}
            placeholder="Enter return between 1-20%"
          />
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Min: 1% | Max: 20%</div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
            Time Period (Years)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={formData.timePeriod}
            onChange={(e) => handleInputChange('timePeriod', e.target.value)}
            className={`w-full p-2 border rounded-md ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-700'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200`}
            placeholder="Enter years between 1-30"
          />
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Min: 1 year | Max: 30 years</div>
        </div>
      </div>

      {/* Chart */}
      <InvestmentChart 
        data={results.chartData}
        type={formData.method === 'sip' ? 'bar' : 'area'}
        stacked={true}
        height={400}
        yAxisLabel="Amount ($)"
        isDarkMode={isDarkMode}
        series={[
          { key: 'invested', name: 'Amount Invested', color: isDarkMode ? '#34D399' : '#10B981' },
          { key: 'returns', name: 'Returns Generated', color: isDarkMode ? '#60A5FA' : '#3B82F6' }
        ]}
      />
    </div>
  )
}
