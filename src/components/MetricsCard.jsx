import React from 'react'
import '../styles/MetricsCard.css'

function MetricsCard({ title, value, icon, loading }) {
  return (
    <div className="metrics-card">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{loading ? '...' : value}</p>
      </div>
    </div>
  )
}

export default MetricsCard
