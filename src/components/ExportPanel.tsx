/**
 * ExportPanel Component
 * Aesthetic: Digital Craftsman's Workshop
 * 'Publish' buttons and format selection
 */

import { useState } from 'react'
import { useModpackStore } from '@/lib/state/store'
import { exportMRPack } from '@/lib/export/mrpack'
import { exportCFPack } from '@/lib/export/curseforge'
import { exportPackwiz } from '@/lib/export/packwiz'
import { generateShareURL, copyToClipboard } from '@/lib/state/url-state'

type ExportFormat = 'mrpack' | 'curseforge' | 'packwiz'

const FORMAT_INFO: Record<ExportFormat, { label: string; description: string; icon: string }> = {
  mrpack: { label: '.mrpack', description: 'Standard blueprint (Modrinth/Prism)', icon: '🟢' },
  curseforge: { label: 'CurseForge', description: 'Legacy format export', icon: '🟠' },
  packwiz: { label: 'Packwiz', description: 'Server-ready manifesto', icon: '📦' },
}

export function ExportPanel() {
  const { config, mods } = useModpackStore()
  const [isExporting, setIsExporting] = useState(false)
  const [format, setFormat] = useState<ExportFormat>('mrpack')
  const [shareURL, setShareURL] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleExport = async () => {
    if (mods.length === 0) return

    setIsExporting(true)
    try {
      const packConfig = { ...config, mods }

      switch (format) {
        case 'mrpack':
          await exportMRPack(packConfig, mods)
          break
        case 'curseforge':
          await exportCFPack(packConfig, mods)
          break
        case 'packwiz':
          await exportPackwiz(packConfig, mods)
          break
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = () => {
    const url = generateShareURL({
      name: config.name,
      minecraftVersion: config.minecraftVersion,
      loader: config.loader,
      mods: mods.map(m => ({
        modId: m.mod.id,
        source: m.mod.source,
        versionId: m.version.id,
      })),
    })
    setShareURL(url)
  }

  const handleCopy = async () => {
    if (!shareURL) return
    const success = await copyToClipboard(shareURL)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const modrinthCount = mods.filter(m => m.mod.source === 'modrinth').length
  const cfCount = mods.filter(m => m.mod.source === 'curseforge').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Format Selector */}
      <div>
        <label htmlFor="export-format" className="sr-only">Export Format</label>
        <div style={{ position: 'relative' }}>
          <select
            id="export-format"
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
            className="input"
            style={{
              width: '100%',
              cursor: 'pointer',
              appearance: 'none',
              paddingRight: '40px',
              fontFamily: 'var(--font-display)',
              fontSize: '15px'
            }}
            aria-label="Select export format"
          >
            {Object.entries(FORMAT_INFO).map(([key, { label, icon }]) => (
              <option key={key} value={key}>{icon} {label}</option>
            ))}
          </select>
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--text-muted)'
          }}>
            ▼
          </div>
        </div>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginTop: '6px',
          fontStyle: 'italic'
        }}>
          {FORMAT_INFO[format].description}
        </p>
      </div>

      {/* Export Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={handleExport}
          disabled={mods.length === 0 || isExporting}
          className="btn btn-primary"
          style={{ flex: 1, minWidth: '140px' }}
          aria-label={`Export as ${FORMAT_INFO[format].label}`}
        >
          {isExporting ? (
            <>
              <svg
                style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite', marginRight: '8px' }}
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  style={{ opacity: 0.25 }}
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  style={{ opacity: 0.75 }}
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Forging...
            </>
          ) : (
            <>
              <span style={{ fontSize: '18px' }}>⚒️</span>
              Export .ZIP
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          disabled={mods.length === 0}
          className="btn btn-secondary"
          style={{ flex: 1, minWidth: '140px' }}
          aria-label="Generate share link"
        >
          <span style={{ fontSize: '18px' }}>🔗</span>
          Share Link
        </button>
      </div>

      {/* Share URL Display */}
      {shareURL && (
        <div className="card" style={{ padding: '12px', background: 'var(--bg-elevated)', borderStyle: 'dashed' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Public Link
            </span>
            <button
              onClick={handleCopy}
              style={{
                fontSize: '12px',
                color: 'var(--accent-bright)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>
          <input
            type="text"
            value={shareURL}
            readOnly
            className="input"
            style={{
              width: '100%',
              fontSize: '13px',
              padding: '8px 12px',
              height: '36px',
              fontFamily: 'monospace'
            }}
            onClick={(e) => e.currentTarget.select()}
          />
        </div>
      )}

      {/* Stats */}
      {mods.length > 0 && (
        <div style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          borderTop: '1px solid var(--border-default)',
          paddingTop: '16px'
        }}>
          Sourced from <span style={{ color: '#7cb36b' }}>{modrinthCount} Modrinth</span> & <span style={{ color: '#d4a056' }}>{cfCount} CurseForge</span>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
