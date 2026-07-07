# Design System Specification — MatchMind

## 1. Visual Identity & Theme
- **Theme Name:** Operative Accessible (High-Contrast Operations)
- **Aesthetic Style:** Vibrant & Block-Based (Clean grid-based panels, high contrast, crisp lines, operations dashboard style)
- **Emotional Goal:** Trust, safety, clarity, and control under high-pressure scenarios.

---

## 2. Color Strategy (OKLCH / HSL)
We use a high-contrast palette calibrated to exceed WCAG AA guidelines (>= 4.5:1 ratio). We avoid generic gray scales in favor of rich slate and blue tones.

### Global Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#2563EB` | `--color-primary` |
| Secondary | `#3B82F6` | `--color-secondary` |
| Accent/CTA | `#F97316` | `--color-accent` |
| Background | `#F8FAFC` | `--color-background` |
| Foreground | `#1E293B` | `--color-foreground` |

### Light Mode OKLCH
```css
--color-primary: oklch(50% 0.22 250);       /* Dominant Brand Blue */
--color-secondary: oklch(65% 0.18 240);     /* Secondary Blue */
--color-accent: oklch(68% 0.21 45);         /* Alert/CTA Orange */
--color-background: oklch(98% 0.01 240);     /* Clean Slate White */
--color-surface: oklch(95% 0.02 240);        /* Panel Background */
--color-foreground: oklch(20% 0.03 240);     /* Deep Charcoal */
```

### Dark Mode (Default for Operator Command View)
```css
--color-primary: oklch(62% 0.20 250);       /* Vibrant Blue */
--color-secondary: oklch(45% 0.15 240);     /* Muted Slate Blue */
--color-accent: oklch(68% 0.21 45);         /* Warning Orange */
--color-background: oklch(12% 0.02 240);     /* Deep Navy Slate */
--color-surface: oklch(18% 0.03 240);       /* Card/Panel Fill */
--color-foreground: oklch(96% 0.01 240);     /* Crisp Ice White */
```

---

## 3. Typography Story
We use **Atkinson Hyperlegible** as both the Heading and Body font. This choice directly addresses the World Cup accessibility requirements, offering maximum legibility for low-vision fans, operators, and volunteers under dynamic environments.

- **Heading Font:** Atkinson Hyperlegible (Bold, weight 700)
- **Body Font:** Atkinson Hyperlegible (Regular, weight 400)
- **Header Line Height:** 1.2
- **Body Line Height:** 1.6
- **Max Measure:** 65–75ch (for optimal readability)
- **Fluid Typography:** Uses `clamp()` to scale typography fluidly across mobile and desktop without layout shifts.

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap');
```

---

## 4. Spacing, Layout Grid & Shadow Depths
- **Scale:** 4px / 8px incremental grid.
- **Tokens:**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

- **Cards:** Rounded corner radius of exactly `12px` (maximum limits are `16px` per impeccable rules to prevent bubbly look).
- **Z-Index Scale:**
  - `0` (base)
  - `10` (hover overlay)
  - `20` (floating toolbar)
  - `40` (modals / priority alerts)
  - `100` (system modals)

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## 5. Component Specs

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: #F97316;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #2563EB;
  border: 2px solid #2563EB;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards
```css
.card {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs
```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #2563EB;
  outline: none;
  box-shadow: 0 0 0 3px #2563EB20;
}
```

### Modals
```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## 6. Motion Language
- **Transitions:** Smooth, exponential easing (`cubic-bezier(0.16, 1, 0.3, 1)`) for all state changes.
- **Duration:** Enter animations take `250ms`, exit animations are faster (`150ms`) to feel highly responsive.
- **A11y:** Respects user preference for reduced motion.

---

## 7. Style Guidelines
**Style:** Vibrant & Block-based
**Keywords:** Bold, energetic, playful, block layout, geometric shapes, high color contrast, duotone, modern, energetic
**Best For:** Startups, creative agencies, gaming, social media, youth-focused, entertainment, consumer
**Key Effects:** Large sections (48px+ gaps), animated patterns, bold hover (color shift), scroll-snap, large type (32px+), 200-300ms

### Page Pattern (Real-Time / Operations Landing)
- **Conversion Strategy:** For ops/security/iot products. Demo or sandbox link. Trust signals.
- **CTA Placement:** Primary CTA in nav + After metrics
- **Section Order:** 1. Hero (product + live preview or status), 2. Key metrics/indicators, 3. How it works, 4. CTA (Start trial / Contact)

---

## 8. Interaction Rules
- **Touch Targets:** Minimum `48px` x `48px` on mobile (Volunteer and Fan views) with at least `8px` gap between interactive areas.
- **Indicators:** Active states must have explicit outlines or scale transforms (no layout shifts). No emoji icons; all icons are SVG (Lucide/Heroicons).
- **Buttons:** Action-focused naming (e.g. "Approve Dispatch" or "Acknowledge Task") rather than generic labels.

---

## 9. Design Bans & Anti-Patterns (Do NOT Use)
- 🚫 **No text gradients** (uses solid, high-contrast text for accessibility)
- 🚫 **No uppercase tracker eyebrows** (clean typography sizing only)
- 🚫 **No side-stripe card borders** (uses solid cards with clear focus borders)
- 🚫 **No ghost cards** (never combines border + shadow; choose one)
- 🚫 **No sequential numbering headers** (unless showing chronological steps)
- 🚫 **No card/modal border radius > 16px** (locks border radius to 12px)
- ❌ Static content
- ❌ Poor fan engagement
- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## 10. Pre-Delivery Checklist
Before delivering any UI code, verify:
- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
