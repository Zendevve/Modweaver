/**
 * CurseForge API Client
 * Routes through Netlify Function proxy to handle CORS and API key
 * API Docs: https://docs.curseforge.com/
 */

import type { Mod, ModVersion, ModLoader, SearchParams, ModDependency, EnvRequirement } from './types'

// Proxy endpoint (Netlify Function)
const CF_PROXY = '/api/cf'

// CurseForge game ID for Minecraft
const MINECRAFT_GAME_ID = 432

// CurseForge class ID for mods
const MODS_CLASS_ID = 6

/** Mod loader type IDs in CurseForge */
const LOADER_TYPE_IDS: Record<ModLoader, number> = {
  forge: 1,
  fabric: 4,
  quilt: 5,
  neoforge: 6,
}

/** Raw CurseForge mod data */
interface CFMod {
  id: number
  slug: string
  name: string
  summary: string
  authors: Array<{ name: string }>
  logo?: { url: string }
  downloadCount: number
  dateModified: string
  categories: Array<{ name: string }>
  latestFilesIndexes: Array<{
    gameVersion: string
    modLoader?: number
  }>
  links: { websiteUrl: string }
}

/** Raw CurseForge file/version data */
interface CFFile {
  id: number
  modId: number
  displayName: string
  fileName: string
  fileLength: number
  downloadUrl: string | null
  gameVersions: string[]
  sortableGameVersions: Array<{
    gameVersionName: string
  }>
  dependencies: Array<{
    modId: number
    relationType: 1 | 2 | 3 | 4 // 1=embedded, 2=optional, 3=required, 4=incompatible
  }>
  hashes: Array<{
    algo: number // 1=sha1, 2=md5
    value: string
  }>
  isAvailable: boolean
}

/** Convert CurseForge loader ID to our type */
function loaderFromId(id: number | undefined): ModLoader | null {
  if (!id) return null
  const map: Record<number, ModLoader> = {
    1: 'forge',
    4: 'fabric',
    5: 'quilt',
    6: 'neoforge',
  }
  return map[id] ?? null
}

/** Convert CurseForge mod to unified Mod interface */
function toMod(cfMod: CFMod): Mod {
  // Extract unique loaders from latest files
  const loaders = new Set<ModLoader>()
  cfMod.latestFilesIndexes.forEach(f => {
    const loader = loaderFromId(f.modLoader)
    if (loader) loaders.add(loader)
  })

  // Extract unique game versions
  const gameVersions = [...new Set(
    cfMod.latestFilesIndexes.map(f => f.gameVersion)
  )]

  return {
    id: String(cfMod.id),
    source: 'curseforge',
    slug: cfMod.slug,
    name: cfMod.name,
    description: cfMod.summary,
    author: cfMod.authors[0]?.name ?? 'Unknown',
    iconUrl: cfMod.logo?.url ?? null,
    downloads: cfMod.downloadCount,
    updatedAt: cfMod.dateModified,
    loaders: [...loaders],
    gameVersions,
    categories: cfMod.categories.map(c => c.name),
    pageUrl: cfMod.links.websiteUrl,
  }
}

/** Convert CurseForge relation type to our dependency type */
function toDependencyType(type: number): ModDependency['type'] {
  const map: Record<number, ModDependency['type']> = {
    1: 'embedded',
    2: 'optional',
    3: 'required',
    4: 'incompatible',
  }
  return map[type] ?? 'optional'
}

/** Convert CurseForge file to unified ModVersion interface */
function toModVersion(cfFile: CFFile): ModVersion {
  // Find SHA1 hash
  const sha1Hash = cfFile.hashes.find(h => h.algo === 1)

  // Determine loaders from game versions (CurseForge includes loader name in versions)
  const loaders: ModLoader[] = []
  const gameVersions: string[] = []

  cfFile.gameVersions.forEach(v => {
    const lower = v.toLowerCase()
    if (lower === 'fabric') loaders.push('fabric')
    else if (lower === 'forge') loaders.push('forge')
    else if (lower === 'neoforge') loaders.push('neoforge')
    else if (lower === 'quilt') loaders.push('quilt')
    else if (/^\d+\.\d+/.test(v)) gameVersions.push(v)
  })

  return {
    id: String(cfFile.id),
    modId: String(cfFile.modId),
    source: 'curseforge',
    versionNumber: cfFile.displayName,
    gameVersions,
    loaders: [...new Set(loaders)],
    downloadUrl: cfFile.downloadUrl ?? '',
    fileName: cfFile.fileName,
    fileSize: cfFile.fileLength,
    sha512: null, // CurseForge doesn't provide SHA512
    sha1: sha1Hash?.value ?? null,
    cfFileId: cfFile.id,
    cfProjectId: cfFile.modId,
    // CurseForge doesn't provide client/server info, default to required
    clientSide: 'required' as EnvRequirement,
    serverSide: 'required' as EnvRequirement,
    dependencies: cfFile.dependencies.map(d => ({
      projectId: String(d.modId),
      type: toDependencyType(d.relationType),
    })),
  }
}

/**
 * Make a request to CurseForge via the proxy
 */
async function cfFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${CF_PROXY}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`CurseForge API error: ${response.status}`)
  }

  const data = await response.json()
  return data.data as T
}

/**
 * Search for mods on CurseForge
 */
export async function searchMods(params: SearchParams): Promise<Mod[]> {
  const searchParams = new URLSearchParams({
    gameId: String(MINECRAFT_GAME_ID),
    classId: String(MODS_CLASS_ID),
    searchFilter: params.query,
    pageSize: String(params.limit ?? 20),
    index: String(params.offset ?? 0),
    sortField: '2', // Popularity
    sortOrder: 'desc',
  })

  if (params.loader) {
    searchParams.set('modLoaderType', String(LOADER_TYPE_IDS[params.loader]))
  }

  if (params.gameVersion) {
    searchParams.set('gameVersion', params.gameVersion)
  }

  const mods = await cfFetch<CFMod[]>(`/mods/search?${searchParams}`)
  return mods.map(toMod)
}

/**
 * Get a specific mod by ID
 */
export async function getMod(id: string): Promise<Mod> {
  const mod = await cfFetch<CFMod>(`/mods/${id}`)
  return toMod(mod)
}

/**
 * Get versions/files for a mod
 */
export async function getModVersions(
  modId: string,
  loader?: ModLoader,
  gameVersion?: string
): Promise<ModVersion[]> {
  const params = new URLSearchParams()

  if (loader) {
    params.set('modLoaderType', String(LOADER_TYPE_IDS[loader]))
  }

  if (gameVersion) {
    params.set('gameVersion', gameVersion)
  }

  const files = await cfFetch<CFFile[]>(
    `/mods/${modId}/files${params.toString() ? `?${params}` : ''}`
  )

  return files
    .filter(f => f.isAvailable)
    .map(toModVersion)
}

/**
 * Get a specific file/version by ID
 */
export async function getModVersion(modId: string, fileId: string): Promise<ModVersion> {
  const file = await cfFetch<CFFile>(`/mods/${modId}/files/${fileId}`)
  return toModVersion(file)
}

/**
 * Get multiple mods by IDs
 */
export async function getMods(ids: string[]): Promise<Mod[]> {
  if (ids.length === 0) return []

  const mods = await cfFetch<CFMod[]>('/mods', {
    method: 'POST',
    body: JSON.stringify({ modIds: ids.map(Number) }),
  })

  return mods.map(toMod)
}
