/**
 * ModSearch Component
 * Linear/Modern design - clean inputs with proper tokens
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <label htmlFor="mod-search" className="sr-only">
          Search mods
        </label>
        <div style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}>
          <svg
            style={{ width: '18px', height: '18px', color: 'var(--foreground-subtle)' }}
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
          placeholder="Search mods across Modrinth & CurseForge..."
          value={localQuery}
          onChange={handleQueryChange}
          className="input"
          style={{
            width: '100%',
            paddingLeft: '48px',
            fontSize: '15px'
          }}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {/* Loader Select */}
        <div style={{ flex: 1, minWidth: '140px' }}>
          <label htmlFor="loader-select" className="sr-only">
            Mod Loader
          </label>
          <select
            id="loader-select"
            value={loader}
            onChange={(e) => setLoader(e.target.value as typeof loader)}
            className="input"
            style={{
              width: '100%',
              appearance: 'none',
              cursor: 'pointer',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238A8F98' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              paddingRight: '40px'
            }}
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
        <div style={{ flex: 1, minWidth: '140px' }}>
          <label htmlFor="version-select" className="sr-only">
            Minecraft Version
          </label>
          <select
            id="version-select"
            value={gameVersion}
            onChange={(e) => setGameVersion(e.target.value)}
            className="input"
            style={{
              width: '100%',
              appearance: 'none',
              cursor: 'pointer',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238A8F98' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              paddingRight: '40px'
            }}
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
