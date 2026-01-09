/**
 * Dashboard Page - The main hub after signing in
 * Aesthetic: Digital Craftsman's Workshop
 */

import { Link } from 'react-router-dom'
import { useModpackStore } from '@/lib/state/store'

export function Dashboard() {
  const { config, mods } = useModpackStore()

  // For now, show current session pack + placeholder for future cloud packs
  const packs = [
    {
      id: 'current',
      name: config.name || 'Untitled Project',
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
            <span>🗄️</span>
            Archive
          </span>
          <h1 className="dashboard-title">My Blueprints</h1>
        </div>
        <Link to="/editor/new" className="btn btn-primary">
          <span>✨</span> New Project
        </Link>
      </header>

      {/* Packs Grid */}
      {packs.length === 0 && mods.length === 0 ? (
        <div className="dashboard-empty card">
          <div className="empty-icon">📜</div>
          <h2>The Archive is Empty</h2>
          <p>Draft your first blueprint to begin your journey.</p>
          <Link to="/editor/new" className="btn btn-primary btn-lg">
            Draft New Blueprint
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
                  {pack.version} • {pack.loader} • {pack.modCount} component{pack.modCount !== 1 ? 's' : ''}
                </p>
              </div>
              {pack.isLocal && (
                <span className="pack-badge">Draft</span>
              )}
            </Link>
          ))}

          {/* Create New Card */}
          <Link to="/editor/new" className="pack-card pack-card-new">
            <div className="pack-icon" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
              ➕
            </div>
            <div className="pack-info">
              <h3 className="pack-name" style={{ color: 'var(--text-muted)' }}>New Blueprint</h3>
              <p className="pack-meta">Start a fresh design</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
