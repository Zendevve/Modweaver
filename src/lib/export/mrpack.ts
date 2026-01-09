/**
 * MRPACK Export
 * Generates Modrinth .mrpack files client-side using JSZip
 * Format spec: https://docs.modrinth.com/modpacks/format
 */

import JSZip from 'jszip'
import type { ModpackConfig, SelectedMod, EnvRequirement } from '../api/types'

/** MRPACK manifest structure */
interface MRPackIndex {
  formatVersion: 1
  game: 'minecraft'
  versionId: string
  name: string
  summary?: string
  files: MRPackFile[]
  dependencies: Record<string, string>
}

interface MRPackFile {
  path: string
  hashes: {
    sha1: string
    sha512: string
  }
  env?: {
    client: EnvRequirement
    server: EnvRequirement
  }
  downloads: string[]
  fileSize: number
}

/**
 * Generate MRPACK (Modrinth modpack) from selected mods
 */
export async function generateMRPack(
  config: ModpackConfig,
  mods: SelectedMod[]
): Promise<Blob> {
  const zip = new JSZip()

  // Build file list from mods
  const files: MRPackFile[] = []

  for (const { mod, version, clientSide, serverSide } of mods) {
    // Only include mods with valid download URLs and hashes
    if (!version.downloadUrl) {
      console.warn(`Skipping ${mod.name}: no download URL`)
      continue
    }

    // For Modrinth mods, we have hashes
    if (version.source === 'modrinth' && version.sha512 && version.sha1) {
      files.push({
        path: `mods/${version.fileName}`,
        hashes: {
          sha1: version.sha1,
          sha512: version.sha512,
        },
        env: {
          client: clientSide,
          server: serverSide,
        },
        downloads: [version.downloadUrl],
        fileSize: version.fileSize,
      })
    } else {
      // For CurseForge mods without hashes, we'd need to download and hash
      // For now, skip with warning
      console.warn(`Skipping ${mod.name}: missing hashes (CurseForge mod)`)
    }
  }

  // Build dependencies object
  const dependencies: Record<string, string> = {
    minecraft: config.minecraftVersion,
  }

  // Add loader dependency
  const loaderKey = config.loader === 'fabric' ? 'fabric-loader'
    : config.loader === 'quilt' ? 'quilt-loader'
      : config.loader === 'forge' ? 'forge'
        : config.loader === 'neoforge' ? 'neoforge'
          : 'fabric-loader'

  if (config.loaderVersion) {
    dependencies[loaderKey] = config.loaderVersion
  } else {
    // Use a recent version as placeholder
    dependencies[loaderKey] = '*'
  }

  // Build manifest
  const manifest: MRPackIndex = {
    formatVersion: 1,
    game: 'minecraft',
    versionId: config.version,
    name: config.name,
    summary: config.description,
    files,
    dependencies,
  }

  // Add manifest to ZIP
  zip.file('modrinth.index.json', JSON.stringify(manifest, null, 2))

  // Create overrides folder (empty for now)
  zip.folder('overrides')

  // Generate ZIP blob
  return zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  })
}

/**
 * Trigger download of the generated MRPACK
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Generate and download MRPACK
 */
export async function exportMRPack(
  config: ModpackConfig,
  mods: SelectedMod[]
): Promise<void> {
  const blob = await generateMRPack(config, mods)
  const filename = `${config.name.replace(/[^a-zA-Z0-9]/g, '-')}-${config.version}.mrpack`
  downloadBlob(blob, filename)
}
