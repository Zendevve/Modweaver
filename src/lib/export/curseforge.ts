/**
 * CurseForge Modpack Export
 * Generates CurseForge-compatible modpack ZIP files
 * Format: manifest.json + modlist.html + overrides/
 */

import JSZip from 'jszip'
import type { ModpackConfig, SelectedMod } from '../api/types'

/** CurseForge manifest structure */
interface CFManifest {
  minecraft: {
    version: string
    modLoaders: Array<{
      id: string
      primary: boolean
    }>
  }
  manifestType: 'minecraftModpack'
  manifestVersion: 1
  name: string
  version: string
  author: string
  files: Array<{
    projectID: number
    fileID: number
    required: boolean
  }>
  overrides: string
}

/**
 * Generate CurseForge modpack ZIP
 * Note: Only includes CurseForge mods in files array
 * Modrinth mods must be downloaded and placed in overrides/
 */
export async function generateCFPack(
  config: ModpackConfig,
  mods: SelectedMod[]
): Promise<Blob> {
  const zip = new JSZip()

  // Separate CurseForge and Modrinth mods
  const cfMods = mods.filter(m => m.mod.source === 'curseforge')
  const mrMods = mods.filter(m => m.mod.source === 'modrinth')

  // Build loader ID
  let loaderId = ''
  if (config.loader === 'forge') {
    loaderId = `forge-${config.loaderVersion || 'latest'}`
  } else if (config.loader === 'fabric') {
    loaderId = `fabric-${config.loaderVersion || 'latest'}`
  } else if (config.loader === 'neoforge') {
    loaderId = `neoforge-${config.loaderVersion || 'latest'}`
  } else if (config.loader === 'quilt') {
    loaderId = `quilt-${config.loaderVersion || 'latest'}`
  }

  // Build manifest
  const manifest: CFManifest = {
    minecraft: {
      version: config.minecraftVersion,
      modLoaders: [{
        id: loaderId,
        primary: true,
      }],
    },
    manifestType: 'minecraftModpack',
    manifestVersion: 1,
    name: config.name,
    version: config.version,
    author: config.author || 'ModWeaver User',
    files: cfMods
      .filter(m => m.version.cfProjectId && m.version.cfFileId)
      .map(m => ({
        projectID: m.version.cfProjectId!,
        fileID: m.version.cfFileId!,
        required: true,
      })),
    overrides: 'overrides',
  }

  // Add manifest
  zip.file('manifest.json', JSON.stringify(manifest, null, 2))

  // Build modlist.html
  const modlistHtml = `<ul>
${mods.map(m => `<li><a href="${m.mod.pageUrl}">${m.mod.name}</a> (by ${m.mod.author})</li>`).join('\n')}
</ul>`
  zip.file('modlist.html', modlistHtml)

  // Create overrides folder
  const overrides = zip.folder('overrides')
  const modsFolder = overrides?.folder('mods')

  // Note: For Modrinth mods, we would need to download the JARs
  // and include them in overrides/mods/
  // This requires fetching the actual files which we skip for now
  if (mrMods.length > 0) {
    // Add a readme explaining which mods need manual download
    const readme = `# Manual Downloads Required

The following mods are from Modrinth and need to be downloaded manually:

${mrMods.map(m => `- ${m.mod.name}: ${m.mod.pageUrl}`).join('\n')}

Download these mods and place the .jar files in the mods folder.
`
    modsFolder?.file('_DOWNLOAD_THESE.md', readme)
  }

  // Generate ZIP
  return zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  })
}

/**
 * Export helper function
 */
export async function exportCFPack(
  config: ModpackConfig,
  mods: SelectedMod[]
): Promise<void> {
  const blob = await generateCFPack(config, mods)
  const filename = `${config.name.replace(/[^a-zA-Z0-9]/g, '-')}-${config.version}-curseforge.zip`

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
