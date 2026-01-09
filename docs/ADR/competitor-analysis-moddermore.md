# Moddermore Competitor Analysis

## Executive Summary

Moddermore is a mature modpack list sharing platform. This analysis identifies features where they **excel** vs where **ModWeaver can differentiate**.

---

## Architecture Comparison

| Aspect | Moddermore | ModWeaver |
|--------|------------|-----------|
| Framework | Next.js 16 (Pages Router) | Vite + React 18 |
| Database | MongoDB + Vercel KV | None (localStorage) |
| Auth | NextAuth (Discord, GitHub, Email) | None |
| Hosting | Vercel | Netlify (target) |
| Cost | Paid (MongoDB, Vercel KV) | **Zero Cost** ✅ |

---

## Moddermore Strengths (We Need to Match)

### 1. **Import Methods** (5 ways to create lists)
```
/new/prism   → MultiMC/Prism Instance import
/new/mrpack  → Modrinth pack import
/new/ferium  → Ferium CLI import
/new/folder  → Mods folder drag-drop
/new/manual  → Manual search
```
> **Gap**: ModWeaver only has manual search

### 2. **Export Formats** (more complete)
- ZIP with mods downloaded
- MRPACK (Modrinth)
- Packwiz (auto-updating)
- **Prism/MultiMC native** with auto-update
> **Gap**: We have MRPACK/CurseForge/Packwiz but no Prism native

### 3. **Prism Auto-Update Export**
They bundle `packwiz-installer-bootstrap.jar` and create `instance.cfg` with PreLaunchCommand that fetches updates automatically.
> **This is killer feature** - modpack stays updated

### 4. **Visibility System**
- Private (only owner)
- Unlisted (link-only)
- Public (searchable)
> **Gap**: We have URL sharing but no privacy controls

### 5. **Social Features**
- User accounts
- Likes/favorites
- Featured lists on homepage
- Stats (pageviews, users, lists)
> **Gap**: We have none of this (by design - zero cost)

### 6. **Loader Version Fetching**
```typescript
getLatestFabric()
getLatestForge(gameVersion)
getLatestNeoforge(gameVersion)
getLatestQuilt()
```
They fetch the actual latest loader versions from APIs.
> **Gap**: We just use placeholder versions

### 7. **Mod Hash Resolution**
- SHA512 hashing for mod verification
- Can parse mod JARs to identify mods
- Cross-reference against Modrinth/CurseForge by hash
> **Gap**: We trust download URLs only

### 8. **Validation**
Uses Valibot for runtime type validation:
```typescript
const ModListCreate = v.strictObject({
  title: v.pipe(v.string(), v.minLength(1)),
  mods: v.pipe(v.array(Mod), v.minLength(1), v.maxLength(500)),
})
```
> **Gap**: We have TypeScript types only, no runtime validation

---

## ModWeaver Advantages

| Feature | ModWeaver | Moddermore |
|---------|-----------|------------|
| **Cost** | $0/month | Requires MongoDB + Vercel |
| **Privacy** | All client-side | Data stored on their servers |
| **Simplicity** | Single page app | Multi-page, auth required |
| **Speed** | No SSR overhead | Next.js SSR |
| **Deploy anywhere** | Static hosting | Vercel-dependent |
| **No account needed** | ✅ | Requires login to create |

---

## Priority Improvements for ModWeaver

### High Priority (differentiators)
1. **Prism/MultiMC Export** - Their killer feature
2. **Import from MRPACK** - Let users convert existing packs
3. **Loader Version API** - Fetch real loader versions

### Medium Priority
4. **Drag-drop mods folder import**
5. **Progress indicators during export**
6. **Better error handling with toasts**

### Low Priority (social features we skip)
- User accounts ❌ (would add cost)
- Likes ❌
- Public search ❌

---

## Technical Debt in Moddermore

1. Next.js Pages Router (legacy, not App Router)
2. MongoDB adapter patches required
3. Heavy eslint-disable comments in Prism export
4. No NeoForge in some loader version switches

---

## Conclusion

**Moddermore's core strength**: Database-backed social sharing with auto-updating modpacks.

**ModWeaver's differentiation**: Zero-cost, privacy-first, no account required.

**Key features to add**:
1. Prism/MultiMC export with Packwiz auto-update
2. MRPACK import
3. Real loader version fetching
