# MatchMind — Project Brief
## FIFA World Cup 2026 | Prompt Wars Challenge 4: Smart Stadiums & Tournament Operations

---

## Problem Statement

Traditional stadium operations are **purely reactive**. Crowd surges, gate bottlenecks, and accessibility failures are identified only *after* they occur — resulting in safety incidents, missed fan experiences, and volunteer miscommunication across language barriers. At the scale of the FIFA World Cup 2026 (3.4M+ tickets, 16 host cities, 48 nations), the latency of manual radio dispatch, the absence of predictive crowd intelligence, and the failure of generic navigation apps to support diverse users (wheelchair users, non-English speakers, elderly fans) are critical gaps.

**Research baseline:**
- Traditional operations identify crowd surges only *after* formation (0-minute lead time) — [MDPI 2024]
- Manual radio dispatch takes an average of **8 minutes** per incident during peak windows — [BayTech 2025]
- Only **15%** of fans adopt secondary routes from static stadium signage — [Milan 2025]
- Off-the-shelf machine translation achieves only **72% accuracy** for stadium-specific terminology — [arXiv 2024]

---

## Solution: MatchMind + SentinelAI

**MatchMind** is a GenAI-powered stadium operations platform for FIFA World Cup 2026 with three coordinated surfaces: an operator command center, a multilingual volunteer PWA, and an accessible fan companion app.

**SentinelAI** is the intelligence layer embedded inside MatchMind — a multi-signal, cross-validated crowd prediction engine that provides **3-minute predictive lead time** on crowd incidents and enables sub-5-second multilingual dispatch to ground volunteers.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     MatchMind Platform                          │
│                                                                 │
│  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │ Operator Command │  │ Volunteer Mobile  │  │ Fan Companion │  │
│  │   Dashboard      │  │    PWA (PT/ES)   │  │  App (AR/EN) │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬────────┘  │
│           │                     │                    │            │
│  ┌────────▼─────────────────────▼────────────────────▼────────┐  │
│  │         Real-Time Sync Layer (Firebase Firestore            │  │
│  │               + BroadcastChannel + localStorage)           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   SentinelAI Engine                       │   │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────┐ ┌────────┐  │   │
│  │  │Crowd Flow  │ │Ticket Scan │ │ Social   │ │Weather │  │   │
│  │  │  (35%)     │ │Rate (25%)  │ │Sentiment │ │(10%)   │  │   │
│  │  │            │ │            │ │  (20%)   │ │        │  │   │
│  │  └────────────┘ └────────────┘ └──────────┘ └────────┘  │   │
│  │                + Historical Pattern Match (10%)           │   │
│  │                                                           │   │
│  │         Cross-Validation: < 3 signals → 0.5x penalty     │   │
│  │                          ≥ 4 signals → 1.1x confirmation  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Gemini 2.5 Flash (Server-side, Secure)         │   │
│  │   POST /api/translate → Multilingual task instructions    │   │
│  │   Supported: PT, ES, AR, FR, DE, JA, ZH, HI, EN          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Personas

| Persona | Role | Language | Challenge Addressed |
|---------|------|----------|---------------------|
| **Alex** (Operator) | Stadium Operations Manager | English | Real-time crowd intelligence, decision support |
| **Maria Silva** | Gate Marshal (Volunteer) | Portuguese | Multilingual task dispatch, actionable scripts |
| **Luis Hernandez** | Ramp Safety (Volunteer) | Spanish | Coordination with secondary gate opening |
| **Yusuf Al-Ahmad** | Fan (Wheelchair user) | Arabic | Accessible routing, detour alerts, transport guidance |

---

## Key Technical Contributions

### 1. Predictive Signal Engine (SentinelAI)
- 5-signal ensemble model (crowd flow, scan rate, social sentiment, weather, historical)
- Cross-validated confidence scoring: < 3 signals triggers a 0.5× variance penalty to prevent false alerts
- Achieves **81% confidence** from the Gate 7 scenario with full 5-signal confirmation
- **3-minute predictive lead time** vs. 0-minute reactive baseline (literature gap)

### 2. Sub-5-Second Multilingual Dispatch
- Gemini 2.5 Flash server-side proxy route (`/api/translate`)
- Stadium-specific prompt engineering preserving gate numbers, zone codes, and technical terms
- Role-aware context: volunteer instructions include their specific assigned zone
- **5s dispatch latency** vs. 480s manual radio baseline (literature gap)

