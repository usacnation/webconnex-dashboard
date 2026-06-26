import React from 'react'
import MetricsCard from './MetricsCard'
import EventsList from './EventsList'
import RevenueChart from './RevenueChart'
import RegistrationChart from './RegistrationChart'
import '../styles/Dashboard.css'

function Dashboard({ data }) {
  const { events = [], registrations = [], attendees = [], revenue = 0, loading } = data

  const totalRegistrations = registrations.length
  const totalAttendees = attendees.length

  return (
    <div className="dashboard">
      {/* KPI Cards */}
      <section className="metrics-section">
        <MetricsCard
          title="Total Events"
          value={events.length}
          icon="📅"
          loading={loading}
        />
        <MetricsCard
          title="Total Registrations"
          value={totalRegistrations}
          icon="📝"
          loading={loading}
        />
        <MetricsCard
          title="Total Attendees"
          value={totalAttendees}
          icon="👥"
          loading={loading}
        />
        <MetricsCard
          title="Total Revenue"
          value={`$${revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="💰"
          loading={loading}
        />
      </section>

      {/* Charts */}
      <section className="charts-section">
        <RevenueChart registrations={registrations} />
        <RegistrationChart registrations={registrations} />
      </section>

      {/* Events List */}
      <section className="events-section">
        <EventsList events={events} loading={loading} />
      </section>
    </div>
  )
}

export default Dashboard
