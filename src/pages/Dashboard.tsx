/**
 * Dashboard Page - The main hub after signing in
 * Linear/Modern design with pack cards grid
 */

import { Link } from 'react-router-dom'
import { useModpackStore } from '@/lib/state/store'

export function Dashboard() {
  const { config, mods } = useModpackStore()

  // For now, show current session pack + placeholder for future cloud packs
  const packs = [
    {
      id: 'current',
      name: config.name || 'My First Pack',
      version: config.minecraftVersion,
      loader: config.loader,
      modCount: mods.length,
      isLocal: true,
    },
  ]

  const loaderEmoji: Record<string, string> = {
    fabric: '🧵',
    forge: '🔨',
    quilt: '🪡',
    neoforge: '⚡',
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <span className="section-label">
            <span>📦</span>
            Modpacks
          </span>
          <h1 className="dashboard-title">My Modpacks</h1>
        </div>
        <Link to="/editor/new" className="btn btn-primary">
          <span>✨</span> New Pack
        </Link>
      </header>

      {/* Packs Grid */}
      {packs.length === 0 && mods.length === 0 ? (
        <div className="dashboard-empty">
          <div className="empty-icon">📦</div>
          <h2>No modpacks yet</h2>
          <p>Create your first modpack to get started building something amazing.</p>
          <Link to="/editor/new" className="btn btn-primary btn-lg">
            Create Your First Pack
          </Link>
        </div>
      ) : (
        <div className="packs-grid">
          {packs.map((pack) => (
            <Link
              key={pack.id}
              to={pack.id === 'current' ? '/editor' : `/editor/${pack.id}`}
              className="pack-card card"
            >
              <div className="pack-icon">
                {loaderEmoji[pack.loader] || '📦'}
              </div>
              <div className="pack-info">
                <h3 className="pack-name">{pack.name}</h3>
                <p className="pack-meta">
                  {pack.version} • {pack.loader} • {pack.modCount} mod{pack.modCount !== 1 ? 's' : ''}
                </p>
              </div>
              {pack.isLocal && (
                <span className="pack-badge">Local</span>
              )}
            </Link>
          ))}

          {/* Create New Card */}
          <Link to="/editor/new" className="pack-card pack-card-new">
            <div className="pack-icon" style={{ background: 'transparent', border: 'none' }}>
              ➕
            </div>
            <div className="pack-info">
              <h3 className="pack-name">New Modpack</h3>
              <p className="pack-meta">Start fresh with a new project</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
