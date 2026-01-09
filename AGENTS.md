# AGENTS.md

ModWeaver — Vite + React + TypeScript + Netlify

Follows [MCAF](https://mcaf.managed-code.com/)

---

## Conversations (Self-Learning)

Learn the user's habits, preferences, and working style. Extract rules from conversations, save to "## Rules to follow", and generate code according to the user's personal rules.

**Update requirement (core mechanism):**

Before doing ANY task, evaluate the latest user message.
If you detect a new rule, correction, preference, or change → update `AGENTS.md` first.
Only after updating the file you may produce the task output.
If no new rule is detected → do not update the file.

---

## Rules to follow (Mandatory, no exceptions)

### Commands

- build: `npm run build`
- dev: `npm run dev` or `netlify dev` (for functions)
- test: `npm run test`
- format: `npm run format`
- lint: `npm run lint`

### Task Delivery (ALL TASKS)

- Read assignment, inspect code and docs before planning
- Write multi-step plan before implementation
- Implement code and tests together
- Run tests in layers: new → related suite → broader regressions
- After all tests pass: run format, then build
- Summarize changes and test results before marking complete
- Always run required builds and tests yourself; do not ask user to execute them

### Documentation (ALL TASKS)

- All docs live in `docs/`
- Update feature docs when behaviour changes
- Update ADRs when architecture changes
- Templates: `docs/templates/`

### Testing (ALL TASKS)

- Every behaviour change needs sufficient automated tests
- Prefer integration/API/UI tests over unit tests
- No mocks for internal systems — use real services
- Never delete or weaken a test to make it pass
- Each test verifies a real flow or scenario

### Autonomy

- Start work immediately — no permission seeking
- Questions only for architecture blockers not covered by ADR
- Report only when task is complete

### Code Style

- TypeScript strict mode
- React functional components only
- No magic literals — extract to constants
- Follow Apple HIG accessibility guidelines (min 44x44pt touch targets, 4.5:1 contrast)
- Semantic HTML for accessibility
- Support both light and dark modes

### Critical (NEVER violate)

- Never commit secrets, keys, connection strings
- Never mock internal systems in integration tests
- Never skip tests to make PR green
- Never force push to main
- Never approve or merge (human decision)
- ZERO COST — only free tier services

### Boundaries

**Always:**

- Read AGENTS.md and docs before editing code
- Run tests before commit
- Follow Apple HIG for all UI decisions

**Ask first:**

- Changing public API contracts
- Adding new dependencies
- Modifying database schema
- Deleting code files

---

## Preferences

### Likes

- Vite over Next.js (simpler, familiar)
- Turso over Supabase (for future DB needs)
- Clean, minimal UI following Apple HIG
- Zero-cost development approach

### Dislikes

- Next.js complexity
- Paid services
- Overly complex architectures

---

## Tech Stack

- **Framework**: Vite + React 18
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + Shadcn/UI
- **State**: Zustand
- **Data Fetching**: TanStack Query
- **Hosting**: Netlify (free tier)
- **Functions**: Netlify Functions (for CurseForge proxy)
- **Database**: Turso (optional, free tier)
- **Export**: JSZip (client-side)
- **Compression**: lz-string (URL state)

---

## Design System (Apple HIG Compliance)

### Accessibility

- Minimum touch target: 44x44pt (mobile), 28x28pt (desktop)
- Color contrast: 4.5:1 minimum, 7:1 preferred
- Support Dynamic Type / font scaling
- Never rely on color alone for information
- Support keyboard navigation

### Color

- Use system colors that adapt to light/dark mode
- Semantic colors for states (error, success, warning)
- Avoid hard-coded color values

### Typography

- System font stack: `-apple-system, BlinkMacSystemFont, 'Inter', sans-serif`
- Minimum body text: 16px
- Clear hierarchy: display, heading, body, caption

### Motion

- Respect `prefers-reduced-motion`
- Subtle, purposeful animations
- No auto-playing media without controls
