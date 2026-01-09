/**
 * Landing Page - The marketing entry for ModWeaver
 * Aesthetic: Digital Craftsman's Workshop
 * Warm, inviting, and professional.
 */

import { SignInButton, SignUpButton, useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

// Check if we have a valid Clerk key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const hasValidClerkKey = CLERK_PUBLISHABLE_KEY &&
  CLERK_PUBLISHABLE_KEY !== 'pk_test_placeholder' &&
  CLERK_PUBLISHABLE_KEY.startsWith('pk_')

// Features data
const features = [
  {
    icon: '⚒️',
    title: 'Precision Tools',
    description: 'Search Modrinth and CurseForge simultaneously. Find exactly the parts you need for your creation.',
  },
  {
    icon: '📜',
    title: 'Universal Blueprints',
    description: 'Export to MRPACK, CurseForge, or Packwiz. Your creations work on any launcher.',
  },
  {
    icon: '☁️',
    title: 'Cloud Archive',
    description: 'Your projects sync automatically. Your workbench follows you, wherever you go.',
  },
  {
    icon: '⚡',
    title: 'Forged for Speed',
    description: 'Built with modern tech. No bloat, just a clean, responsive workspace.',
  },
]

export function Landing() {
  const navigate = useNavigate()

  // Only use Clerk hooks if we have a valid key
  let isSignedIn = false
  if (hasValidClerkKey) {
    const auth = useAuth()
    isSignedIn = auth.isSignedIn ?? false
  }

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (hasValidClerkKey && isSignedIn) {
      navigate('/dashboard')
    }
  }, [isSignedIn, navigate])

  return (
    <div className="landing texture-paper">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-badge">
          <span className="badge">
            <span>🕯️</span>
            The Artisan Beta
          </span>
        </div>

        <h1 className="hero-title">
          <span className="text-secondary">Craft your</span>
          <br />
          <span className="text-accent">Masterpiece.</span>
        </h1>

        <p className="hero-description">
          The refined workbench for Minecraft modpack creators.
          Gather your materials, forge your connections, and share your vision with the world.
        </p>

        <div className="hero-actions">
          {hasValidClerkKey ? (
            <>
              <SignUpButton mode="modal">
                <button className="btn btn-primary btn-lg">
                  Enter the Workshop
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="btn btn-secondary btn-lg">
                  Open Logbook
                </button>
              </SignInButton>
            </>
          ) : (
            <>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/editor')}
              >
                Try the Workbench
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => navigate('/dashboard')}
              >
                View Plans
              </button>
            </>
          )}
        </div>

        {/* App Preview Mock */}
        <div className="hero-preview">
          <div className="preview-header">
            <span className="preview-dot red"></span>
            <span className="preview-dot yellow"></span>
            <span className="preview-dot green"></span>
            <div style={{ marginLeft: '12px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              ~/workspace/new_project
            </div>
          </div>
          <div className="preview-content">
            <div className="preview-sidebar">
              <div style={{
                height: '32px',
                background: 'var(--bg-surface-hover)',
                borderRadius: '6px',
                marginBottom: '12px',
                border: '1px solid var(--border-default)'
              }}></div>
              <div style={{
                height: '24px',
                background: 'var(--accent-subtle)',
                borderRadius: '4px',
                marginBottom: '8px',
                width: '80%'
              }}></div>
              <div style={{
                height: '24px',
                background: 'transparent',
                borderRadius: '4px',
                marginBottom: '8px',
                border: '1px dashed var(--border-default)',
                width: '60%'
              }}></div>
            </div>
            <div className="preview-main">
              <div className="preview-card" style={{ opacity: 0.8 }}></div>
              <div className="preview-card" style={{ opacity: 0.6 }}></div>
              <div className="preview-card" style={{ opacity: 0.4 }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="features-header">
          <span className="section-label">
            <span>⚒️</span>
            The Toolkit
          </span>
          <h2 className="features-title">
            Everything you need<br />
            <span className="text-secondary" style={{ fontSize: '0.8em', fontStyle: 'italic' }}>to build the extraordinary</span>
          </h2>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <h2 className="cta-title">
          Ready to light the forge?
        </h2>
        <p className="cta-description">
          Join a guild of creators building the next generation of experiences.
        </p>
        {hasValidClerkKey ? (
          <SignUpButton mode="modal">
            <button className="btn btn-primary btn-lg">
              Begin Your Craft — It's Free
            </button>
          </SignUpButton>
        ) : (
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/editor')}
          >
            Open the Workbench
          </button>
        )}
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>
          Handcrafted with ❤️ for the Minecraft modding community
          <br />
          <span style={{ opacity: 0.6 }}>
            Not affiliated with Mojang, CurseForge, or Modrinth.
          </span>
        </p>
      </footer>
    </div>
  )
}
