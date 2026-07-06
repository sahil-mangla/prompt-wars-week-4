# Contributing to MatchMind

Thank you for your interest in contributing to MatchMind! This document provides guidelines and standards for contributing to the codebase.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Component Guidelines](#component-guidelines)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)

---

## Architecture Overview

MatchMind is a Next.js 16 App Router project with three coordinated surfaces:

| Surface | Path | Purpose |
|---------|------|---------|
| Operator Command Center | `/operator` | SentinelAI crowd alerts, multilingual dispatch |
| Volunteer Mobile PWA | `/volunteer` | Role-aware task scripts, confirmation flow |
| Fan Companion App | `/fan` | Accessible routing, transport, sustainability |

**Key libraries:**
- `lib/sync-store.js` — single interface for all state reads/writes (do not import firebase.js or local-sync.js directly from UI)
- `lib/constants.js` — all magic strings, IDs, thresholds, and translations (never hardcode inline)
- `lib/simulation-engine.js` — SentinelAI heuristic engine + scenario timeline
- `lib/services/analysis-service.js` — Gemini API fetch + fallback logic

---

## Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local (server-side only — no NEXT_PUBLIC_ prefix)

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app runs in **LocalSync mode** by default (no Firebase required). Provide `NEXT_PUBLIC_FIREBASE_*` keys in `.env.local` to enable Firestore.

---

## Code Standards

### Language

- All source code is written in **JavaScript** (not TypeScript).
- Use **JSDoc annotations** for public functions and types in `lib/`.
- Do **not** introduce `tsconfig.json` or `.ts` files.

### Imports

- Always use the `@/` path alias — never relative `../../` imports.
  - ✅ `import { syncStore } from "@/lib/sync-store";`
  - ❌ `import { syncStore } from "../../lib/sync-store";`

### Constants

- All magic strings, IDs, and numeric thresholds belong in `lib/constants.js`.
- All i18n/translation strings belong in `lib/constants.js` (`TRANSLATIONS`, `VOLUNTEER_TRANSLATIONS`).
- Never hardcode these values inline in components.

### State Management

- Always read/write state through `syncStore` from `@/lib/sync-store`.
- Do **not** import `firebase.js`, `local-sync.js`, or Firestore directly from UI components.

### Styling

- Use CSS custom properties (variables) from `globals.css` — never inline hex colors or raw pixel values.
- All new design tokens go in `app/globals.css`.

---

## Component Guidelines

### Co-location

Sub-components belong inside the feature directory, not in shared space:

```
app/
├── _components/          ← Only truly shared components (used in 2+ features)
├── operator/
│   ├── _components/      ← Operator-specific components only
│   └── page.js
├── fan/
│   ├── _components/      ← Fan-specific components only
│   └── page.js
└── volunteer/
    ├── _components/      ← Volunteer-specific components only
    └── page.js
```

**Rule:** Only move a component to `app/_components/` when it is used across two or more feature directories.

### Naming

- Component files use **PascalCase**: `IncidentPanel.js`, `ConfidenceBar.js`
- Utility/service files use **kebab-case**: `analysis-service.js`, `sync-store.js`

---

## Testing Requirements

All PRs must pass the full test suite:

```bash
npm test          # Run all tests
npm run test:coverage   # Run with coverage report
```

### Test locations

| Type | Directory |
|------|-----------|
| Frontend (React components) | `tests/frontend/` |
| API endpoints | `tests/api/` |
| Security validation | `tests/security/` |

### Writing tests

- Use **React Testing Library** for component tests — query by role, label, or semantic text.
- Mock `syncStore` using `jest.mock("@/lib/sync-store")` — never let tests touch Firestore or LocalSync.
- Test **observable behavior** (what the user sees), not implementation details.
- Each new component should have a corresponding test covering: render, state change, and any interactive controls.

---

## Pull Request Process

1. **Branch** from `main` with a descriptive name: `feat/fan-route-map`, `fix/confidence-bar-color`, `refactor/volunteer-task-card`.
2. **Run tests** before opening a PR: `npm test` must exit `0`.
3. **Run lint**: `npm run lint` must report `0` warnings.
4. **Update `lib/constants.js`** if you introduce any new magic strings, IDs, or copy text.
5. **Write or update tests** for any component or service you add/modify.
6. **Do not** expose `GEMINI_API_KEY` to the client bundle (no `NEXT_PUBLIC_GEMINI_*`).

---

## Security Rules (Non-Negotiable)

- `GEMINI_API_KEY` is **server-side only**. Never prefix with `NEXT_PUBLIC_`.
- All user-supplied strings that reach the Gemini API must be sanitized (2000 char limit + allowlist).
- API routes must validate and sanitize all inputs before use.
- The `/api/health` endpoint may report key *presence* as a boolean — never the key value.
