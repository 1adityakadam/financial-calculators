'use client'
import React from 'react'
import { AreaChart, BarChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const InvestmentChart = ({ data, type = 'bar', stacked = true, height = 400, yAxisLabel, isDarkMode = false, series = [] }) => {
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value}`
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <p className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Year {label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {entry.name}: ${entry.value.toLocaleString()}
              </span>
            </div>
          ))}
          <div className={`mt-2 pt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Total: ${payload.reduce((sum, entry) => sum + entry.value, 0).toLocaleString()}
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  const chartProps = {
    data,
    margin: { top: 10, right: 30, left: 60, bottom: 30 },
    height,
  }

  return (
    <div className={`w-full ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <ResponsiveContainer width="100%" height={height}>
        {type === 'bar' ? (
          <BarChart {...chartProps}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={isDarkMode ? '#374151' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="year" 
              stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
              tickLine={{ stroke: isDarkMode ? '#4B5563' : '#D1D5DB' }}
              label={{ 
                value: 'Years', 
                position: 'bottom', 
                offset: 20,
                fill: isDarkMode ? '#9CA3AF' : '#6B7280'
              }}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
              tickLine={{ stroke: isDarkMode ? '#4B5563' : '#D1D5DB' }}
              label={{ 
                value: yAxisLabel, 
                angle: -90, 
                position: 'left', 
                offset: 40,
                fill: isDarkMode ? '#9CA3AF' : '#6B7280'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                color: isDarkMode ? '#9CA3AF' : '#6B7280'
              }}
            />
            {series.map((s, index) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.name}
                fill={s.color}
                stackId={stacked ? 'stack' : index}
              />
            ))}
          </BarChart>
        ) : (
          <AreaChart {...chartProps}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={isDarkMode ? '#374151' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="year" 
              stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
              tickLine={{ stroke: isDarkMode ? '#4B5563' : '#D1D5DB' }}
              label={{ 
                value: 'Years', 
                position: 'bottom', 
                offset: 20,
                fill: isDarkMode ? '#9CA3AF' : '#6B7280'
              }}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
              tickLine={{ stroke: isDarkMode ? '#4B5563' : '#D1D5DB' }}
              label={{ 
                value: yAxisLabel, 
                angle: -90, 
                position: 'left', 
                offset: 40,
                fill: isDarkMode ? '#9CA3AF' : '#6B7280'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                color: isDarkMode ? '#9CA3AF' : '#6B7280'
              }}
            />
            {series.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                fill={s.color}
                stroke={s.color}
                fillOpacity={0.3}
                stackId={stacked ? 'stack' : undefined}
              />
            ))}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default InvestmentChart 