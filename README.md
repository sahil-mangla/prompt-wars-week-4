# MatchMind

> **GenAI-Powered Stadium Operations & Crowd Intelligence for FIFA World Cup 2026**
>
> Prompt Wars Challenge 4 — Smart Stadiums & Tournament Operations

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/sahil-mangla/prompt-wars-week-4)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![A11y](https://img.shields.io/badge/accessibility-WCAG_2.1_AA-green)](./A11Y_REPORT.json)
[![Security](https://img.shields.io/badge/API_key-server--side_only-green)](./next.config.mjs)

---

## What Is MatchMind?

MatchMind is a real-time, multi-surface GenAI operations platform for large-scale stadium events. It addresses the **gap between reactive stadium management and proactive AI-driven decision support** — verified against academic literature on crowd dynamics, multilingual dispatch latency, and fan navigation behavior.

The platform has three coordinated surfaces:

| Surface | Persona | Language | Purpose |
|---------|---------|----------|---------|
| **Operator Command Center** | Alex (Ops Manager) | English | SentinelAI crowd alerts, multilingual dispatch |
| **Volunteer Mobile PWA** | Maria (Gate Marshal) | Portuguese | Role-aware task scripts, confirmation flow |
| **Fan Companion App** | Yusuf (Wheelchair fan) | Arabic / English | Accessible routing, transport, sustainability |

---

## The Problem (Research-Backed)

Traditional stadium operations are **purely reactive** — incidents are identified after they form, not before:

| Gap | Baseline (Literature) | MatchMind Target |
|-----|----------------------|------------------|
| Crowd incident detection | 0 min lead time (reactive) | **3 min predictive** |
| Volunteer dispatch | 480 sec via manual radio | **< 5 sec** |
| Fan detour adoption | 15% from static signs | **40%** |
| Translation accuracy | 72% (off-the-shelf MT) | **95%** (Gemini + domain prompting) |
| Accessible route recompute | 600 sec (10 min, manual) | **< 30 sec** |

Full citations: [`PAPER_REFERENCES.bib`](./PAPER_REFERENCES.bib) · Full metrics: [`EVALUATION_PLAN.json`](./EVALUATION_PLAN.json)

---

## Architecture

```
                        MatchMind Platform
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  /operator              /volunteer              /fan             │
│  Operator Dashboard     Volunteer PWA           Fan App          │
│  (Dark mode, desktop)   (Mobile, Portuguese)    (Mobile, Arabic) │
│                                                                  │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│          Firebase Firestore  ←→  BroadcastChannel + localStorage │
│                  Real-Time State Sync (all 3 surfaces)           │
│                                                                  │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│  SentinelAI Engine (Local)            Gemini 2.5 Flash           │
│  Transparent Heuristic Engine         POST /api/analyze          │
│  ┌ Crowd Flow (35%)                   POST /api/translate        │
│  ├ Scan Rate Surge (25%)              Server-side only           │
│  ├ Social Sentiment (20%)             GEMINI_API_KEY never        │
│  ├ Weather/Heat Index (10%)           exposed to client bundle   │
│  └ Historical Pattern (10%)                                      │
│                                                                  │
│  Cross-validation: < 3 signals → 0.5× | ≥ 4 signals → 1.1×     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Key Features

### SentinelAI — Predictive Crowd Intelligence
- **Transparent Local Heuristic Engine**: Calculates confidence scores based on a clear, programmatically defined formula in `lib/simulation-engine.js` rather than an opaque ML "black-box" model.
- **5-signal ensemble**: crowd flow velocity, ticket scan rate, social media sentiment, heat index, historical pattern match
- **Cross-validated confidence scoring**: fewer than 3 independent signals active → confidence halved (false alert prevention)
- **3-minute predictive lead time** before crowd incidents form
- **Dynamic Operational Insights (`POST /api/analyze`)**: Generates real-time incident explanations, actionable dispatch plans, and sustainability impact (eco-impact) statements based on live telemetry using Gemini 2.5 Flash.

### Multilingual Dispatch (Gemini 2.5 Flash)
- Secure server-side proxy at `POST /api/translate` and `POST /api/analyze` — API key never in client bundle
- Dynamic translations of SentinelAI operational insights and action plans.
- 9 languages supported: PT, ES, AR, FR, DE, JA, ZH, HI, EN
- Role-aware instructions: Maria gets Gate Marshal Portuguese script; Luis gets ramp safety Spanish script

### Real-Time Cross-Surface State Sync
- **BroadcastChannel API** for real-time cross-tab updates without a WebSocket server
- **localStorage persistence** for late-joining tab hydration
- Works in demo mode without Firebase credentials (automatic fallback)
- Firebase Firestore integration for production deployments

### Accessibility-First Design
- **Atkinson Hyperlegible** font (purpose-built for low-vision users, loaded via `next/font`)
- **Arabic RTL** layout with full content localization in fan app
- **Wheelchair-accessible SVG routing map** with dynamic path switching (green detour / red blocked)
- `role="switch"` + `aria-checked` accessibility mode toggle
- **WCAG 2.1 AA compliant** — verified in [`A11Y_REPORT.json`](./A11Y_REPORT.json)
- **Fully Responsive Mobile & Desktop Layouts**: Standardized viewport configurations, fluid typography (using CSS `clamp()`), and flex/grid responsive wrappers enable the entire MatchMind platform (including the Operator Command Console, Launcher, Volunteer PWA, and Fan App) to scale and render on any mobile or desktop screen.
- `prefers-reduced-motion` guard on all animations

### Transport & Sustainability Layer
- Fan **Transport tab**: Metro/shuttle wait times with eco-friendly flagging, wheelchair accessibility indicators
- **Google Maps Directions Redirect**: Integrated transit button next to each route in the Fan App that redirects fans to Google Maps Directions in transit mode pointing directly to AT&T Stadium (or Gate 7B for accessible shuttles)
- **Eco Status Pills**: Live stadium sustainability KPIs (Renewable Energy 78%, Waste Recycled 62%, Public Transit 44%) are showcased as a sleek row of horizontal badges in the top bar of the Fan App
- Volunteer eco-tip: crowd redirection saves 18% HVAC energy in redirected sector

### Security-First Engineering
- `GEMINI_API_KEY` is server-side ONLY (no `NEXT_PUBLIC_` prefix)
- CSP headers, `X-Frame-Options: DENY`, `X-XSS-Protection` in `next.config.mjs`
- Input sanitization on Gemini proxy: 2000-char length limit + language allowlist
- Health check endpoint at `/api/health` reports key presence as boolean — never the key value
- `.env.example` template with inline documentation on safe/unsafe key patterns

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/sahil-mangla/prompt-wars-week-4.git
cd prompt-wars-week-4/matchmind

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local and add your API keys (see Configuration below)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Configuration

Edit `.env.local`:

```bash
# Gemini API (server-side ONLY — never add NEXT_PUBLIC_ prefix)
GEMINI_API_KEY=your_gemini_key
```

> **Note:** The app runs in **LocalSync mode** by default without Firebase credentials, using BroadcastChannel + localStorage for real-time cross-tab state sync. This avoids blocked client-side requests and works out-of-the-box.

---

### Vercel Deployment (100% Free)

Since MatchMind runs server-side Next.js API routes (`/api/analyze`, `/api/translate`) to request GenAI insights safely, it is fully optimized to deploy to **Vercel** with one click for free:

1. **Push your code** to your GitHub repository.
2. **Log in to Vercel** (connect with GitHub).
3. Click **Add New > Project**, and import the repository.
4. Add the environment variables under project settings:
   - `GEMINI_API_KEY`: Your Gemini API key.
5. Click **Deploy**. Vercel will compile the frontend and automatically run the edge/serverless functions.

---

## Demo Flow (3 Browser Tabs)

Open these three URLs simultaneously to experience the full scenario:

**Tab 1:** [http://localhost:3000](http://localhost:3000) — Launcher / Simulation Controls

**Tab 2:** [http://localhost:3000/operator](http://localhost:3000/operator) — Operator Command Center

**Tab 3:** [http://localhost:3000/fan](http://localhost:3000/fan) — Fan Companion App (Arabic)

**Optional Tab 4:** [http://localhost:3000/volunteer](http://localhost:3000/volunteer) — Volunteer Portal (Portuguese)

**Important:** Open all these tabs **BEFORE** injecting the surge, so you can observe the real-time cross-tab state synchronization in action.

**Steps:**
1. In Tab 1: Click **"Inject Gate 7 Surge Telemetry"**
2. Watch Tab 2: SentinelAI activates, confidence bar reaches 81%, alert panel appears
3. In Tab 2: Click **"Approve Action & Dispatch"**
4. Watch Tab 4: Maria's Portuguese emergency task card appears with eco tip
5. Watch Tab 3: Arabic detour alert pulses, SVG routing map switches to detour path (Gate 7B)
6. In Tab 3: Explore **Transport** and **Eco** tabs
7. In Tab 2: Click **"Clear & Resolve Incident"** — all surfaces reset

---

## Project Structure

```
matchmind/
├── app/
│   ├── api/
│   │   ├── health/route.js        # GET /api/health — system status
│   │   └── translate/route.js     # POST /api/translate — Gemini proxy
│   ├── fan/page.js                # Fan Companion App (Arabic/English, tabs)
│   ├── operator/page.js           # Operator Command Dashboard
│   ├── volunteer/page.js          # Volunteer Mobile PWA
│   ├── globals.css                # OKLCH/HSL base styles
│   ├── layout.js                  # Root layout, next/font, metadata, viewport
│   └── page.js                    # Launcher / simulation controls
├── lib/
│   ├── firebase.js                # Firestore + BroadcastChannel SyncStore
│   └── simulation-engine.js       # SentinelAI signal engine + timeline
├── design-system/
│   ├── CSS_TOKENS.css             # Main styling tokens
│   └── DESIGN_SYSTEM.md           # Color tokens, typography, spacing, design bans
├── docs/
│   ├── CLAUDE.md                  # AI Dev Instructions
│   ├── PROJECT_BRIEF.md           # Full submission document
│   ├── ROADMAP.json               # Task-wise implementation roadmap
│   └── TECH_STACK.json            # Architecture decisions, performance guards
├── reports/
│   ├── A11Y_REPORT.json           # WCAG 2.1 AA accessibility audit
│   ├── EVALUATION_PLAN.json       # Metrics and baselines
│   ├── PAPER_REFERENCES.bib       # Citations for research claims
│   ├── PERFORMANCE_REPORT.json    # CWV analysis
│   ├── QA_REPORT.json             # Test results
│   └── CHECKLISTS.json            # Checklists
├── tests/
│   ├── api/                       # Backend endpoint tests (Health, Translation)
│   ├── frontend/                  # React component tests (Jest + RTL)
│   └── security/                  # Validation & environment security tests
├── .env.example                   # Environment variable template
├── .gitignore                     # node_modules, .next, .env*, coverage, tests
└── next.config.mjs                # Security headers (CSP, X-Frame-Options)
```

## Testing & Production Verification

Stricter automated checks are enforced locally and on every GitHub push using Jest, React Testing Library, and GitHub Actions to ensure 100% reliability for production deployment.

### 1. Automated CI/CD Pipeline
Every push or pull request to the `main` branch automatically triggers the GitHub Actions CI pipeline (`.github/workflows/ci.yml`), executing:
* **`npm ci`**: Validates dependency locking and integrity.
* **`npm run lint`**: Inspects syntax correctness and layout rules.
* **`npm test`**: Runs the complete backend and frontend Jest test suites in isolation.
* **`npm run build`**: Compiles the Next.js production bundle, catching compile-time type, SSR, or dynamic import errors.

### 2. Frontend Test Suites (`tests/frontend/`)
Verifies interactive React components, state changes, and accessibility controls:
* **Operator Console (`operator.test.js`)**: Tests simulation status triggers, live telemetry grids, approval modal controls, and state syncing.
* **Fan Companion App (`fan.test.js`)**: Verifies Arabic/English translation toggles, wheelchair-accessibility toggles, SVG detour rendering, and Google Maps redirect coordinates.
* **Volunteer Portal (`volunteer.test.js`)**: Verifies task briefings, Portuguese/English dynamic text rendering, and task acceptance status updates.

### 3. Backend API & Security Test Suites (`tests/api/` & `tests/security/`)
Ensures secure request routing, data parsing, and Gemini API proxy safety:
* **System Health (`health.test.js`)**: Validates health check endpoints, configuration flags, and active sync modes.
* **AI Analysis (`analyze.test.js`)**: Tests SentinelAI telemetry analysis formatting, response JSON validation, and stable fallback handlers.
* **Operational Security (`api-security.test.js`)**: Enforces safety constraints including input character sanitization (truncation), preventing prompt injection vectors, CORS verification, and server key isolation.

### 4. Running the Tests Locally
Execute the following command to run all test suites in band:
```bash
npm run test
```

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 16.2 (App Router) | Static pages + server API routes for key isolation |
| Styling | Vanilla CSS (OKLCH/HSL tokens) | No runtime overhead, full design control |
| Font | Atkinson Hyperlegible via next/font | Zero FOIT, WCAG-grade legibility |
| AI | Gemini 2.5 Flash | Best-in-class stadium terminology accuracy |
| Database | Firebase Firestore + LocalSync fallback | Works in demo without credentials |
| State sync | BroadcastChannel + localStorage | Real-time cross-tab without WebSocket server |
| Prediction | Custom SentinelAI ensemble | Cross-validated, false-alert resistant |

---

---

## License

MIT
