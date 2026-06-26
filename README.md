# Webconnex Dashboard

A real-time web-based dashboard for displaying Webconnex API data including events, attendees, registrations, and revenue.

## Features

- 📊 Real-time event metrics
- 👥 Attendee tracking and statistics
- 📝 Registration insights
- 💰 Revenue analytics
- 📈 Interactive charts and visualizations
- 🔄 Auto-refresh data

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/usacnation/webconnex-dashboard.git
cd webconnex-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file from `.env.example`
```bash
cp .env.example .env
```

4. Add your Webconnex API key to `.env`
```
VITE_WEBCONNEX_API_KEY=your_api_key_here
```

### Running the Dashboard

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm run preview
```

## API Integration

The dashboard connects to the Webconnex API to fetch:

- **Events**: List of all events with details
- **Registrations**: Registration data and ticket sales
- **Attendees**: Attendee information and statistics
- **Revenue**: Financial metrics and analytics

## Project Structure

```
.
├── index.html              # Main HTML entry point
├── src/
│   ├── App.jsx            # Main React component
│   ├── main.jsx           # React DOM render
│   ├── components/        # React components
│   ├── services/          # API services
│   ├── hooks/             # Custom React hooks
│   └── styles/            # CSS styles
├── server.js              # Express server (optional)
├── package.json           # Dependencies
└── vite.config.js         # Vite configuration
```

## Components

- **Dashboard**: Main container component
- **MetricsCard**: KPI cards showing key metrics
- **EventsList**: Table of events
- **RevenueChart**: Line chart of revenue over time
- **RegistrationChart**: Bar chart of registrations by event
- **Header**: Navigation and branding

## License

MIT
