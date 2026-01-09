/**
 * Modrinth API Client
 * Direct browser requests (Modrinth supports CORS)
 * API Docs: https://docs.modrinth.com/api
 */

import type { Mod, ModVersion, ModLoader, SearchParams, ModDependency, EnvRequirement } from './types'

const MODRINTH_API = 'https://api.modrinth.com/v2'

/** Raw Modrinth search result */
interface ModrinthProject {
  project_id: string
  slug: string
  title: string
  description: string
  author: string
  icon_url: string | null
  downloads: number
  date_modified: string
  categories: string[]
  loaders: string[]
  versions: string[]
  project_type: string
}

/** Raw Modrinth version */
interface ModrinthVersion {
  id: string
  project_id: string
  version_number: string
  game_versions: string[]
  loaders: string[]
  files: Array<{
    url: string
    filename: string
    size: number
    hashes: {
      sha512: string
      sha1: string
    }
    primary: boolean
  }>
  dependencies: Array<{
    project_id: string | null
    version_id: string | null
    dependency_type: 'required' | 'optional' | 'incompatible' | 'embedded'
  }>
  // Environment settings
  client_side?: 'required' | 'optional' | 'unsupported'
  server_side?: 'required' | 'optional' | 'unsupported'
}

/** Convert Modrinth loader string to our type */
function normalizeLoader(loader: string): ModLoader | null {
  const map: Record<string, ModLoader> = {
    fabric: 'fabric',
    forge: 'forge',
    neoforge: 'neoforge',
    quilt: 'quilt',
  }
  return map[loader.toLowerCase()] ?? null
}

/** Convert Modrinth project to unified Mod interface */
function toMod(project: ModrinthProject): Mod {
  return {
    id: project.project_id,
    source: 'modrinth',
    slug: project.slug,
    name: project.title,
    description: project.description,
    author: project.author,
    iconUrl: project.icon_url,
    downloads: project.downloads,
    updatedAt: project.date_modified,
    loaders: project.loaders
      .map(normalizeLoader)
      .filter((l): l is ModLoader => l !== null),
    gameVersions: project.versions,
    categories: project.categories,
    pageUrl: `https://modrinth.com/mod/${project.slug}`,
  }
}

/** Convert Modrinth version to unified ModVersion interface */
function toModVersion(version: ModrinthVersion): ModVersion {
  const primaryFile = version.files.find(f => f.primary) ?? version.files[0]

  return {
    id: version.id,
    modId: version.project_id,
    source: 'modrinth',
    versionNumber: version.version_number,
    gameVersions: version.game_versions,
    loaders: version.loaders
      .map(normalizeLoader)
      .filter((l): l is ModLoader => l !== null),
    downloadUrl: primaryFile?.url ?? '',
    fileName: primaryFile?.filename ?? '',
    fileSize: primaryFile?.size ?? 0,
    sha512: primaryFile?.hashes.sha512 ?? null,
    sha1: primaryFile?.hashes.sha1 ?? null,
    clientSide: (version.client_side as EnvRequirement) ?? 'required',
    serverSide: (version.server_side as EnvRequirement) ?? 'required',
    dependencies: version.dependencies
      .filter(d => d.project_id)
      .map((d): ModDependency => ({
        projectId: d.project_id!,
        type: d.dependency_type,
        versionId: d.version_id ?? undefined,
      })),
  }
}

/**
 * Search for mods on Modrinth
 */
export async function searchMods(params: SearchParams): Promise<Mod[]> {
  const facets: string[][] = [['project_type:mod']]

  if (params.loader) {
    facets.push([`categories:${params.loader}`])
  }

  if (params.gameVersion) {
    facets.push([`versions:${params.gameVersion}`])
  }

  const searchParams = new URLSearchParams({
    query: params.query,
    facets: JSON.stringify(facets),
    limit: String(params.limit ?? 20),
    offset: String(params.offset ?? 0),
  })

  const response = await fetch(`${MODRINTH_API}/search?${searchParams}`)

  if (!response.ok) {
    throw new Error(`Modrinth search failed: ${response.status}`)
  }

  const data = await response.json() as { hits: ModrinthProject[] }
  return data.hits.map(toMod)
}

/**
 * Get a specific mod by ID or slug
 */
export async function getMod(idOrSlug: string): Promise<Mod> {
  const response = await fetch(`${MODRINTH_API}/project/${idOrSlug}`)

  if (!response.ok) {
    throw new Error(`Modrinth getMod failed: ${response.status}`)
  }

  const project = await response.json() as ModrinthProject
  return toMod(project)
}

/**
 * Get versions for a mod
 */
export async function getModVersions(
  modId: string,
  loader?: ModLoader,
  gameVersion?: string
): Promise<ModVersion[]> {
  const params = new URLSearchParams()

  if (loader) {
    params.set('loaders', JSON.stringify([loader]))
  }

  if (gameVersion) {
    params.set('game_versions', JSON.stringify([gameVersion]))
  }

  const url = `${MODRINTH_API}/project/${modId}/version${params.toString() ? `?${params}` : ''}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Modrinth getVersions failed: ${response.status}`)
  }

  const versions = await response.json() as ModrinthVersion[]
  return versions.map(toModVersion)
}

/**
 * Get a specific version by ID
 */
export async function getModVersion(versionId: string): Promise<ModVersion> {
  const response = await fetch(`${MODRINTH_API}/version/${versionId}`)

  if (!response.ok) {
    throw new Error(`Modrinth getVersion failed: ${response.status}`)
  }

  const version = await response.json() as ModrinthVersion
  return toModVersion(version)
}

/**
 * Get multiple mods by IDs
 */
export async function getMods(ids: string[]): Promise<Mod[]> {
  if (ids.length === 0) return []

  const response = await fetch(`${MODRINTH_API}/projects?ids=${JSON.stringify(ids)}`)

  if (!response.ok) {
    throw new Error(`Modrinth getMods failed: ${response.status}`)
  }

  const projects = await response.json() as ModrinthProject[]
  return projects.map(toMod)
}
