/**
 * Editor Page - The modpack building interface
 * Linear/Modern design with search and mod management
 */

import { ModSearch } from '@/components/ModSearch'
import { ModList } from '@/components/ModList'
import { SearchResults } from '@/components/SearchResults'
import { ExportPanel } from '@/components/ExportPanel'

export function Editor() {
  return (
    <div className="editor">
      <header className="editor-header">
        <span className="section-label">
          <span>✏️</span>
          Editor
        </span>
        <h1 className="editor-title">Modpack Editor</h1>
        <p style={{ color: 'var(--foreground-muted)', margin: 0, fontSize: '15px' }}>
          Search for mods and build your perfect modpack.
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
          {/* Export Panel */}
          <section aria-label="Export options" className="card-static" style={{ padding: '20px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--foreground-muted)',
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Export
            </h3>
            <ExportPanel />
          </section>

          {/* Mod List */}
          <section aria-label="Selected mods" className="card-static" style={{ padding: '20px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--foreground-muted)',
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Your Pack
            </h3>
            <ModList />
          </section>
        </aside>
      </div>
    </div>
  )
}
