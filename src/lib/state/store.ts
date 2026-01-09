/**
 * Modpack Store (Zustand)
 * Global state for mod selection, filters, and modpack configuration
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ModLoader, SelectedMod, ModpackConfig } from '../api/types'

/** Available Minecraft versions (recent) */
export const MINECRAFT_VERSIONS = [
  '1.21.4', '1.21.3', '1.21.1', '1.21',
  '1.20.6', '1.20.4', '1.20.2', '1.20.1',
  '1.19.4', '1.19.2',
  '1.18.2',
  '1.16.5',
  '1.12.2',
] as const

/** Available mod loaders */
export const MOD_LOADERS: ModLoader[] = ['fabric', 'forge', 'neoforge', 'quilt']

interface ModpackState {
  // Filter state
  gameVersion: string
  loader: ModLoader
  searchQuery: string

  // Modpack config
  config: Omit<ModpackConfig, 'mods'>

  // Selected mods
  mods: SelectedMod[]

  // Actions
  setGameVersion: (version: string) => void
  setLoader: (loader: ModLoader) => void
  setSearchQuery: (query: string) => void

  addMod: (mod: SelectedMod) => void
  removeMod: (modId: string) => void
  updateMod: (modId: string, updates: Partial<SelectedMod>) => void
  clearMods: () => void

  updateConfig: (updates: Partial<ModpackConfig>) => void

  // Helpers
  hasMod: (modId: string) => boolean
}

export const useModpackStore = create<ModpackState>()(
  persist(
    (set, get) => ({
      // Default filters
      gameVersion: '1.21.4',
      loader: 'fabric',
      searchQuery: '',

      // Default config
      config: {
        name: 'My Modpack',
        version: '1.0.0',
        description: 'A custom Minecraft modpack',
        author: '',
        minecraftVersion: '1.21.4',
        loader: 'fabric',
        loaderVersion: '',
      },

      // Empty mod list
      mods: [],

      // Filter actions
      setGameVersion: (version) => set((state) => ({
        gameVersion: version,
        config: { ...state.config, minecraftVersion: version },
      })),

      setLoader: (loader) => set((state) => ({
        loader,
        config: { ...state.config, loader },
      })),

      setSearchQuery: (query) => set({ searchQuery: query }),

      // Mod actions
      addMod: (mod) => set((state) => {
        // Prevent duplicates
        if (state.mods.some(m => m.mod.id === mod.mod.id)) {
          return state
        }
        return { mods: [...state.mods, mod] }
      }),

      removeMod: (modId) => set((state) => ({
        mods: state.mods.filter(m => m.mod.id !== modId),
      })),

      updateMod: (modId, updates) => set((state) => ({
        mods: state.mods.map(m =>
          m.mod.id === modId ? { ...m, ...updates } : m
        ),
      })),

      clearMods: () => set({ mods: [] }),

      updateConfig: (updates) => set((state) => ({
        config: { ...state.config, ...updates },
      })),

      // Helper to check if mod is already selected
      hasMod: (modId) => get().mods.some(m => m.mod.id === modId),
    }),
    {
      name: 'modweaver-store',
      partialize: (state) => ({
        // Only persist these values
        gameVersion: state.gameVersion,
        loader: state.loader,
        config: state.config,
        mods: state.mods,
      }),
    }
  )
)
