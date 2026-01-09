/**
 * ModList Component
 * Aesthetic: Digital Craftsman's Workshop
 * Displays selected mods as a "Bill of Materials"
 */

import { useModpackStore } from '@/lib/state/store'

export function ModList() {
  const { mods, removeMod, clearMods } = useModpackStore()

  if (mods.length === 0) {
    return (
      <div className="text-center py-12 px-4" style={{
        border: '2px dashed var(--border-default)',
        borderRadius: '12px',
        background: 'var(--bg-surface)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 16px',
          borderRadius: '50%',
          background: 'var(--bg-elevated)',
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
        }}>
          <span style={{ fontSize: '32px', opacity: 0.5 }}>📝</span>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          color: 'var(--text-primary)',
          margin: '0 0 8px 0'
        }}>
          Empty List
        </h3>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '15px'
        }}>
          Search and find components to add to your bill of materials.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Components ({mods.length})
        </h2>
        <button
          onClick={clearMods}
          style={{
            fontSize: '13px',
            color: 'var(--error)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            opacity: 0.8,
            transition: 'opacity 200ms'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
          aria-label="Remove all mods"
        >
          Scrap All
        </button>
      </div>

      {/* Mod List */}
      <ul style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        margin: 0,
        padding: 0,
        listStyle: 'none'
      }} role="list" aria-label="Selected mods">
        {mods.map(({ mod, version }) => (
          <li
            key={mod.id}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              borderLeft: '3px solid var(--accent)'
            }}
          >
            {/* Icon */}
            <div style={{ flexShrink: 0 }}>
              {mod.iconUrl ? (
                <img
                  src={mod.iconUrl}
                  alt=""
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    background: 'var(--bg-elevated)'
                  }}
                  loading="lazy"
                />
              ) : (
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} />
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                margin: '0 0 2px 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {mod.name}
              </p>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                fontFamily: 'monospace',
                margin: 0
              }}>
                v{version.versionNumber}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeMod(mod.id)}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'color 200ms'
              }}
              aria-label={`Remove ${mod.name}`}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <svg
                style={{ width: '18px', height: '18px' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
