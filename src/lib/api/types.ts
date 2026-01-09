/**
 * ModWeaver Type Definitions
 * Unified mod interface normalizing Modrinth and CurseForge APIs
 */

/** Mod source platform */
export type ModSource = 'modrinth' | 'curseforge'

/** Mod loader types */
export type ModLoader = 'fabric' | 'forge' | 'neoforge' | 'quilt'

/** Environment requirement */
export type EnvRequirement = 'required' | 'optional' | 'unsupported'

/** Unified mod interface - normalizes both API responses */
export interface Mod {
  /** Unique identifier (platform-specific) */
  id: string
  /** Source platform */
  source: ModSource
  /** Human-readable slug */
  slug: string
  /** Display name */
  name: string
  /** Short description */
  description: string
  /** Author name */
  author: string
  /** Icon URL */
  iconUrl: string | null
  /** Download count */
  downloads: number
  /** Last updated timestamp */
  updatedAt: string
  /** Supported mod loaders */
  loaders: ModLoader[]
  /** Supported Minecraft versions */
  gameVersions: string[]
  /** Categories/tags */
  categories: string[]
  /** Project page URL */
  pageUrl: string
}

/** Mod version/file for a specific release */
export interface ModVersion {
  /** Version ID */
  id: string
  /** Mod ID (parent) */
  modId: string
  /** Source platform */
  source: ModSource
  /** Version name (e.g., "1.0.0") */
  versionNumber: string
  /** Minecraft versions supported */
  gameVersions: string[]
  /** Mod loaders supported */
  loaders: ModLoader[]
  /** Download URL */
  downloadUrl: string
  /** File name */
  fileName: string
  /** File size in bytes */
  fileSize: number
  /** SHA512 hash (Modrinth) or null */
  sha512: string | null
  /** SHA1 hash */
  sha1: string | null
  /** CurseForge file ID (for manifest) */
  cfFileId?: number
  /** CurseForge project ID (for manifest) */
  cfProjectId?: number
  /** Client requirement */
  clientSide: EnvRequirement
  /** Server requirement */
  serverSide: EnvRequirement
  /** Dependencies */
  dependencies: ModDependency[]
}

/** Mod dependency reference */
export interface ModDependency {
  /** Dependency project ID or slug */
  projectId: string
  /** Dependency type */
  type: 'required' | 'optional' | 'incompatible' | 'embedded'
  /** Version ID if specific */
  versionId?: string
}

/** Selected mod in the modpack builder */
export interface SelectedMod {
  mod: Mod
  version: ModVersion
  /** User override for client/server */
  clientSide: EnvRequirement
  serverSide: EnvRequirement
}

/** Modpack configuration */
export interface ModpackConfig {
  /** Modpack name */
  name: string
  /** Modpack version */
  version: string
  /** Description */
  description: string
  /** Author */
  author: string
  /** Minecraft version */
  minecraftVersion: string
  /** Mod loader */
  loader: ModLoader
  /** Loader version (e.g., "0.14.21" for Fabric) */
  loaderVersion: string
  /** Selected mods */
  mods: SelectedMod[]
}

/** Search parameters */
export interface SearchParams {
  query: string
  loader?: ModLoader
  gameVersion?: string
  limit?: number
  offset?: number
}
