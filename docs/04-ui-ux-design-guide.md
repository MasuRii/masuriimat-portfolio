# UI/UX Design Guide: Anti-Slop Portfolio (2026)

> Audience: The developer (and any designer collaborator) making visual decisions for the MasuRii portfolio.
> Purpose: Concrete, opinionated design decisions — not abstract principles. Read this before opening Figma or writing CSS.

---

## The Core Premise

In 2026, AI slop is the default. If you use an AI tool to generate your portfolio's design without heavily editing the output, your site will look like every other AI-generated developer site. This guide is about making specific choices that *your* portfolio won't share with 90% of the competition.

Everything below is based on confirmed 2026 research from NNGroup, WalterSignal, Parth Sharma, Figma, Bolt, Opale UI, Envato, and UX Collective. Full source citations are in [`docs/research/portfolio-design-guidance-2026-04-12.md`](research/portfolio-design-guidance-2026-04-12.md).

---

## Tech Stack Decision

**Use Astro 5+ with React islands + Tailwind CSS + TypeScript.**

This is the primary recommendation from ADVICE.md, confirmed by multiple 2026 portfolio builders who achieve Lighthouse 95–100 with Astro's static-first approach. MasuRii already has 4 Astro template repos — this is familiar territory.

| Decision | Rationale |
|---|---|
| **Astro 5+ (not Next.js)** | Static-first → Lighthouse 95+ by default. Zero JS until you add islands. Portfolio doesn't need SSR or a backend. |
| **React islands** | Only where interactivity is needed (project filters, command menu, theme toggle). Rest is static HTML. |
| **Tailwind CSS** | Utility-first speeds up dev; configure the design tokens in `tailwind.config.ts` and you're consistent by default. |
| **TypeScript** | MasuRii's most-used language; strict mode for safety. |
| **MDX for content** | Case studies and blog posts in markdown with embeddable React components. |
| **Deploy: Vercel or Netlify** | Free tier, automatic deploys, Edge CDN, instant rollbacks. |

**Avoid:** GraphQL, headless CMS, heavy animation libraries (GSAP is fine for *one* orchestrated page load — not for every scroll interaction), Three.js particle backgrounds, full SPA routing.

---

## Typography

This is the single most impactful anti-slop decision. Most AI-generated sites use Inter, Roboto, or system-ui defaults. Pick something else.

### Decisions

| Element | Choice | Reasoning |
|---|---|---|
| **Display font** | **Space Grotesk** (or Geist Sans) | Geometric, modern, distinctive without being eccentric. Neither appears in the top-5 "AI default" list. Both have excellent weight ranges. |
| **Body font** | **Space Grotesk** (same family, lighter weight) or **Inter** at small sizes only | Using one family keeps the type system simple. Inter is fine at 14–16px for body text — it's specifically at display sizes where it screams "AI default." |
| **Monospace (code)** | **JetBrains Mono** or **Fira Code** | For code blocks, terminal output, and any inline code. Ligatures optional. |
| **Base size** | 16–18px body | Push slightly larger than the 16px default for readability. |
| **Line height** | 1.6–1.7 body | Generous line height = scannable. Not cramped. |
| **Scale** | 1.25 ratio (1 → 1.25 → 1.563 → 1.953 → 2.441) | Define 4-5 heading levels. Use CSS custom properties. |

### Implementation

```css
:root {
  --font-display: 'Space Grotesk', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-xs: 0.64rem;
  --text-sm: 0.8rem;
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.25rem;      /* 20px */
  --text-xl: 1.563rem;     /* 25px */
  --text-2xl: 1.953rem;    /* 31px */
  --text-3xl: 2.441rem;    /* 39px */
}
```

**Load fonts efficiently:** Use `font-display: swap` and preload the woff2 file. Astro handles this well with `@fontsource/` packages. Don't load more than 2 font families.

---

## Color System

### Decisions

One dominant color + one accent. Not a rainbow. Not a purple gradient.

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| **Primary** | `#0A0A0A` (near black) | `#FAFAFA` (near white) | Body text, headings |
| **Surface** | `#FFFFFF` | `#111111` | Page background |
| **Surface-raised** | `#F5F5F5` | `#1A1A1A` | Cards, code blocks |
| **Accent** | `#E8553A` (burnt orange-terracotta) | `#FF6B4A` (brighter orange) | Links, hover states, CTAs, highlights |
| **Accent-muted** | `#E8553A20` | `#FF6B4A20` | Accent backgrounds (low opacity) |
| **Muted** | `#71717A` | `#A1A1AA` | Secondary text, borders |
| **Border** | `#E4E4E7` | `#27272A` | Subtle separators |

