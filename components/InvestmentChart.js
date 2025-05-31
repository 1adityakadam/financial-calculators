'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts'

const InvestmentChart = ({
  data,
  type = 'bar', // 'bar', 'line', or 'area'
  stacked = true,
  height = 400,
  yAxisLabel = 'Amount ($)',
  isDarkMode = false,
  series = [
    { key: 'invested', name: 'Amount Invested', color: '#10B981' },
    { key: 'returns', name: 'Returns Generated', color: '#3B82F6' }
  ]
}) => {
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`
    }
    return `$${value}`
  }

  const renderChart = () => {
    const chartProps = {
      data,
      children: [
        <CartesianGrid key="grid" strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />,
        <XAxis 
          key="xAxis" 
          dataKey="year" 
          stroke={isDarkMode ? '#9CA3AF' : '#4B5563'}
        />,
        <YAxis 
          key="yAxis" 
          tickFormatter={formatYAxis} 
          label={{ 
            value: yAxisLabel, 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: isDarkMode ? '#9CA3AF' : '#4B5563' }
          }}
          stroke={isDarkMode ? '#9CA3AF' : '#4B5563'}
        />,
        <Tooltip 
          key="tooltip"
          formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
          labelFormatter={(year) => `Year ${year}`}
          contentStyle={{
            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
            color: isDarkMode ? '#E5E7EB' : '#111827'
          }}
        />,
        <Legend 
          key="legend"
          wrapperStyle={{
            color: isDarkMode ? '#E5E7EB' : '#111827'
          }}
        />
      ]
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...chartProps}>
            {chartProps.children}
            {series.map((item, index) => (
              <Bar 
                key={item.key}
                dataKey={item.key}
                stackId={stacked ? "a" : index}
                fill={item.color}
                name={item.name}
              />
            ))}
          </BarChart>
        )

      case 'line':
        return (
          <LineChart {...chartProps}>
            {chartProps.children}
            {series.map(item => (
              <Line 
                key={item.key}
                type="monotone"
                dataKey={item.key}
                stroke={item.color}
                name={item.name}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        )

      case 'area':
        return (
          <AreaChart {...chartProps}>
            {chartProps.children}
            {series.map(item => (
              <Area
                key={item.key}
                type="monotone"
                dataKey={item.key}
                stackId={stacked ? "1" : item.key}
                stroke={item.color}
                fill={item.color}
                name={item.name}
              />
            ))}
          </AreaChart>
        )

      default:
        return null
    }
  }

  return (
    <div className="mt-8">
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        Investment Growth Over Time
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}

export default InvestmentChart 