import React from 'react'
import '../styles/Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">📊 Webconnex Dashboard</h1>
        <div className="header-info">
          <p className="last-updated">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </header>
  )
}

export default Header
