import React from 'react'
import { format } from 'date-fns'
import '../styles/EventsList.css'

function EventsList({ events, loading }) {
  return (
    <div className="events-list-container">
      <h2>Events</h2>
      {loading ? (
        <p className="loading">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="no-data">No events found</p>
      ) : (
        <div className="events-table">
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Registrations</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.name || 'Unnamed Event'}</td>
                  <td>
                    {event.date
                      ? format(new Date(event.date), 'MMM dd, yyyy')
                      : 'No date'}
                  </td>
                  <td>
                    <span className={`status ${event.status || 'unknown'}`}>
                      {event.status || 'Unknown'}
                    </span>
                  </td>
                  <td>{event.registrations || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default EventsList
