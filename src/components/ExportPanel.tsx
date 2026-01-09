/**
 * ExportPanel Component
 * Export modpack to various formats with format selector
 * Follows Apple HIG: accessible buttons, loading states
 */

import { useState } from 'react'
import { useModpackStore } from '@/lib/state/store'
import { exportMRPack } from '@/lib/export/mrpack'
import { exportCFPack } from '@/lib/export/curseforge'
import { exportPackwiz } from '@/lib/export/packwiz'
import { generateShareURL, copyToClipboard } from '@/lib/state/url-state'

type ExportFormat = 'mrpack' | 'curseforge' | 'packwiz'

const FORMAT_INFO: Record<ExportFormat, { label: string; description: string }> = {
  mrpack: { label: '.mrpack (Modrinth)', description: 'Best for Modrinth Launcher, Prism, ATLauncher' },
  curseforge: { label: 'CurseForge ZIP', description: 'Best for CurseForge app, MultiMC' },
  packwiz: { label: 'Packwiz', description: 'Best for servers and auto-updating' },
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
    <div className="space-y-4">
      {/* Format Selector */}
      <div>
        <label htmlFor="export-format" className="sr-only">Export Format</label>
        <select
          id="export-format"
          value={format}
          onChange={(e) => setFormat(e.target.value as ExportFormat)}
          className="input w-full"
          aria-label="Select export format"
        >
          {Object.entries(FORMAT_INFO).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <p className="text-caption2 text-[var(--color-label-tertiary)] mt-1">
          {FORMAT_INFO[format].description}
        </p>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          disabled={mods.length === 0 || isExporting}
          className="btn btn-primary flex-1 min-w-[140px]"
          aria-label={`Export as ${FORMAT_INFO[format].label}`}
        >
          {isExporting ? (
            <>
              <svg
                className="w-5 h-5 mr-2 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          disabled={mods.length === 0}
          className="btn btn-secondary flex-1 min-w-[140px]"
          aria-label="Generate share link"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share
        </button>
      </div>

      {/* Share URL Display */}
      {shareURL && (
        <div className="card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-caption1 text-[var(--color-label-secondary)]">
              Share URL
            </span>
            <button
              onClick={handleCopy}
              className="text-caption1 text-[var(--color-accent)] hover:underline"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            value={shareURL}
            readOnly
            className="input w-full text-caption1"
            onClick={(e) => e.currentTarget.select()}
          />
        </div>
      )}

      {/* Stats */}
      {mods.length > 0 && (
        <div className="text-caption1 text-[var(--color-label-tertiary)]">
          {modrinthCount > 0 && (
            <span className="mr-3">
              {modrinthCount} Modrinth
            </span>
          )}
          {cfCount > 0 && (
            <span>
              {cfCount} CurseForge
            </span>
          )}
        </div>
      )}
    </div>
  )
}
