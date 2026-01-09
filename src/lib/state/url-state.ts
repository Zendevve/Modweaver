/**
 * URL State Sharing
 * Compresses mod list to shareable URL using lz-string
 * No database needed - everything in the URL!
 */

import LZString from 'lz-string'
import type { ModLoader } from '../api/types'

/** Minimal mod reference for URL encoding */
interface ModRef {
  /** Mod ID */
  i: string
  /** Source: 'm' = modrinth, 'c' = curseforge */
  s: 'm' | 'c'
  /** Version ID */
  v: string
}

/** URL state structure */
interface URLState {
  /** Modpack name */
  n: string
  /** Minecraft version */
  mc: string
  /** Loader */
  l: ModLoader
  /** Mods */
  m: ModRef[]
}

/**
 * Encode mod list to URL-safe compressed string
 */
export function encodeState(state: {
  name: string
  minecraftVersion: string
  loader: ModLoader
  mods: Array<{
    modId: string
    source: 'modrinth' | 'curseforge'
    versionId: string
  }>
}): string {
  const urlState: URLState = {
    n: state.name,
    mc: state.minecraftVersion,
    l: state.loader,
    m: state.mods.map(mod => ({
      i: mod.modId,
      s: mod.source === 'modrinth' ? 'm' : 'c',
      v: mod.versionId,
    })),
  }

  const json = JSON.stringify(urlState)
  return LZString.compressToEncodedURIComponent(json)
}

/**
 * Decode URL-safe compressed string to mod list
 */
export function decodeState(encoded: string): {
  name: string
  minecraftVersion: string
  loader: ModLoader
  mods: Array<{
    modId: string
    source: 'modrinth' | 'curseforge'
    versionId: string
  }>
} | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded)
    if (!json) return null

    const urlState: URLState = JSON.parse(json)

    return {
      name: urlState.n,
      minecraftVersion: urlState.mc,
      loader: urlState.l,
      mods: urlState.m.map(mod => ({
        modId: mod.i,
        source: mod.s === 'm' ? 'modrinth' : 'curseforge',
        versionId: mod.v,
      })),
    }
  } catch {
    return null
  }
}

/**
 * Generate shareable URL with current state
 */
export function generateShareURL(state: Parameters<typeof encodeState>[0]): string {
  const encoded = encodeState(state)
  const url = new URL(window.location.href)
  url.searchParams.set('pack', encoded)
  return url.toString()
}

/**
 * Read state from current URL if present
 */
export function readURLState(): ReturnType<typeof decodeState> {
  const url = new URL(window.location.href)
  const encoded = url.searchParams.get('pack')
  if (!encoded) return null
  return decodeState(encoded)
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }
}
