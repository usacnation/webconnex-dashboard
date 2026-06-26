import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import '../styles/Chart.css'

function RevenueChart({ registrations }) {
  const chartData = useMemo(() => {
    if (!registrations || registrations.length === 0) {
      return []
    }

    // Group registrations by date and calculate cumulative revenue
    const dataMap = {}
    let cumulativeRevenue = 0

    registrations.forEach((reg) => {
      const date = reg.date ? new Date(reg.date).toLocaleDateString() : 'Unknown'
      const amount = parseFloat(reg.amount) || 0
      cumulativeRevenue += amount

      if (!dataMap[date]) {
        dataMap[date] = { date, revenue: 0, cumulative: 0 }
      }
      dataMap[date].revenue += amount
      dataMap[date].cumulative = cumulativeRevenue
    })

    return Object.values(dataMap).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [registrations])

  return (
    <div className="chart-container">
      <h3>Revenue Over Time</h3>
      {chartData.length === 0 ? (
        <p className="no-data">No revenue data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              name="Daily Revenue"
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#82ca9d"
              name="Cumulative Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default RevenueChart
