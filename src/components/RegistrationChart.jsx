import React, { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import '../styles/Chart.css'

function RegistrationChart({ registrations }) {
  const chartData = useMemo(() => {
    if (!registrations || registrations.length === 0) {
      return []
    }

    // Group registrations by event
    const eventMap = {}
    registrations.forEach((reg) => {
      const eventName = reg.eventName || 'Unknown Event'
      if (!eventMap[eventName]) {
        eventMap[eventName] = { name: eventName, count: 0, revenue: 0 }
      }
      eventMap[eventName].count += 1
      eventMap[eventName].revenue += parseFloat(reg.amount) || 0
    })

    return Object.values(eventMap).sort((a, b) => b.count - a.count).slice(0, 10)
  }, [registrations])

  return (
    <div className="chart-container">
      <h3>Registrations by Event</h3>
      {chartData.length === 0 ? (
        <p className="no-data">No registration data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Registrations" />
            <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default RegistrationChart
