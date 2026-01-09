/**
 * SearchResults Component
 * Aesthetic: Digital Craftsman's Workshop
 * Displays search results as component cards
 */

import { useQuery } from '@tanstack/react-query'
import { useModpackStore } from '@/lib/state/store'
import * as modrinth from '@/lib/api/modrinth'
import { ModCard } from './ModCard'
import type { Mod } from '@/lib/api/types'

export function SearchResults() {
  const { searchQuery, loader, gameVersion, addMod } = useModpackStore()

  // Search Modrinth
  const modrinthQuery = useQuery({
    queryKey: ['modrinth-search', searchQuery, loader, gameVersion],
    queryFn: () => modrinth.searchMods({
      query: searchQuery,
      loader,
      gameVersion,
      limit: 20,
    }),
    enabled: searchQuery.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Handle mod selection - fetch version and add to pack
  const handleSelectMod = async (mod: Mod) => {
    try {
      const versions = await modrinth.getModVersions(mod.id, loader, gameVersion)
      if (versions.length > 0) {
        const version = versions[0] // Get latest compatible version
        addMod({
          mod,
          version,
          clientSide: version.clientSide,
          serverSide: version.serverSide,
        })
      }
    } catch (error) {
      console.error('Failed to fetch mod version:', error)
    }
  }

  // Loading state
  if (modrinthQuery.isLoading) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading search results" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card" style={{ padding: '16px', display: 'flex', gap: '16px', opacity: 0.6 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'var(--bg-elevated)' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '20px', width: '30%', background: 'var(--bg-elevated)', borderRadius: '4px' }} />
              <div style={{ height: '16px', width: '20%', background: 'var(--bg-elevated)', borderRadius: '4px' }} />
              <div style={{ height: '16px', width: '100%', background: 'var(--bg-elevated)', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
        <span className="sr-only">Searching archives...</span>
      </div>
    )
  }

  // Error state
  if (modrinthQuery.isError) {
    return (
      <div className="card" style={{ padding: '24px', textAlign: 'center', borderColor: 'var(--error)' }} role="alert">
        <div style={{
          width: '56px', height: '56px', margin: '0 auto 16px',
          borderRadius: '50%', background: 'rgba(196, 92, 74, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '28px' }}>⚠️</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
          Search Malfunction
        </h3>
        <p style={{ color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
          Unable to retrieve components from the archives.
        </p>
        <button
          onClick={() => modrinthQuery.refetch()}
          className="btn btn-secondary"
        >
          Retry Connection
        </button>
      </div>
    )
  }

  // Empty query state
  if (searchQuery.length < 2) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 16px', border: '1px dashed var(--border-default)', borderRadius: '12px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
          Component Search
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Enter at least 2 characters to search the mod archives.
        </p>
      </div>
    )
  }

  // No results
  if (modrinthQuery.data?.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 16px', border: '1px solid var(--border-default)', borderRadius: '12px', background: 'var(--bg-surface)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
          No components found
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Try a different search term or adjust your filters.
        </p>
      </div>
    )
  }

  // Results
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} role="list" aria-label="Search results">
      {modrinthQuery.data?.map((mod) => (
        <ModCard
          key={mod.id}
          mod={mod}
          onSelect={() => handleSelectMod(mod)}
        />
      ))}
    </div>
  )
}