### Why burnt orange / terracotta?

- It's warm, distinctive, and **not** in the blue/purple/green spectrum that dominates AI defaults
- It pairs well with both light and dark surfaces
- It suggests "infrastructure" without being cold (think copper wiring, brick, heat)
- It's memorable without being aggressive

### Implementation

```css
:root {
  --color-bg: #FFFFFF;
  --color-surface: #F5F5F5;
  --color-text: #0A0A0A;
  --color-text-muted: #71717A;
  --color-border: #E4E4E7;
  --color-accent: #E8553A;
  --color-accent-muted: #E8553A20;
}

[data-theme="dark"] {
  --color-bg: #111111;
  --color-surface: #1A1A1A;
  --color-text: #FAFAFA;
  --color-text-muted: #A1A1AA;
  --color-border: #27272A;
  --color-accent: #FF6B4A;
  --color-accent-muted: #FF6B4A20;
}
```

### Dark/Light Mode

- Detect system preference via `prefers-color-scheme`
- Allow manual override via toggle (persist in `localStorage`)
- No flash of wrong theme on load (set `data-theme` in a blocking `<script>` before paint)
- Toggle should be accessible: visible, keyboard-operable, with `aria-label`

---

## Motion & Animation

### The Rule

**One orchestrated page-load animation. Everything else is CSS transitions.**

The page-load animation: staggered fade-in of hero elements (name → tagline → supporting line → CTA), total duration under 300ms. After that, the site is still. Hover states and link transitions are fine (150ms ease). Scroll-triggered animations are banned.

### What this looks like

```
0ms    → Page paints (text is visible, unstyled — no invisible-then-appear trick)
0–80ms   → Name fades in + slight translateY
80–160ms → Tagline fades in
160–240ms → Supporting line + tech stack fades in
240–300ms → CTA button fades in
300ms+   → Site is fully interactive and still
```

### Implementation principle

Use CSS `@keyframes` with `animation-delay` for the load sequence. Prefer CSS `transition` for all hover/focus states. Framer Motion is acceptable for the page-load orchestration *only* if you need enter/exit animations between Astro page routes — otherwise, pure CSS suffices.

### Respect `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Layout

### Global

- **Max content width:** 720px for text, 1080px for project showcases with images
- **Horizontal padding:** 24px mobile, 48px desktop
- **Vertical rhythm:** 8px base grid. All spacing values are multiples of 8 (8, 16, 24, 32, 48, 64, 96).
- **No full-bleed hero images** — they're slow and generic. Let typography do the work.

### Navigation

- **Desktop:** Minimal top nav — Name (left) + 3–4 links (right) + theme toggle
- **Mobile:** Hamburger or bottom-sheet nav. Don't use a drawer that covers the whole screen.
- **Active state:** Current page link gets the accent color. No underline animations.

### Project Cards

Not a 3-column grid. Options:
1. **Stacked cards** — Full-width, alternating text/image sides
2. **List with thumbnails** — Project name, one-liner, tech tags on one line; thumbnail on the right
3. **Bento grid** — If you want visual variety. One large featured card (2×2), others 1×1. But make it your own, not the default bento you see on every SaaS landing page.

---

## Performance Budget

| Metric | Target | How |
|---|---|---|
| **Lighthouse Performance** | ≥ 95 | Astro static output, minimal JS |
| **LCP** | < 1.5s | Preload hero font, no hero image, static HTML |
| **CLS** | < 0.05 | Explicit width/height on images, font `display: swap` |
| **FID / INP** | < 100ms | React islands only where needed, no heavy hydration |
| **Total JS** | < 50KB (gzipped) | Astro defaults achieve this. Don't add heavy deps. |
| **Total page weight** | < 200KB | No large images until below the fold. WebP/AVIF for any images. |

---

## Accessibility

Not optional. Not a "nice-to-have." Build it in from the start.

