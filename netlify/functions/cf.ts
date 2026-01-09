/**
 * CurseForge API Proxy
 * Netlify Function that adds API key and handles CORS
 *
 * Per AGENTS.md: Using Netlify Functions format
 */

import type { Config, Context } from "@netlify/functions"

const CF_API_BASE = 'https://api.curseforge.com/v1'

export default async (request: Request, _context: Context) => {
  // Get the path after /api/cf
  const url = new URL(request.url)
  const cfPath = url.pathname.replace('/api/cf', '')

  // Build CurseForge URL
  const cfUrl = new URL(cfPath, CF_API_BASE)
  cfUrl.search = url.search

  // Get API key from environment
  const apiKey = process.env.CURSEFORGE_API_KEY

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'CurseForge API key not configured' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    // Forward request to CurseForge
    const cfResponse = await fetch(cfUrl.toString(), {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': apiKey,
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    })

    // Get response body
    const data = await cfResponse.json()

    // Return with CORS headers
    return new Response(JSON.stringify(data), {
      status: cfResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('CurseForge proxy error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch from CurseForge' }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export const config: Config = {
  path: '/api/cf/*',
}
