/**
 * ModCard Component
 * Aesthetic: Digital Craftsman's Workshop
 * Looks like a recipe card or schematic
 */

import type { Mod } from '@/lib/api/types'
import { useModpackStore } from '@/lib/state/store'

interface ModCardProps {
  mod: Mod
  version?: { id: string; versionNumber: string } | null
  onSelect?: () => void
}

export function ModCard({ mod, onSelect }: ModCardProps) {
  const { hasMod, removeMod } = useModpackStore()
  const isSelected = hasMod(mod.id)

  // Format download count
  const formatDownloads = (count: number): string => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
    return String(count)
  }

  const handleClick = () => {
    if (isSelected) {
      removeMod(mod.id)
    } else if (onSelect) {
      onSelect()
    }
  }

  return (
    <article
      className="card"
      style={{
        padding: '18px',
        cursor: 'pointer',
        display: 'flex',
        gap: '18px',
        alignItems: 'flex-start',
        border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-default)',
        background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
        ...(isSelected ? {
          boxShadow: 'var(--shadow-md)'
        } : {})
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-pressed={isSelected}
      aria-label={`${mod.name} by ${mod.author}. ${isSelected ? 'Remove from' : 'Add to'} blueprint`}
    >
      {/* Icon */}
      <div style={{ flexShrink: 0 }}>
        {mod.iconUrl ? (
          <img
            src={mod.iconUrl}
            alt=""
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              objectFit: 'cover',
              background: 'var(--bg-elevated)',
              boxShadow: 'var(--shadow-sm)'
            }}
            loading="lazy"
          />
        ) : (
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-default)'
          }}>
            <svg
              style={{ width: '28px', height: '28px', color: 'var(--text-muted)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: '0 0 4px 0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {mod.name}
        </h3>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          margin: '0 0 8px 0',
          fontStyle: 'italic'
        }}>
          by <span style={{ color: 'var(--text-primary)' }}>{mod.author}</span>
        </p>
        <p style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {mod.description}
        </p>

        {/* Meta */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '12px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--text-muted)',
            fontFamily: 'monospace'
          }}>
            <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {formatDownloads(mod.downloads)}
          </span>
          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '4px 10px',
            borderRadius: '6px',
            background: mod.source === 'modrinth' ? 'rgba(124, 179, 107, 0.15)' : 'rgba(212, 160, 86, 0.15)',
            color: mod.source === 'modrinth' ? '#7cb36b' : '#d4a056',
            fontWeight: 600
          }}>
            {mod.source}
          </span>
          {mod.loaders.slice(0, 2).map(loader => (
            <span
              key={loader}
              style={{
                fontSize: '12px',
                textTransform: 'capitalize',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)'
              }}
            >
              {loader}
            </span>
          ))}
        </div>
      </div>

      {/* Action indicator */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isSelected ? 'var(--accent)' : 'transparent',
            color: isSelected ? 'var(--bg-deep)' : 'var(--text-muted)',
            border: isSelected ? 'none' : '1px solid var(--border-default)',
            transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          aria-hidden="true"
        >
          {isSelected ? (
            <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </div>
      </div>
    </article>
  )
}
