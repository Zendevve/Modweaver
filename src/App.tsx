/**
 * ModWeaver App
 * Main application layout following Apple HIG principles
 * Two-column layout: Search (left) + Selected Mods (right)
 */

import { ModSearch } from './components/ModSearch'
import { ModList } from './components/ModList'
import { SearchResults } from './components/SearchResults'
import { ExportPanel } from './components/ExportPanel'

function App() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--color-bg-primary)]/80 backdrop-blur-lg border-b border-[var(--color-separator)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            <div>
              <h1 className="text-headline font-semibold text-[var(--color-label-primary)]">
                ModWeaver
              </h1>
              <p className="text-caption2 text-[var(--color-label-secondary)]">
                Minecraft Modpack Builder
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Column */}
          <div className="lg:col-span-2 space-y-6">
            <section aria-label="Mod search">
              <ModSearch />
            </section>

            <section aria-label="Search results">
              <SearchResults />
            </section>
          </div>

          {/* Selected Mods Column */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Export Panel */}
              <section
                aria-label="Export options"
                className="card-elevated p-4 rounded-2xl"
              >
                <ExportPanel />
              </section>

              {/* Mod List */}
              <section
                aria-label="Selected mods"
                className="card-elevated p-4 rounded-2xl"
              >
                <ModList />
              </section>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-separator)] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-caption1 text-[var(--color-label-tertiary)] text-center">
            ModWeaver is open source. Not affiliated with Mojang, CurseForge, or Modrinth.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
