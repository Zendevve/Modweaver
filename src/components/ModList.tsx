/**
 * ModList Component
 * Displays selected mods with remove functionality
 * Follows Apple HIG: accessible, proper spacing, clear hierarchy
 */

import { useModpackStore } from '@/lib/state/store'

export function ModList() {
  const { mods, removeMod, clearMods } = useModpackStore()

  if (mods.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[var(--color-label-tertiary)]"
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
        <h3 className="text-headline text-[var(--color-label-primary)] mb-2">
          No mods selected
        </h3>
        <p className="text-subheadline text-[var(--color-label-secondary)]">
          Search and click mods to add them to your modpack
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-title3 font-semibold text-[var(--color-label-primary)]">
          Selected Mods ({mods.length})
        </h2>
        <button
          onClick={clearMods}
          className="text-subheadline text-[var(--color-error)] hover:underline touch-target flex items-center justify-center"
          aria-label="Remove all mods"
        >
          Clear All
        </button>
      </div>

      {/* Mod List */}
      <ul className="space-y-2" role="list" aria-label="Selected mods">
        {mods.map(({ mod, version }) => (
          <li
            key={mod.id}
            className="card flex items-center gap-3 p-3"
          >
            {/* Icon */}
            {mod.iconUrl ? (
              <img
                src={mod.iconUrl}
                alt=""
                className="w-10 h-10 rounded-lg object-cover bg-[var(--color-bg-secondary)]"
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-secondary)]" />
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-body font-medium text-[var(--color-label-primary)] truncate">
                {mod.name}
              </p>
              <p className="text-caption1 text-[var(--color-label-secondary)]">
                {version.versionNumber}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeMod(mod.id)}
              className="touch-target flex items-center justify-center text-[var(--color-label-tertiary)] hover:text-[var(--color-error)] transition-colors"
              aria-label={`Remove ${mod.name}`}
            >
              <svg
                className="w-5 h-5"
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
