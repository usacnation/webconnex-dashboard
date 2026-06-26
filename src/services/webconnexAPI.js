// Webconnex API Service
// This service handles all communication with the Webconnex API

const API_KEY = import.meta.env.VITE_WEBCONNEX_API_KEY || '36c3784827eb45799d4e54c8cedc36ce'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.webconnex.com/v3'

const apiClient = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const fetchWebconnexData = async () => {
  try {
    // Fetch events
    const eventsResponse = await apiClient('/events')
    const events = Array.isArray(eventsResponse) ? eventsResponse : eventsResponse.data || []

    // Fetch registrations
    const registrationsResponse = await apiClient('/registrations')
    const registrations = Array.isArray(registrationsResponse) ? registrationsResponse : registrationsResponse.data || []

    // Fetch attendees
    const attendeesResponse = await apiClient('/attendees')
    const attendees = Array.isArray(attendeesResponse) ? attendeesResponse : attendeesResponse.data || []

    // Calculate revenue
    const revenue = registrations.reduce((total, reg) => {
      return total + (parseFloat(reg.amount) || 0)
    }, 0)

    return {
      events: events.map(event => ({
        id: event.id,
        name: event.name,
        date: event.date,
        status: event.status,
        registrations: event.registrationCount || 0,
      })),
      registrations: registrations.map(reg => ({
        id: reg.id,
        eventName: reg.eventName,
        date: reg.registrationDate,
        amount: reg.amount,
        attendeeName: reg.attendeeName,
      })),
      attendees: attendees.map(attendee => ({
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        event: attendee.event,
      })),
      revenue,
    }
  } catch (error) {
    console.error('Error fetching Webconnex data:', error)
    throw error
  }
}

// Additional API methods for specific data
export const getEventById = async (eventId) => {
  return apiClient(`/events/${eventId}`)
}

export const getEventRegistrations = async (eventId) => {
  return apiClient(`/events/${eventId}/registrations`)
}

export const getEventAttendees = async (eventId) => {
  return apiClient(`/events/${eventId}/attendees`)
}
