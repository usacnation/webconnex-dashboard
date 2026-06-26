import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import { fetchWebconnexData } from './services/webconnexAPI'
import './styles/App.css'

function App() {
  const [data, setData] = useState({
    events: [],
    registrations: [],
    attendees: [],
    revenue: 0,
    loading: true,
    error: null
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))
        const response = await fetchWebconnexData()
        setData({
          ...response,
          loading: false,
          error: null
        })
      } catch (err) {
        console.error('Error loading data:', err)
        setData(prev => ({
          ...prev,
          loading: false,
          error: err.message || 'Failed to load data'
        }))
      }
    }

    loadData()
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {data.error && (
          <div className="error-banner">
            <p>⚠️ Error: {data.error}</p>
          </div>
        )}
        <Dashboard data={data} />
      </main>
    </div>
  )
}

export default App
