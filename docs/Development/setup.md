# Development Setup

## Prerequisites

- Node.js 20+
- npm 10+
- Netlify CLI (`npm install -g netlify-cli`)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (frontend only)
npm run dev

# Start with Netlify Functions
netlify dev

# Run tests
npm run test

# Build for production
npm run build
```

## Environment Variables

Create `.env.local`:

```env
# Required for CurseForge integration
CURSEFORGE_API_KEY=your_key_here

# Optional: Turso database
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

## Project Structure

```
mcmodpack/
├── docs/                    # MCAF documentation
│   ├── Features/           # Feature specifications
│   ├── ADR/                # Architecture decisions
│   ├── Testing/            # Test strategy
│   └── Development/        # This file
├── netlify/
│   └── functions/          # Serverless functions
├── src/
│   ├── components/         # React components
│   ├── lib/               # Utilities and API clients
│   └── styles/            # CSS and Tailwind
├── public/                # Static assets
├── AGENTS.md              # AI agent instructions
└── package.json
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `netlify dev` | Start with functions |
| `npm run build` | Production build |
| `npm run test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
