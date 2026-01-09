/**
 * Editor Page - The modpack building interface
 * Moved from App.tsx to be a dedicated page within the Suite
 */

import { ModSearch } from '@/components/ModSearch'
import { ModList } from '@/components/ModList'
import { SearchResults } from '@/components/SearchResults'
import { ExportPanel } from '@/components/ExportPanel'

export function Editor() {
  return (
    <div className="editor">
      <header className="editor-header">
        <h1 className="editor-title">Modpack Editor</h1>
        <p className="text-[var(--color-label-secondary)]">
          Search and add mods to your pack
        </p>
      </header>

      <div className="editor-content">
        {/* Search Column */}
        <div className="editor-search">
          <section aria-label="Mod search">
            <ModSearch />
          </section>

          <section aria-label="Search results">
            <SearchResults />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="editor-sidebar">
          <div className="sticky top-6 space-y-4">
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
    </div>
  )
}
