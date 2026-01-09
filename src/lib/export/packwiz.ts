/**
 * Packwiz Export
 * Generates Packwiz-compatible TOML pack structure
 * Format: pack.toml + index.toml + mods/*.pw.toml
 */

import JSZip from 'jszip'
import type { ModpackConfig, SelectedMod } from '../api/types'

/**
 * Generate pack.toml content
 */
function generatePackToml(config: ModpackConfig): string {
  return `name = "${config.name}"
author = "${config.author || 'ModWeaver User'}"
version = "${config.version}"
pack-format = "packwiz:1.1.0"

[versions]
minecraft = "${config.minecraftVersion}"
${config.loader} = "${config.loaderVersion || '*'}"

[index]
file = "index.toml"
hash-format = "sha256"
`
}

/**
 * Generate a .pw.toml file for a mod
 */
function generateModToml(mod: SelectedMod): string {
  const { mod: modInfo, version } = mod

  if (modInfo.source === 'modrinth') {
    return `name = "${modInfo.name}"
filename = "${version.fileName}"
side = "both"

[download]
url = "${version.downloadUrl}"
hash-format = "sha512"
hash = "${version.sha512 || ''}"

[update]
[update.modrinth]
mod-id = "${modInfo.id}"
version = "${version.id}"
`
  } else {
    // CurseForge format
    return `name = "${modInfo.name}"
filename = "${version.fileName}"
side = "both"

[update]
[update.curseforge]
file-id = ${version.cfFileId || 0}
project-id = ${version.cfProjectId || 0}
`
  }
}

/**
 * Generate index.toml content
 */
function generateIndexToml(mods: SelectedMod[]): string {
  const files = mods.map(m => {
    const filename = m.mod.slug.replace(/[^a-zA-Z0-9-]/g, '-')
    return `[[files]]
file = "mods/${filename}.pw.toml"
hash = ""
metafile = true`
  })

  return `hash-format = "sha256"

${files.join('\n\n')}
`
}

/**
 * Generate Packwiz modpack ZIP
 */
export async function generatePackwiz(
  config: ModpackConfig,
  mods: SelectedMod[]
): Promise<Blob> {
  const zip = new JSZip()

  // Add pack.toml
  zip.file('pack.toml', generatePackToml(config))

  // Add index.toml
  zip.file('index.toml', generateIndexToml(mods))

  // Create mods folder with .pw.toml files
  const modsFolder = zip.folder('mods')

  for (const mod of mods) {
    const filename = mod.mod.slug.replace(/[^a-zA-Z0-9-]/g, '-')
    modsFolder?.file(`${filename}.pw.toml`, generateModToml(mod))
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
export async function exportPackwiz(
  config: ModpackConfig,
  mods: SelectedMod[]
): Promise<void> {
  const blob = await generatePackwiz(config, mods)
  const filename = `${config.name.replace(/[^a-zA-Z0-9]/g, '-')}-packwiz.zip`

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