### 3. Real-Time Cross-Surface State Sync
- BroadcastChannel API + localStorage hybrid (works without Firebase credentials)
- Late-joining tab hydration via localStorage constructor read
- All 3 surfaces (operator, volunteer, fan) sync within 1 render cycle (~100ms)

### 4. Accessibility-First Design
- **Atkinson Hyperlegible** typography — designed for low-vision users
- Arabic RTL layout with full content localization in fan app
- Wheelchair-accessible SVG routing map with dynamic detour path switching
- `role="switch"` aria-checked accessibility mode toggle
- WCAG 2.1 AA compliant (verified in A11Y_REPORT.json)

### 5. Transport & Sustainability Layer
- Transport tab: real-time shuttle/metro wait times with eco-friendly flagging
- Volunteer eco-tip: crowd redirection saves 18% HVAC energy in redirected sector
- Sustainability tab: stadium KPIs (78% renewable energy, 62% waste recycled, 44% transit usage)

---

## Evaluation Metrics vs. Literature Baseline

| Metric | Baseline (Literature) | MatchMind Target | Source |
|--------|-----------------------|------------------|--------|
| Incident detection lead time | 0 min (reactive) | **3 min** | MDPI 2024 |
| Dispatch latency | 480 sec (8 min radio) | **< 5 sec** | BayTech 2025 |
| Fan detour adoption | 15% (static signs) | **40%** | Milan 2025 |
| Translation accuracy | 72% (off-the-shelf MT) | **95%** | arXiv 2024 |
| Accessibility route recompute | 600 sec (10 min, manual) | **< 30 sec** | LPF 2025 |

(Full evaluation protocol: EVALUATION_PLAN.json, Citations: PAPER_REFERENCES.bib)

---

## Security Model

| Component | Decision |
|-----------|----------|
| Gemini API Key | Server-side ONLY (`process.env.GEMINI_API_KEY`, never `NEXT_PUBLIC_`) |
| Firebase keys | NEXT_PUBLIC_ prefix — browser-safe by Firebase design |
| Input sanitization | MAX_TEXT_LENGTH=2000 chars + SUPPORTED_LANGUAGES allowlist |
| HTTP headers | CSP, X-Frame-Options: DENY, X-XSS-Protection in next.config.mjs |
| Health check | Reports key *presence* only (boolean) — never key value |

---

## Demo Flow

1. Open launcher (`/`) — click **Inject Gate 7 Surge Telemetry**
2. Open `/operator` — SentinelAI shows 81% confidence bar, crowd alert panel
3. Click **Approve Action & Dispatch** — multilingual tasks assigned to Maria (PT) and Luis (ES)
4. Open `/volunteer` — Maria's emergency Portuguese task card with dispatch time and eco tip
5. Confirm arrival → mark complete
6. Open `/fan` — Arabic detour alert pulsing, SVG map routes to Gate 7B
7. Explore **Transport** tab (shuttle wait times) and **Eco** tab (sustainability KPIs)

---

## Workflow Compliance

Built following `research_informed_hackathon_workflow_v4.yaml` (all 12 stages completed):

| Output | File |
|--------|------|
| Research citations | PAPER_REFERENCES.bib |
| Evaluation plan | EVALUATION_PLAN.json |
| Design system | DESIGN_SYSTEM.md |
| Tech stack | TECH_STACK.json |
| Roadmap | ROADMAP.json |
| A11y audit | A11Y_REPORT.json |
| Quality checklist | CHECKLISTS.json |
| Performance report | PERFORMANCE_REPORT.json |
| QA & slop test | QA_REPORT.json |

---

## Competitive Differentiators vs. Broad Platforms

MatchMind's edge is **depth** over breadth:

- **Research-backed baselines**: Every metric has a literature citation and documented gap (not just a claim)
- **Working predictive model**: SentinelAI is an actual algorithmic system (5-signal ensemble + cross-validation), not just a "Gemini prompt wrapper"
- **Three complete persona journeys**: Operator → Volunteer → Fan is a working end-to-end E2E flow, not a prototype
- **Security-first**: API key separation, CSP headers, and input sanitization documented and tested
- **Accessibility depth**: Atkinson Hyperlegible + Arabic RTL + wheelchair SVG routing + WCAG 2.1 AA audit
