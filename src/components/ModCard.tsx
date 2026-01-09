/**
 * ModCard Component
 * Displays a single mod with add/remove functionality
 * Follows Apple HIG: 44pt touch targets, proper contrast, accessible
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
      className={`
        card flex gap-4 p-4 cursor-pointer transition-all duration-150
        hover:bg-[var(--color-bg-secondary)]
        ${isSelected ? 'ring-2 ring-[var(--color-accent)]' : ''}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-pressed={isSelected}
      aria-label={`${mod.name} by ${mod.author}. ${isSelected ? 'Remove from' : 'Add to'} modpack`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {mod.iconUrl ? (
          <img
            src={mod.iconUrl}
            alt=""
            className="w-12 h-12 rounded-lg object-cover bg-[var(--color-bg-secondary)]"
            loading="lazy"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-[var(--color-bg-secondary)] flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[var(--color-label-tertiary)]"
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
      <div className="flex-1 min-w-0">
        <h3 className="text-headline font-semibold text-[var(--color-label-primary)] truncate">
          {mod.name}
        </h3>
        <p className="text-caption1 text-[var(--color-label-secondary)] mb-1">
          by {mod.author}
        </p>
        <p className="text-subheadline text-[var(--color-label-secondary)] line-clamp-2">
          {mod.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-2 text-caption1 text-[var(--color-label-tertiary)]">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {formatDownloads(mod.downloads)}
          </span>
          <span className="capitalize px-2 py-0.5 rounded bg-[var(--color-bg-secondary)]">
            {mod.source}
          </span>
          {mod.loaders.slice(0, 2).map(loader => (
            <span
              key={loader}
              className="capitalize px-2 py-0.5 rounded bg-[var(--color-bg-secondary)]"
            >
              {loader}
            </span>
          ))}
        </div>
      </div>

      {/* Action indicator */}
      <div className="flex-shrink-0 flex items-center">
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${isSelected
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-[var(--color-bg-secondary)] text-[var(--color-label-secondary)]'
            }
          `}
          aria-hidden="true"
        >
          {isSelected ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </div>
      </div>
    </article>
  )
}
