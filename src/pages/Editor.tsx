/**
 * Editor Page - The modpack building interface
 * Aesthetic: Digital Craftsman's Workshop
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
          <span>⚒️</span>
          Workbench
        </span>
        <h1 className="editor-title">Project Workspace</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '16px' }}>
          Assemble the components for your masterpiece.
        </p>
      </header>

      <div className="editor-content">
        {/* Search Column */}
        <div className="editor-search">
          <section aria-label="Component search">
            <ModSearch />
          </section>

          <section aria-label="Available components">
            <SearchResults />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="editor-sidebar">
          {/* Export Panel */}
          <section aria-label="Export options" className="card-static" style={{ padding: '24px' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              margin: '0 0 20px 0',
              borderBottom: '1px solid var(--border-default)',
              paddingBottom: '12px'
            }}>
              Export / Publish
            </h3>
            <ExportPanel />
          </section>

          {/* Mod List */}
          <section aria-label="Selected components" className="card-static" style={{ padding: '24px' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              margin: '0 0 20px 0',
              borderBottom: '1px solid var(--border-default)',
              paddingBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Bill of Materials</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Active</span>
            </h3>
            <ModList />
          </section>
        </aside>
      </div>
    </div>
  )
}
