/**
 * ModSearch Component
 * Search input with loader and version filters
 * Follows Apple HIG: 44pt touch targets, proper spacing, accessible
 */

import { useCallback, useState, useEffect } from 'react'
import { useModpackStore, MINECRAFT_VERSIONS, MOD_LOADERS } from '@/lib/state/store'

export function ModSearch() {
  const {
    searchQuery,
    setSearchQuery,
    gameVersion,
    setGameVersion,
    loader,
    setLoader
  } = useModpackStore()

  // Local state for debouncing
  const [localQuery, setLocalQuery] = useState(searchQuery)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [localQuery, setSearchQuery])

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value)
  }, [])

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <label htmlFor="mod-search" className="sr-only">
          Search mods
        </label>
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-[var(--color-label-tertiary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          id="mod-search"
          type="search"
          placeholder="Search mods..."
          value={localQuery}
          onChange={handleQueryChange}
          className="input w-full pl-12 pr-4"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Loader Select */}
        <div className="flex-1 min-w-[140px]">
          <label htmlFor="loader-select" className="sr-only">
            Mod Loader
          </label>
          <select
            id="loader-select"
            value={loader}
            onChange={(e) => setLoader(e.target.value as typeof loader)}
            className="input w-full appearance-none cursor-pointer"
            aria-label="Select mod loader"
          >
            {MOD_LOADERS.map((l) => (
              <option key={l} value={l}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Version Select */}
        <div className="flex-1 min-w-[140px]">
          <label htmlFor="version-select" className="sr-only">
            Minecraft Version
          </label>
          <select
            id="version-select"
            value={gameVersion}
            onChange={(e) => setGameVersion(e.target.value)}
            className="input w-full appearance-none cursor-pointer"
            aria-label="Select Minecraft version"
          >
            {MINECRAFT_VERSIONS.map((v) => (
              <option key={v} value={v}>
                Minecraft {v}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
