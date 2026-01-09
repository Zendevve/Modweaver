/**
 * Dashboard Page - The main hub after signing in
 * Shows user's modpacks and quick actions
 */

import { Link } from 'react-router-dom'
import { useModpackStore } from '@/lib/state/store'

export function Dashboard() {
  const { config, mods } = useModpackStore()

  // For now, show current session pack + placeholder for future cloud packs
  const packs = [
    {
      id: 'current',
      name: config.name || 'Untitled Pack',
      version: config.minecraftVersion,
      loader: config.loader,
      modCount: mods.length,
      isLocal: true,
    },
  ]

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">My Modpacks</h1>
        <Link to="/editor/new" className="btn btn-primary">
          <span>✨</span> New Pack
        </Link>
      </header>

      {/* Packs Grid */}
      {packs.length === 0 ? (
        <div className="dashboard-empty">
          <div className="empty-icon">📦</div>
          <h2>No modpacks yet</h2>
          <p>Create your first modpack to get started</p>
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
              className="pack-card"
            >
              <div className="pack-icon">
                {pack.loader === 'fabric' && '🧵'}
                {pack.loader === 'forge' && '🔨'}
                {pack.loader === 'quilt' && '🪡'}
                {pack.loader === 'neoforge' && '⚡'}
              </div>
              <div className="pack-info">
                <h3 className="pack-name">{pack.name}</h3>
                <p className="pack-meta">
                  {pack.version} • {pack.loader} • {pack.modCount} mods
                </p>
              </div>
              {pack.isLocal && (
                <span className="pack-badge local">Local Session</span>
              )}
            </Link>
          ))}

          {/* Create New Card */}
          <Link to="/editor/new" className="pack-card pack-card-new">
            <div className="pack-icon">➕</div>
            <div className="pack-info">
              <h3 className="pack-name">New Modpack</h3>
              <p className="pack-meta">Start fresh</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
