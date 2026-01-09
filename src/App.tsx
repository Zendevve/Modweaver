/**
 * ModWeaver App
 * Root application with Clerk auth and React Router
 * Supports running without Clerk key for development
 */

import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Layouts
import { SuiteLayout } from './layouts/SuiteLayout'

// Pages
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { Editor } from './pages/Editor'

// Clerk publishable key (from environment)
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if we have a valid Clerk key
const hasValidClerkKey = CLERK_PUBLISHABLE_KEY &&
  CLERK_PUBLISHABLE_KEY !== 'pk_test_placeholder' &&
  CLERK_PUBLISHABLE_KEY.startsWith('pk_')

if (!hasValidClerkKey) {
  console.warn('⚠️ No valid Clerk key found - running in DEV MODE (no auth)')
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
})

/**
 * Dev Mode App - No Clerk authentication
 * All routes accessible, skip landing page
 */
function DevModeApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Dev mode: Go straight to editor */}
          <Route path="/" element={<Navigate to="/editor" replace />} />

          {/* Suite routes - no auth protection */}
          <Route element={<SuiteLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/new" element={<Editor />} />
            <Route path="/editor/:packId" element={<Editor />} />
          </Route>

          {/* Show landing for preview */}
          <Route path="/landing" element={<Landing />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/editor" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

/**
 * Production App - Full Clerk authentication
 */
function ProductionApp() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <SignedOut>
                    <Landing />
                  </SignedOut>
                  <SignedIn>
                    <Navigate to="/dashboard" replace />
                  </SignedIn>
                </>
              }
            />

            {/* Protected Suite Routes */}
            <Route
              element={
                <>
                  <SignedIn>
                    <SuiteLayout />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/" replace />
                  </SignedOut>
                </>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/editor/new" element={<Editor />} />
              <Route path="/editor/:packId" element={<Editor />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

function App() {
  // Use dev mode if no valid Clerk key
  if (!hasValidClerkKey) {
    return <DevModeApp />
  }

  return <ProductionApp />
}

export default App
