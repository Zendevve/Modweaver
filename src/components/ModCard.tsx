/**
 * ModCard Component
 * Linear/Modern design - horizontal card with clean action button
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
        padding: '16px',
        cursor: 'pointer',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        ...(isSelected ? {
          borderColor: 'var(--accent)',
          boxShadow: 'var(--shadow-card-hover)'
        } : {})
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-pressed={isSelected}
      aria-label={`${mod.name} by ${mod.author}. ${isSelected ? 'Remove from' : 'Add to'} modpack`}
    >
      {/* Icon */}
      <div style={{ flexShrink: 0 }}>
        {mod.iconUrl ? (
          <img
            src={mod.iconUrl}
            alt=""
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              objectFit: 'cover',
              background: 'var(--background-elevated)'
            }}
            loading="lazy"
          />
        ) : (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: 'var(--background-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg
              style={{ width: '24px', height: '24px', color: 'var(--foreground-subtle)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--foreground)',
          margin: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {mod.name}
        </h3>
        <p style={{
          fontSize: '13px',
          color: 'var(--foreground-muted)',
          margin: '2px 0 6px 0'
        }}>
          by {mod.author}
        </p>
        <p style={{
          fontSize: '14px',
          color: 'var(--foreground-muted)',
          margin: 0,
          lineHeight: 1.5,
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
          gap: '8px',
          marginTop: '10px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--foreground-subtle)'
          }}>
            <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {formatDownloads(mod.downloads)}
          </span>
          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            padding: '3px 8px',
            borderRadius: '4px',
            background: mod.source === 'modrinth' ? 'rgba(30, 200, 100, 0.15)' : 'rgba(246, 130, 52, 0.15)',
            color: mod.source === 'modrinth' ? '#1ec864' : '#f68234'
          }}>
            {mod.source}
          </span>
          {mod.loaders.slice(0, 2).map(loader => (
            <span
              key={loader}
              style={{
                fontSize: '11px',
                textTransform: 'capitalize',
                padding: '3px 8px',
                borderRadius: '4px',
                background: 'var(--background-surface)',
                color: 'var(--foreground-muted)'
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
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isSelected ? 'var(--accent)' : 'var(--background-surface)',
            color: isSelected ? 'white' : 'var(--foreground-muted)',
            border: isSelected ? 'none' : '1px solid var(--border-default)',
            transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          aria-hidden="true"
        >
          {isSelected ? (
            <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </div>
      </div>
    </article>
  )
}
