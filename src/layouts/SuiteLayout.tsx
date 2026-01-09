/**
 * SuiteLayout - The main shell for authenticated users
 * Professional sidebar navigation with user context
 * Works in dev mode without Clerk
 */

import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'

// Check if we have a valid Clerk key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const hasValidClerkKey = CLERK_PUBLISHABLE_KEY &&
  CLERK_PUBLISHABLE_KEY !== 'pk_test_placeholder' &&
  CLERK_PUBLISHABLE_KEY.startsWith('pk_')

const navItems = [
  { to: '/dashboard', label: 'My Packs', icon: '📦' },
  { to: '/editor/new', label: 'New Pack', icon: '✨' },
  { to: '/explore', label: 'Explore', icon: '🔍' },
]

export function SuiteLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
          {hasValidClerkKey ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10'
                }
              }}
            />
          ) : (
            <div className="dev-mode-badge">
              <span>🛠️</span>
              {sidebarOpen && <span className="user-label">Dev Mode</span>}
            </div>
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