| Requirement | Implementation |
|---|---|
| **Color contrast** | All text/background pairs ≥ 4.5:1 (WCAG AA). Test both themes. |
| **Heading hierarchy** | One `<h1>` per page, logical `<h2>` → `<h3>` structure. No skipping levels. |
| **Skip navigation** | "Skip to content" link as first focusable element. |
| **Keyboard navigable** | All interactive elements reachable via Tab. Focus indicators visible (accent color ring). |
| **ARIA** | Labels on theme toggle, nav landmark, main landmark. Don't over-ARIA — use semantic HTML first. |
| **Reduced motion** | Respect `prefers-reduced-motion` (see Motion section). |
| **Images** | All `<img>` tags have `alt`. Decorative images get `alt=""`. |
| **Link text** | No "click here." Write "View AIstudioProxyAPI-EN on GitHub" not "View project here." |

---

## Anti-Slop Checklist

Before launching, audit the site against every item:

| ❌ Pattern | Present? | Fix |
|---|---|---|
| Purple-to-blue gradient backgrounds | ☐ | Replace with solid surface + accent color |
| Glassmorphism / `backdrop-blur` cards | ☐ | Use solid surface-raised instead |
| Floating orbs or particle animations | ☐ | Remove entirely |
| Fade-on-scroll for above-the-fold content | ☐ | Content should be visible within 300ms |
| Inter/Roboto as display font | ☐ | Switch to Space Grotesk or similar |
| "Hi, I'm [Name] 👋" hero format | ☐ | Use narrative one-liner |
| Logo wall of tech icons | ☐ | List tech inline or as small tags |
| 3-column project card grid | ☐ | Use stacked or bento layout |
| Footer "Built with Next.js and Tailwind" | ☐ | Either omit or make it genuinely personal |
| Hero animation > 300ms | ☐ | Reduce animation budget |
| Lighthouse < 90 on any metric | ☐ | Cut JS, optimize fonts, fix CLS |
| No contact info visible on every page | ☐ | Add to header/footer |
| Generic copy ("passionate about building") | ☐ | Replace with specific, personal statements |

---

## One Surprise Element

Every standout 2026 portfolio has *one* thing you don't expect. This is the anti-slop insurance policy — the thing that makes visitors say "oh, that's clever" and remember the site.

**Recommended for MasuRii:** A command palette (Cmd+K / Ctrl+K) that works like a terminal or code editor. Type to navigate projects, jump to sections, or trigger theme changes. This fits the developer-tooling brand perfectly — it's the kind of UX that someone who builds Pi extensions and OpenCode plugins would naturally create.

**Implementation:** A React island component, ~100 lines of JS, keyboard-driven. Listen for Cmd+K, render a floating search/command input, filter a predefined list of commands (navigate to project, toggle theme, open GitHub, switch language). This is genuinely interactive, not decorative.

---

## Reference: Standout 2026 Portfolios

When you need inspiration, look at these — but **don't copy them**. Copying a famous portfolio is itself an anti-pattern (immediately recognizable as derivative, per Parth Sharma).

| Portfolio | What It Does Well | Takeaway for MasuRii |
|---|---|---|
| **Brittany Chiang** (v4) | Floating sidebar, disappearing header, restraint | Restraint feels intentional — you don't need more things |
| **Lee Robinson** (leerob.io) | Gold-standard Next.js portfolio, MDX case studies | Content depth + live demos = trust |
| **Cassie Evans** | Illustrated desk scene, playful typography | One personal/hand-crafted element is worth 50 polish passes |
| **Kenneth Jimmy** | Immersive scrolling, framed/boxed layout | Unique scroll patterns work when they serve navigation |
| **Sharlee / Adenekan** | Full-screen animated backgrounds, premium dark/light | Dark/light done *well* (contrast, not just inverted) |

---

## Sources

All recommendations are based on the research compiled in [`docs/research/portfolio-design-guidance-2026-04-12.md`](research/portfolio-design-guidance-2026-04-12.md), which cites:

- NNGroup — "State of UX 2026" (2026-01)
- WalterSignal — "Web Design 2026: What Converts vs. AI Slop" (2026-03)
- Parth Sharma — "Why 90% of Developer Portfolios Look the Same" (2026-02)
- Figma — "Top Web Design Trends for 2026"
- Bolt Blog — "How to Create Stunning Websites in 2026"
- Opale UI — "Developer's Guide to Taste in the Age of AI" (2026-02)
- Envato — "11 Motion Design Trends for 2026"
- UX Collective — "Design Trends of 2026"
- ADVICE.md (repository)