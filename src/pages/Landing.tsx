/**
 * Landing Page - The marketing/entry page for ModWeaver
 * Professional yet fun first impression
 */

import { SignInButton, SignUpButton, useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export function Landing() {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard')
    }
  }, [isLoaded, isSignedIn, navigate])

  return (
    <div className="landing">
      {/* Hero Section */}
      <header className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">🧵</span>
            ModWeaver
          </h1>
          <p className="hero-tagline">
            The professional modpack suite for Minecraft
          </p>
          <p className="hero-description">
            Create, manage, and share modpacks with an experience that's
            <strong> beautiful</strong>, <strong>powerful</strong>, and <strong>fun</strong>.
          </p>

          <div className="hero-actions">
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
          </div>
        </div>

        <div className="hero-visual">
          {/* Animated preview or screenshot placeholder */}
          <div className="preview-card">
            <div className="preview-header">
              <span className="preview-dot red"></span>
              <span className="preview-dot yellow"></span>
              <span className="preview-dot green"></span>
            </div>
            <div className="preview-content">
              <div className="preview-sidebar"></div>
              <div className="preview-main">
                <div className="preview-card-item"></div>
                <div className="preview-card-item"></div>
                <div className="preview-card-item"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="landing-features">
        <h2 className="features-title">Why ModWeaver?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🔍</span>
            <h3>Unified Search</h3>
            <p>Search Modrinth and CurseForge in one place. No more tab switching.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📦</span>
            <h3>Export Anywhere</h3>
            <p>MRPACK, CurseForge, Packwiz — export to any format you need.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">☁️</span>
            <h3>Cloud Saved</h3>
            <p>Your packs are always synced. Access from anywhere.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🤝</span>
            <h3>Share & Collaborate</h3>
            <p>Share your packs with friends or the community.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Built with ❤️ for the Minecraft modding community</p>
      </footer>
    </div>
  )
}
