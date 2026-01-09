/**
 * SuiteLayout - The main shell for authenticated users
 * Professional sidebar navigation with user context
 */

import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { UserButton, useAuth } from '@clerk/clerk-react'

const navItems = [
  { to: '/dashboard', label: 'My Packs', icon: '📦' },
  { to: '/editor/new', label: 'New Pack', icon: '✨' },
  { to: '/explore', label: 'Explore', icon: '🔍' },
]

export function SuiteLayout() {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Redirect to landing if not signed in
  if (isLoaded && !isSignedIn) {
    navigate('/')
    return null
  }

  return (
    <div className="suite-shell">
      {/* Sidebar */}
      <aside className={`suite-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sidebar-toggle"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
          {sidebarOpen && (
            <h1 className="suite-logo">
              <span className="logo-icon">🧵</span>
              <span className="logo-text">ModWeaver</span>
            </h1>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10'
              }
            }}
          />
          {sidebarOpen && (
            <span className="user-label">Account</span>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="suite-main">
        <Outlet />
      </main>
    </div>
  )
}
