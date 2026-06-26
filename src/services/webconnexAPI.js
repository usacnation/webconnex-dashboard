// Webconnex API Service

const API_KEY = import.meta.env.VITE_WEBCONNEX_API_KEY || '36c3784827eb45799d4e54c8cedc36ce'
const BASE_URL = 'https://api.webconnex.com/v2/public'

// Demo/Mock Data (fallback)
const DEMO_DATA = {
  events: [
    { id: 1, name: 'Summer Conference 2026', date: '2026-07-15', status: 'active', registrationCount: 245 },
    { id: 2, name: 'Product Launch Event', date: '2026-08-20', status: 'upcoming', registrationCount: 189 },
    { id: 3, name: 'Annual Gala', date: '2026-09-10', status: 'upcoming', registrationCount: 312 },
    { id: 4, name: 'Networking Breakfast', date: '2026-06-30', status: 'completed', registrationCount: 87 },
    { id: 5, name: 'Workshop Series', date: '2026-07-05', status: 'active', registrationCount: 156 },
  ],
  registrations: [
    { id: 101, eventName: 'Summer Conference 2026', registrationDate: '2026-06-15', amount: 150, attendeeName: 'John Smith' },
    { id: 102, eventName: 'Summer Conference 2026', registrationDate: '2026-06-16', amount: 150, attendeeName: 'Jane Doe' },
    { id: 103, eventName: 'Product Launch Event', registrationDate: '2026-06-17', amount: 75, attendeeName: 'Bob Johnson' },
    { id: 104, eventName: 'Summer Conference 2026', registrationDate: '2026-06-18', amount: 150, attendeeName: 'Alice Williams' },
    { id: 105, eventName: 'Annual Gala', registrationDate: '2026-06-19', amount: 250, attendeeName: 'Charlie Brown' },
    { id: 106, eventName: 'Workshop Series', registrationDate: '2026-06-20', amount: 50, attendeeName: 'Diana Prince' },
    { id: 107, eventName: 'Product Launch Event', registrationDate: '2026-06-21', amount: 75, attendeeName: 'Eve Wilson' },
    { id: 108, eventName: 'Annual Gala', registrationDate: '2026-06-22', amount: 250, attendeeName: 'Frank Miller' },
    { id: 109, eventName: 'Summer Conference 2026', registrationDate: '2026-06-23', amount: 150, attendeeName: 'Grace Lee' },
    { id: 110, eventName: 'Networking Breakfast', registrationDate: '2026-06-24', amount: 30, attendeeName: 'Henry Davis' },
  ],
  attendees: [
    { id: 1, name: 'John Smith', email: 'john@example.com', event: 'Summer Conference 2026' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', event: 'Summer Conference 2026' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', event: 'Product Launch Event' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', event: 'Summer Conference 2026' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', event: 'Annual Gala' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', event: 'Workshop Series' },
    { id: 7, name: 'Eve Wilson', email: 'eve@example.com', event: 'Product Launch Event' },
    { id: 8, name: 'Frank Miller', email: 'frank@example.com', event: 'Annual Gala' },
    { id: 9, name: 'Grace Lee', email: 'grace@example.com', event: 'Summer Conference 2026' },
    { id: 10, name: 'Henry Davis', email: 'henry@example.com', event: 'Networking Breakfast' },
  ],
}

const apiClient = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'apiKey': API_KEY,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const fetchWebconnexData = async () => {
  try {
    console.log('Fetching data from Webconnex API...')
    
    // Fetch registrants from Webconnex
    const registrantsResponse = await apiClient('/search/registrants?product=redpodium.com2&pretty=true')
    
    console.log('Registrants Response:', registrantsResponse)
    
    // Transform the API response to match our dashboard format
    const registrations = registrantsResponse.results || []
    
    // Calculate metrics
    const uniqueEvents = [...new Set(registrations.map(r => r.product?.name || 'Unknown'))]
    const events = uniqueEvents.map((name, index) => {
      const eventRegistrations = registrations.filter(r => r.product?.name === name)
      return {
        id: index + 1,
        name: name,
        date: registrations[0]?.createdDate || new Date().toISOString().split('T')[0],
        status: 'active',
        registrations: eventRegistrations.length,
      }
    })
    
    const revenue = registrations.reduce((total, reg) => {
      return total + (parseFloat(reg.totalDue) || parseFloat(reg.amountPaid) || 0)
    }, 0)
    
    const attendees = registrations.map((reg, index) => ({
      id: index + 1,
      name: `${reg.firstName || ''} ${reg.lastName || ''}`.trim() || 'Unknown',
      email: reg.email || 'N/A',
      event: reg.product?.name || 'Unknown',
    }))

    return {
      events,
      registrations: registrations.map((reg, index) => ({
        id: index + 1,
        eventName: reg.product?.name || 'Unknown',
        date: reg.createdDate || new Date().toISOString().split('T')[0],
        amount: parseFloat(reg.totalDue) || parseFloat(reg.amountPaid) || 0,
        attendeeName: `${reg.firstName || ''} ${reg.lastName || ''}`.trim() || 'Unknown',
      })),
      attendees,
      revenue,
    }
  } catch (error) {
    console.error('Error fetching Webconnex data, falling back to demo data:', error)
    
    // Fallback to demo data
    const revenue = DEMO_DATA.registrations.reduce((total, reg) => {
      return total + (parseFloat(reg.amount) || 0)
    }, 0)

    return {
      events: DEMO_DATA.events,
      registrations: DEMO_DATA.registrations,
      attendees: DEMO_DATA.attendees,
      revenue,
    }
  }
}

export const getEventById = async (eventId) => {
  // This would need to be implemented based on Webconnex API
  return null
}

export const getEventRegistrations = async (eventId) => {
  // This would need to be implemented based on Webconnex API
  return []
}

export const getEventAttendees = async (eventId) => {
  // This would need to be implemented based on Webconnex API
  return []
}
