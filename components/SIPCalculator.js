'use client'
import React, { useState, useEffect } from 'react'
import { Calculator } from 'lucide-react'
import InvestmentChart from './InvestmentChart'

export default function SIPCalculator() {
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
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value)
    }))
  }

  return (
    <div className="calculator-card max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">US Investment Calculator</h2>
      </div>

      {/* Effective Returns Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Invested Amount</div>
          <div className="text-2xl font-bold text-green-600">
            ${results.investedAmount.toLocaleString()}
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Returns Generated</div>
          <div className="text-2xl font-bold text-blue-600">
            ${results.returnsGenerated.toLocaleString()}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Total Amount</div>
          <div className="text-2xl font-bold text-purple-600">
            ${results.totalAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Method
          </label>
          <select 
            className="input-field"
            value={formData.method}
            onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
          >
            <option value="sip">Systematic Investment Plan (SIP)</option>
            <option value="lumpsum">Lump Sum Investment</option>
          </select>
        </div>

        {formData.method === 'sip' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly SIP Amount ($)
            </label>
            <input
              type="range"
              min="100"
              max="5000"
              value={formData.monthlyAmount}
              onChange={(e) => handleInputChange('monthlyAmount', e.target.value)}
              className="slider-container w-full"
            />
            <div className="text-center mt-2 font-semibold">${formData.monthlyAmount}</div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lump Sum Amount ($)
            </label>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={formData.lumpSumAmount}
              onChange={(e) => handleInputChange('lumpSumAmount', e.target.value)}
              className="slider-container w-full"
            />
            <div className="text-center mt-2 font-semibold">${formData.lumpSumAmount}</div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Return (% per year)
          </label>
          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={formData.expectedReturn}
            onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
            className="slider-container w-full"
          />
          <div className="text-center mt-2 font-semibold">{formData.expectedReturn}%</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Period (Years)
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={formData.timePeriod}
            onChange={(e) => handleInputChange('timePeriod', e.target.value)}
            className="slider-container w-full"
          />
          <div className="text-center mt-2 font-semibold">{formData.timePeriod} years</div>
        </div>
      </div>

      {/* Chart */}
      <InvestmentChart 
        data={results.chartData}
        type={formData.method === 'sip' ? 'bar' : 'area'}
        stacked={true}
        height={400}
        yAxisLabel="Amount ($)"
        series={[
          { key: 'invested', name: 'Amount Invested', color: '#10B981' },
          { key: 'returns', name: 'Returns Generated', color: '#3B82F6' }
        ]}
      />
    </div>
  )
}
