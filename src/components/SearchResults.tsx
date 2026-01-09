/**
 * SearchResults Component
 * Displays search results from Modrinth and CurseForge
 * Uses React Query for data fetching with caching
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

  // TODO: Add CurseForge search when API key is configured
  // const curseforgeQuery = useQuery({...})

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
      <div className="space-y-3" role="status" aria-label="Loading search results">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-bg-tertiary)]" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-1/3 rounded bg-[var(--color-bg-tertiary)]" />
                <div className="h-4 w-1/4 rounded bg-[var(--color-bg-tertiary)]" />
                <div className="h-4 w-full rounded bg-[var(--color-bg-tertiary)]" />
              </div>
            </div>
          </div>
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  // Error state
  if (modrinthQuery.isError) {
    return (
      <div className="card p-6 text-center" role="alert">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--color-error)]/10 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-[var(--color-error)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-headline text-[var(--color-label-primary)] mb-2">
          Search failed
        </h3>
        <p className="text-subheadline text-[var(--color-label-secondary)]">
          Unable to fetch mods. Please try again.
        </p>
        <button
          onClick={() => modrinthQuery.refetch()}
          className="btn btn-secondary mt-4"
        >
          Retry
        </button>
      </div>
    )
  }

  // Empty query state
  if (searchQuery.length < 2) {
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-headline text-[var(--color-label-primary)] mb-2">
          Search for mods
        </h3>
        <p className="text-subheadline text-[var(--color-label-secondary)]">
          Enter at least 2 characters to search
        </p>
      </div>
    )
  }

  // No results
  if (modrinthQuery.data?.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <h3 className="text-headline text-[var(--color-label-primary)] mb-2">
          No mods found
        </h3>
        <p className="text-subheadline text-[var(--color-label-secondary)]">
          Try a different search term or adjust your filters
        </p>
      </div>
    )
  }

  // Results
  return (
    <div className="space-y-3" role="list" aria-label="Search results">
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
