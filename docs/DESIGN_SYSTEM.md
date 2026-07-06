# Design System Specification — MatchMind

## 1. Visual Identity & Theme
- **Theme Name:** Operative Accessible (High-Contrast Operations)
- **Aesthetic Style:** Vibrant & Block-Based (Clean grid-based panels, high contrast, crisp lines, operations dashboard style)
- **Emotional Goal:** Trust, safety, clarity, and control under high-pressure scenarios.

---

## 2. Color Strategy (OKLCH / HSL)
We use a high-contrast palette calibrated to exceed WCAG AA guidelines (>= 4.5:1 ratio). We avoid generic gray scales in favor of rich slate and blue tones.

### Light Mode
```css
--color-primary: oklch(50% 0.22 250);       /* Dominant Brand Blue */
--color-secondary: oklch(65% 0.18 240);     /* Secondary Blue */
--color-accent: oklch(68% 0.21 45);         /* Alert/CTA Orange */
--color-background: oklch(98% 0.01 240);     /* Clean Slate White */
--color-surface: oklch(95% 0.02 24);         /* Panel Background */
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

---

## 4. Spacing & Layout Grid
- **Scale:** 4px / 8px incremental grid.
- **Tokens:**
  - `--space-xs`: `4px`
  - `--space-sm`: `8px`
  - `--space-md`: `16px`
  - `--space-lg`: `24px`
  - `--space-xl`: `32px`
  - `--space-2xl`: `48px`
- **Cards:** Rounded corner radius of exactly `12px` (maximum limits are `16px` per impeccable rules to prevent bubbly look).
- **Z-Index Scale:**
  - `0` (base)
  - `10` (hover overlay)
  - `20` (floating toolbar)
  - `40` (modals / priority alerts)
  - `100` (system modals)

---

## 5. Motion Language
- **Transitions:** Smooth, exponential easing (`cubic-bezier(0.16, 1, 0.3, 1)`) for all state changes.
- **Duration:** Enter animations take `250ms`, exit animations are faster (`150ms`) to feel highly responsive.
- **A11y:** Respects user preference for reduced motion.

---

## 6. Interaction Rules
- **Touch Targets:** Minimum `48px` x `48px` on mobile (Volunteer and Fan views) with at least `8px` gap between interactive areas.
- **Indicators:** Active states must have explicit outlines or scale transforms (no layout shifts). No emoji icons; all icons are SVG (Lucide/Heroicons).
- **Buttons:** Action-focused naming (e.g. "Approve Dispatch" or "Acknowledge Task") rather than generic labels.

---

## 7. Design Bans Enforced
- 🚫 **No text gradients** (uses solid, high-contrast text for accessibility)
- 🚫 **No uppercase tracker eyebrows** (clean typography sizing only)
- 🚫 **No side-stripe card borders** (uses solid cards with clear focus borders)
- 🚫 **No ghost cards** (never combines border + shadow; choose one)
- 🚫 **No sequential numbering headers** (unless showing chronological steps)
- 🚫 **No card/modal border radius > 16px** (locks border radius to 12px)
