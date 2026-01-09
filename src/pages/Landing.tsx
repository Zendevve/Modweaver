/**
 * Landing Page - The marketing entry for ModWeaver
 * Linear/Modern design with blue accent
 * Hero with ambient lighting + Features + CTA
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
    icon: '🔍',
    title: 'Unified Search',
    description: 'Search Modrinth and CurseForge simultaneously. Find any mod across platforms in one place.',
  },
  {
    icon: '📦',
    title: 'Multi-Format Export',
    description: 'Export to MRPACK, CurseForge, or Packwiz. Works with any launcher you prefer.',
  },
  {
    icon: '☁️',
    title: 'Cloud Saved',
    description: 'Your modpacks sync automatically. Access your work from anywhere, anytime.',
  },
  {
    icon: '⚡',
    title: 'Blazing Fast',
    description: 'Built for speed with modern web technologies. No bloat, no waiting.',
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
    <div className="landing">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-badge">
          <span className="badge">
            <span>✨</span>
            Now in Beta
          </span>
        </div>

        <h1 className="hero-title">
          <span className="text-gradient">
            The modpack suite
          </span>
          <br />
          <span className="text-gradient-accent">
            built for creators
          </span>
        </h1>

        <p className="hero-description">
          Create, manage, and share Minecraft modpacks with a professional tool
          that's as powerful as it is beautiful. Search all platforms, export anywhere.
        </p>

        <div className="hero-actions">
          {hasValidClerkKey ? (
            <>
              <SignUpButton mode="modal">
                <button className="btn btn-primary btn-lg">
                  Get Started Free
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="btn btn-secondary btn-lg">
                  Sign In
                </button>
              </SignInButton>
            </>
          ) : (
            <>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/editor')}
              >
                Try the Editor
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => navigate('/dashboard')}
              >
                View Dashboard
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
          </div>
          <div className="preview-content">
            <div className="preview-sidebar">
              <div style={{
                height: '32px',
                background: 'var(--background-surface)',
                borderRadius: '6px',
                marginBottom: '8px'
              }}></div>
              <div style={{
                height: '28px',
                background: 'var(--accent-subtle)',
                borderRadius: '6px',
                marginBottom: '4px'
              }}></div>
              <div style={{
                height: '28px',
                background: 'var(--background-surface)',
                borderRadius: '6px',
                marginBottom: '4px'
              }}></div>
              <div style={{
                height: '28px',
                background: 'var(--background-surface)',
                borderRadius: '6px'
              }}></div>
            </div>
            <div className="preview-main">
              <div className="preview-card"></div>
              <div className="preview-card"></div>
              <div className="preview-card"></div>
              <div className="preview-card"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="features-header">
          <span className="section-label">
            <span>⚙️</span>
            Features
          </span>
          <h2 className="features-title text-gradient">
            Everything you need, nothing you don't
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
        <h2 className="cta-title text-gradient">
          Ready to build something amazing?
        </h2>
        <p className="cta-description">
          Join creators who are building the next generation of modpacks.
        </p>
        {hasValidClerkKey ? (
          <SignUpButton mode="modal">
            <button className="btn btn-primary btn-lg">
              Start Building — It's Free
            </button>
          </SignUpButton>
        ) : (
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/editor')}
          >
            Try the Editor Now
          </button>
        )}
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>
          Built with ❤️ for the Minecraft modding community
          <br />
          <span style={{ opacity: 0.6 }}>
            Not affiliated with Mojang, CurseForge, or Modrinth.
          </span>
        </p>
      </footer>
    </div>
  )
}
