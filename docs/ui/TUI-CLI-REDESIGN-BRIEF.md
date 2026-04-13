# TUI/CLI-Inspired Redesign Brief

> **Status:** PENDING APPROVAL  
> **Date:** 2026-04-12  
> **Supersedes:** `docs/04-ui-ux-design-guide.md` (selectively — see §2)  
> **Audience:** Implementation agent(s) executing the redesign  
> **Constraint:** No implementation from this document alone — requires explicit approval first

---

## 1. Goal

Redesign the MasuRii portfolio from a clean-but-generic light-first layout into a **TUI/CLI-inspired, dark-mode-first** experience that:

- Feels authored, useful, and readable — not gimmicky
- Expands project coverage from 6 to 14 showcased entries
- Uses the GitHub profile avatar as the site avatar
- Sources project content from a structured data layer (not hardcoded Astro props)
- Preserves the anti-slop philosophy, performance, and accessibility of the current site

---

## 2. Prior UI Decisions — Superseded vs. Preserved

The existing `docs/04-ui-ux-design-guide.md` and `docs/ui/UI_DESIGN_NOTES.md` contain many sound decisions. This brief **selectively overrides** — it does not discard the whole prior direction.

### Superseded (changed by new directive)

| Prior Decision | Old Value | New Directive | Rationale |
|---|---|---|---|
| **Default theme** | `data-theme="light"` — light-mode first | **Dark-mode first** | User directive. A terminal aesthetic demands dark as default. Light mode remains available via toggle. |
| **Hero layout** | Clean typographic hero with accent bar, no avatar | **Terminal `$ whoami` section** with avatar image | TUX/CLI framing; avatar from GitHub profile. |
| **Section structure** | Traditional named sections (About, Selected Projects, Contact) | **Terminal-command-prefixed sections** (`$ whoami`, `$ ls projects/`, `$ cat skills.md`, `$ contact`) | Reinforces TUI metaphor without breaking semantics. |
| **Project card design** | Simple list card with name + hook + tags | **TUI-styled cards** with screenshot thumbnails, demo badges, status-line metadata | Expanded project set requires visual differentiation; screenshots make TUI/CLI projects legible at a glance. |
| **Featured project count** | 3 on homepage, 6 on `/projects` | **5 featured on homepage, 14 on `/projects`** | Research identified 14 portfolio-worthy projects across 5 clusters. |
| **Page section headings** | "About", "Selected projects", "Let's talk" | **`$ whoami`**, **`$ ls projects/`**, **`$ cat skills.md`**, **`$ contact`** | Terminal metaphor for all section headers. |
| **Theme initialization** | Defaults to light, respects `prefers-color-scheme` | **Defaults to dark**, still respects `prefers-color-scheme` as fallback | Dark-first, but `prefers-color-scheme: light` still works. |
| **Header nav** | Traditional horizontal nav links | **TUI tab-bar / path-bar** style: `~/masurii $` prompt + path-style nav | Reinforces terminal identity in the nav chrome. |

### Preserved (still valid)

| Prior Decision | Keep Because |
|---|---|
| **Typography: Space Grotesk + JetBrains Mono** | Already terminal-appropriate. JetBrains Mono is the natural TUI monospace font. |
| **Burnt orange / terracotta accent** (`#E8553A` light / `#FF6B4A` dark) | Warm, distinctive, not blue/purple. Works well on dark backgrounds. |
| **Color token system** (CSS custom properties) | Solid architecture; just swap the default surface. |
| **Command palette (⌘K)** | Already TUI-like; keep and enhance with project search from data layer. |
| **Anti-slop checklist** | Still the core philosophy — the TUI aesthetic must feel authored, not AI-canned. |
| **Astro 5 + React islands + Tailwind** | Stack stays the same. No new runtime dependencies. |
| **Section-reveal animation** | Keep the IntersectionObserver pattern; just adjust opacity/translate values for dark surfaces. |
| **Accessibility** (skip links, ARIA, focus-visible, reduced-motion) | Non-negotiable; TUI chrome must not break semantics. |
| **JSON-LD structured data** | Keep and expand for new project pages. |
| **MDX for content** | Keep for future case studies; project data lives in JSON, not MDX. |

---

## 3. Information Architecture

### 3.1 Page Map

```
/                        → Home (single-page-style, all sections)
/projects                → Full project listing (14 entries, grouped by cluster)
/projects/[slug]         → Individual project detail page (14 pages)
/404                     → Custom 404 (TUI error aesthetic)
```

The current 5 project detail pages expand to 14. The home page remains a single scroll with all sections — no SPA routing needed.

### 3.2 Home Page Section Order

| Section | TUI Header | Content |
|---|---|---|
| Hero / Identity | `$ whoami` | Avatar (128px, self-hosted), display name, narrative tagline, location, cluster keywords |
| Featured Projects | `$ ls -la featured/` | Top 5 projects with screenshot thumbnails |
| Skills / Stack | `$ cat skills.md` | Core stack tags (same as current About tech section) |
| About / Bio | `$ cat about.md` | 2-paragraph bio (from current About) |
| Contact | `$ contact` | Email + GitHub link |

### 3.3 Projects Page Structure

| Group | TUI Header | Entries |
|---|---|---|
| AI Infrastructure | `# ai-infra` | AIstudioProxyAPI-EN, FBScrapeIdeas, MasuSenseiBotV3-Agent |
| Dev Tooling — OpenCode & Pi | `# dev-tooling` | pi-tool-display, opencode-smart-voice-notify, pi-rtk-optimizer, opencode-godot-lsp, pi-permission-system, pi-image-tools, pi-multi-auth |
| Full-Stack Products | `# products` | AudioScholar, CITUCourseBuilder, Luv-Charms-E-commerce |
| Systems & Crates | `# systems` | RustDupe |
| Templates | `# templates` | (grouped card: 6 templates with live demos) |
| Userscripts | `# userscripts` | (grouped card: WTR-Lab Enhancement Suite) |
| Transport / RecursiveDev | `# transport` | (grouped card: JeepMe, ReCursor) |

Secondary/supporting Pi extensions can be collapsed under a `<details>` element to avoid visual overload while still showing ecosystem breadth.

---

## 4. Structured Content Data Model

### 4.1 Single Source of Truth

Create `src/data/projects.ts` — a typed TypeScript data file imported by all project pages and components. This replaces the current pattern of hardcoded project arrays in `ProjectHighlights.astro` and `src/pages/projects/index.astro`.

### 4.2 Data Schema

```typescript
interface ProjectScreenshot {
  url: string;         // stable image URL (raw.githubusercontent.com or github/user-attachments)
  alt: string;         // descriptive alt text
  width?: number;      // for aspect-rantic hint
  height?: number;
}

interface Project {
  // Identity
  id: string;                    // kebab-case slug (e.g. "pi-tool-display")
  title: string;                 // display name
  tagline: string;               // one-line hook

  // Metadata
  repo: string;                   // full GitHub URL
  demo?: string;                  // live deployment URL (only confirmed ones)
  language: string;               // primary language
  stars: number;                  // GitHub star count (as of 2026-04-12)
  forks: number;                  // GitHub fork count
  topics: string[];               // from repo topics
  lastUpdated: string;            // YYYY-MM-DD from GitHub

  // Content
  description: string;            // 2-4 sentence description
  screenshots: ProjectScreenshot[];

  // Categorization
  cluster: 'ai-infra' | 'dev-tooling' | 'products' | 'systems' | 'templates' | 'userscripts' | 'transport';
  featured: boolean;              // show on homepage
  featuredOrder: number;          // sort order for homepage featured section

  // External references (optional)
  cratesUrl?: string;             // e.g. "https://crates.io/crates/rustdupe"
  npmUrl?: string;                // for Pi/OpenCode extensions
}
```

### 4.3 Data File

`src/data/projects.ts` exports:

```typescript
export const projects: Project[] = [ /* all 14 entries */ ];
export const featuredProjects: Project[] = projects.filter(p => p.featured).sort(/* by featuredOrder */);
export const projectsByCluster: Record<string, Project[]> = /* grouped by cluster */;
```

### 4.4 Individual Project Pages

Auto-generate from data using Astro `getStaticPaths`:

```typescript
// src/pages/projects/[slug].astro
export function getStaticPaths() {
  return projects.map(p => ({ params: { slug: p.id }, props: { project: p } }));
}
```

This eliminates the current 5 hand-crafted project page files and replaces them with one template.

---

## 5. Visual Design Specification

### 5.1 Color System (Dark-First)

The dark palette becomes primary; the light palette remains for optional toggle.

| Token | Dark (Primary) | Light (Fallback) | Usage |
|---|---|---|---|
| **bg** | `#0D0D0D` | `#FFFFFF` | Page background — slightly deeper than current `#111111` for terminal feel |
| **surface** | `#151515` | `#F5F5F5` | Cards, code blocks, raised surfaces |
| **surface-raised** | `#1C1C1C` | `#EBEBEB` | Nested elevated surfaces |
| **text** | `#E0E0E0` | `#0A0A0A` | Primary text — slightly softened from pure white for terminal comfort |
| **text-muted** | `#888888` | `#71717A` | Secondary text, borders on text |
| **accent** | `#FF6B4A` | `#E8553A` | Links, highlights, active states, prompt color |
| **accent-dim** | `#FF6B4A15` | `#E8553A20` | Accent backgrounds at low opacity |
| **border** | `#2A2A2A` | `#E4E4E7` | Subtle separators |
| **green** | `#4ADE80` | `#16A34A` | Status indicators (success, live demo badge) |
| **yellow** | `#FACC15` | `#CA8A04` | Warning/highlight indicators |

**New tokens** added for TUI chrome:
- `--color-prompt`: accent color, used for `$` and `#` prefixes
- `--color-cmd`: `#E0E0E0`, used for command text (`whoami`, `ls`)
- `--color-flag`: `#888888`, used for flags/options (`-la`, `--help`)
- `--color-success`: green token, for "Live demo" badges

### 5.2 TUI Chrome Patterns

#### Terminal Prompt Section Headers

All major section headings use a terminal-prompt prefix:

```html
<div class="flex items-center gap-2 mb-6">
  <span class="text-accent font-mono text-sm">$</span>
  <span class="font-mono text-sm text-text">whoami</span>
  <span class="flex-1 border-b border-border ml-2"></span>
</div>
```

This renders as: `$ whoami ────────────`

The command text is the semantic heading (`<h2>` visually hidden), ensuring accessibility while the visual is the prompt.

#### Path-Style Header

The sticky header nav becomes:

```
~/masurii $ [home] [projects] [about] [contact]                         [☀/🌙] [⌘K]
```

- `~/masurii $` prefix in monospace, accent color
- Nav items as "file path" segments
- Theme toggle and command palette preserved

#### Status Line / Footer Bar

The footer simplifies to a terminal status-bar aesthetic:

```
── MasuRii @ Cebu, PH ─── Astro + Tailwind ─── © 2026 ──
```

#### Project Card TUI Style

Each project card mimics a terminal entry:

```
┌─ pi-tool-display ──────────────────────────── 52★ · 8 forks ──┐
│                                                                │
│  [Screenshot thumbnail]                                        │
│                                                                │
│  Compact tool rendering, diff visualization, and output        │
│  truncation for Pi TUI                                        │
│                                                                │
│  TypeScript · TUI · Extension API                              │
│                                                                │
│  → View project    🔗 Live demo                               │
└────────────────────────────────────────────────────────────────┘
```

Implementation uses CSS borders and monospace metadata — not actual box-drawing chars (those break on some fonts/screens). The visual impression is "terminal card" without the accessibility traps of literal ASCII art.

### 5.3 Avatar Integration

- **Source:** Download `https://avatars.githubusercontent.com/u/21298898?v=4` and save to `public/avatar.png`
- **Hero placement:** 128×128px, rounded (not circle), with a 2px accent border
- **Header:** 32×32px inline next to `~/masurii $` prompt
- **Favicon:** Regenerate `public/favicon.svg` derived from the avatar
- **OG image:** Update to include avatar in the redesigned layout

### 5.4 Screenshot / Demo Display

**Project cards on listing page:**
- If a project has screenshots, show the first one as a thumbnail (max-height: 180px, `object-fit: cover`, rounded corners, with a subtle border)
- If no screenshot, show a monospace placeholder: `[ no preview ]`
- Screenshots lazy-load (`loading="lazy"`)
- For GitHub user-attachments URLs, reference them directly (they are CDN-stable)
- For raw.githubusercontent.com URLs, reference directly

**Project detail pages:**
- Gallery of all confirmed screenshots below the description
- Demo link gets a green "● Live" badge if available
- Crate/npm link gets appropriate badge

### 5.5 Motion & Animation

The TUI aesthetic calls for **less motion**, not more:

| Element | Before | After |
|---|---|---|
| Hero stagger | 360ms fade-in-up | 200ms single fade-in (terminal "blink on") |
| Section reveal | 0.4s fade + 12px translate (IntersectionObserver) | **0.2s fade only** — no translate. Terminals don't slide. |
| Project card hover | Padding increase + surface tint | Minimal: slight brightness change + accent underline. No elevation. |
| Command palette | 120ms enter/exit | **Keep as-is** — already TUI-appropriate. |
| Mobile menu | max-height slide | **Keep as-is** — functional. |

`prefers-reduced-motion` still enforced: all durations → 0.01ms.

### 5.6 Typography Adjustments

Space Grotesk + JetBrains Mono are already ideal. The TUI shift means:

- Increase JetBrains Mono usage: **all section headers, project metadata, nav items, and prompt prefixes** should use `--font-mono` (JetBrains Mono)
- Space Grotesk remains for: **body text, project taglines, descriptions**
- Monospace size: slightly bump from `0.875em` to `0.9em` for better legibility on dark backgrounds
- Add `font-variant-ligatures: none` to JetBrains Mono blocks in the TUI chrome (ligatures in prompts look wrong)

---

## 6. Acceptance Criteria

These are concrete, verifiable criteria for each requirement.

### 6.1 Dark-Mode Default

- [ ] `<html>` renders with `data-theme="dark"` when no stored preference and no system preference
- [ ] `<html>` renders with `data-theme="dark"` when system prefers dark
- [ ] `<html>` renders with `data-theme="light"` **only** when system prefers light AND no stored override
- [ ] Stored theme (`localStorage`) takes precedence over system preference in all cases
- [ ] Theme toggle still works and persists across page navigations
- [ ] No flash-of-wrong-theme on load (current inline script pattern preserved)

### 6.2 Avatar Use

- [ ] `public/avatar.png` exists (downloaded from GitHub)
- [ ] Avatar renders at 128×128px in the hero `$ whoami` section
- [ ] Avatar renders at 32×32px in the header prompt
- [ ] Avatar has `alt="MasuRii"` attribute
- [ ] No external image requests to `avatars.githubusercontent.com` on any page (self-hosted)
- [ ] `<link rel="icon" ...>` references avatar-derived favicon

### 6.3 Expanded Project Coverage

- [ ] `src/data/projects.ts` contains **14 project entries** with complete data per schema in §4.2
- [ ] Homepage featured section shows **5 projects** (not 3)
- [ ] `/projects` page shows all 14 entries, grouped by cluster
- [ ] Pi ecosystem supporting projects (7 entries) are visible but collapsible
- [ ] Templates, userscripts, and transport groups each show as a single grouped card

### 6.4 Confirmed Demos

- [ ] Every project with a confirmed live demo shows a green "● Live" badge linking to the demo URL
- [ ] Confirmed demo URLs:
  - AudioScholar → `https://audioscholar.vercel.app/`
  - CITUCourseBuilder → `https://masurii.github.io/CITUCourseBuilder/`
  - Luv-Charms-E-commerce → `https://luv-charms-e-commerce.vercel.app`
  - RustDupe → `https://crates.io/crates/rustdupe`
  - Template group: each template links to its confirmed GH Pages demo
- [ ] Projects without demos show no demo badge (no placeholder, no "no demo" text)

### 6.5 Confirmed Screenshots

- [ ] Project cards on `/projects` show a screenshot thumbnail when `screenshots.length > 0`
- [ ] Screenshot `<img>` tags have descriptive `alt` text
- [ ] Screenshots use `loading="lazy"`
- [ ] Confirmed screenshot URLs used (from `docs/research/portfolio-content-inventory-2026-04-12.md` §5):
  - pi-tool-display: `https://github.com/user-attachments/assets/777944a2-18b2-4642-b035-2c703a5abb1b`
  - opencode-smart-voice-notify: `https://github.com/user-attachments/assets/52ccf357-2548-400b-a346-6362f2fc3180`
  - pi-rtk-optimizer: `https://github.com/user-attachments/assets/f4536889-62ec-429a-984e-dc0de9f1f709`
  - FBScrapeIdeas: `https://raw.githubusercontent.com/MasuRii/FBScrapeIdeas/master/assets/CLIScreenshot_2.png`
  - RustDupe: `https://raw.githubusercontent.com/MasuRii/RustDupe/master/public/images/rustdupe_tuiscreenshot.png`
  - pi-permission-system, pi-image-tools, pi-multi-auth: (their confirmed user-attachments URLs)
- [ ] Projects without screenshots show a minimal monospace `[ no preview ]` placeholder
- [ ] Project detail pages show a full screenshot gallery of all confirmed images for that project

### 6.6 Terminal-Inspired Interactions

- [ ] All home page sections use terminal-prompt headers (`$ whoami`, `$ ls -la featured/`, `$ cat skills.md`, `$ cat about.md`, `$ contact`)
- [ ] Header nav renders as a path-prompt: `~/masurii $ home projects about contact`
- [ ] Command palette (⌘K) still functions and is populated from `src/data/projects.ts`
- [ ] Footer renders as a minimal status-line (no multi-column layout)
- [ ] Project cards use TUI-style visual language (monospace metadata, border styling)
- [ ] No ASCII box-drawing characters used in semantic HTML (accessibility)
- [ ] Keyboard navigation remains functional (Tab, Enter, Escape patterns)

### 6.7 Non-Regression

- [ ] `npm run build` completes with zero errors
- [ ] All 15+ pages generate correctly (home + projects index + 14 detail pages + 404)
- [ ] Lighthouse Performance score ≥ 95 on `/`
- [ ] Lighthouse Accessibility score ≥ 95 on `/`
- [ ] `prefers-reduced-motion` disables all animations
- [ ] Skip-to-content link works
- [ ] JSON-LD `Person` and `WebSite` schemas still present on home page
- [ ] JSON-LD `SoftwareSourceCode` schema present on project detail pages
- [ ] Total gzipped JS ≤ 70KB (current is ~64KB; data file adds ~3KB)
- [ `<meta name="theme-color">` updated to dark accent value (`#FF6B4A`)

---

## 7. Implementation Todo List

### Phase 1: Data Layer & Avatar (S) — Dependencies: None

- [ ] 1. Download GitHub avatar to `public/avatar.png` [XS, Risk: L]
- [ ] 2. Create `src/data/projects.ts` with the `Project` and `ProjectScreenshot` interfaces [XS, Risk: L]
- [ ] 3. Populate `src/data/projects.ts` with all 14 project entries using confirmed data from `docs/research/portfolio-content-inventory-2026-04-12.md` [M, Risk: L]
- [ ] 4. Export `featuredProjects` and `projectsByCluster` computed arrays from `src/data/projects.ts` [XS, Risk: L]
- [ ] 5. Verify `src/data/projects.ts` compiles with `npx tsc --noEmit` [XS, Risk: L]

### Phase 2: Color & Theme System (S) — Dependencies: None

- [ ] 6. Update `src/styles/global.css` dark tokens: `--color-bg: #0D0D0D`, `--color-surface: #151515`, `--color-surface-raised: #1C1C1C`, `--color-text: #E0E0E0`, `--color-text-muted: #888888`, `--color-border: #2A2A2A` [S, Risk: L]
- [ ] 7. Add new TUI tokens to `global.css`: `--color-prompt`, `--color-cmd`, `--color-flag`, `--color-success`, `--color-green`, `--color-yellow` [XS, Risk: L]
- [ ] 8. Change `BaseLayout.astro` default theme initialization from `prefersDark ? 'dark' : 'light'` to always `'dark'` when no stored preference [XS, Risk: L]
- [ ] 9. Update `<meta name="theme-color">` to `#FF6B4A` (dark accent) [XS, Risk: L]
- [ ] 10. Update `<html>` default attribute from `data-theme="light"` to `data-theme="dark"` [XS, Risk: L]

### Phase 3: Header TUI Redesign (S) — Dependencies: Phase 2

- [ ] 11. Redesign `Header.astro` to path-prompt style: `~/masurii $ home projects about contact` [S, Risk: L]
- [ ] 12. Add 32×32 avatar image next to path prompt in header [XS, Risk: L]
- [ ] 13. Preserve mobile menu, theme toggle, and ⌘K hint functionality [S, Risk: M]
- [ ] 14. Ensure active nav item highlighted with accent color [XS, Risk: L]

### Phase 4: Home Page TUI Redesign (M) — Dependencies: Phase 1, 2, 3

- [ ] 15. Redesign `Hero.astro` as `$ whoami` section with avatar + name + tagline [S, Risk: L]
- [ ] 16. Reduce hero animation: single 200ms fade-in (remove stagger and translate) [XS, Risk: L]
- [ ] 17. Redesign `ProjectHighlights.astro` as `$ ls -la featured/` with 5 featured projects from data file [S, Risk: L]
- [ ] 18. Add screenshot thumbnails to featured project cards [S, Risk: L]
- [ ] 19. Add "● Live" demo badges to project cards where applicable [XS, Risk: L]
- [ ] 20. Add `$ cat skills.md` section (move tech stack from About into its own section) [XS, Risk: L]
- [ ] 21. Redesign `About.astro` as `$ cat about.md` section [XS, Risk: L]
- [ ] 22. Redesign `Contact.astro` as `$ contact` section [XS, Risk: L]
- [ ] 23. Reduce section-reveal animation from 0.4s fade+translate to 0.2s fade-only [XS, Risk: L]

### Phase 5: Projects Page Redesign (M) — Dependencies: Phase 1, 2

- [ ] 24. Redesign `src/pages/projects/index.astro` to use `projectsByCluster` from data file [S, Risk: L]
- [ ] 25. Group projects under terminal-comment cluster headers (`# ai-infra`, `# dev-tooling`, etc.) [S, Risk: L]
- [ ] 26. Redesign `ProjectCard.astro` with TUI styling: monospace metadata, border chrome, screenshot thumb [S, Risk: M]
- [ ] 27. Add `<details>` collapsible section for 7 secondary Pi extensions [XS, Risk: L]
- [ ] 28. Create grouped cards for: templates (6), userscripts (5), transport (2) [S, Risk: L]

### Phase 6: Project Detail Pages (M) — Dependencies: Phase 1

- [ ] 29. Create `src/pages/projects/[slug].astro` with Astro `getStaticPaths` from `src/data/projects.ts` [S, Risk: M]
- [ ] 30. Delete 5 existing hand-crafted project pages (`aistudio-proxy-api.astro`, `audioscholar.astro`, `fbscrapeideas.astro`, `opencode-smart-voice-notify.astro`, `pi-tool-display.astro`, `rustdupe.astro`) [XS, Risk: L]
- [ ] 31. Implement detail page layout: title, tagline, description, screenshot gallery, demo link, repo link, star/fork count, topics [S, Risk: L]
- [ ] 32. Add `SoftwareSourceCode` JSON-LD to the detail page template [XS, Risk: L]

### Phase 7: Footer & 404 (S) — Dependencies: Phase 2

- [ ] 33. Redesign `Footer.astro` as minimal terminal status-line [XS, Risk: L]
- [ ] 34. Redesign `404.astro` with TUI error aesthetic (e.g. `command not found: <path>`) [XS, Risk: L]

### Phase 8: Command Palette Update (S) — Dependencies: Phase 1

- [ ] 35. Update `CommandPalette.tsx` to populate project commands from `src/data/projects.ts` (import data at build time) [S, Risk: L]
- [ ] 36. Remove hardcoded project command entries from `CommandPalette.tsx` [XS, Risk: L]

### Phase 9: Verification (S) — Dependencies: All

- [ ] 37. Run `npm run build` and confirm zero errors [XS, Risk: L]
- [ ] 38. Run `npm run preview` and manually verify home page renders with dark theme, avatar, 5 featured projects with screenshots [XS, Risk: L]
- [ ] 39. Verify `/projects` page shows all 14 entries grouped by cluster [XS, Risk: L]
- [ ] 40. Verify all 14 project detail pages generate and are accessible [XS, Risk: L]
- [ ] 41. Verify theme toggle works and persists across navigations [XS, Risk: L]
- [ ] 42. Verify light-mode palette is not visually broken [XS, Risk: L]
- [ ] 43. Run Lighthouse audit on `/` and confirm Performance ≥ 95, Accessibility ≥ 95 [S, Risk: M]
- [ ] 44. Verify `prefers-reduced-motion` disables all animations [XS, Risk: L]

---

## 8. Anti-Slop Guardrails for TUI Aesthetic

A TUI/CLI aesthetic can easily become its own form of AI slop — generic "hacker terminal" with scanlines, CRT effects, and Matrix-green text. This redesign must avoid that.

### Required

| Guardrail | Enforcement |
|---|---|
| **No CRT/scanline effects** | No CSS filters, no overlay images, no phosphor glow |
| **No Matrix/cyberpunk animations** | No falling characters, no neon pulse, no glitch text |
| **No fake terminal chrome** | No blinking cursors, no ASCII borders as content structure |
| **Monospace used purposefully** | JetBrains Mono for prompts, metadata, code. Not for paragraphs of body text. |
| **Green used sparingly** | Green (`#4ADE80`) only for "Live" status badges and success indicators. Not as a primary text color. |
| **Dark is for readability** | `#0D0D0D` background with `#E0E0E0` text provides high contrast. Not `#000` with `#00FF00`. |
| **Content over aesthetic** | If a TUI element obscures the project information, remove the element. |

### The Litmus Test

> If you remove the `$` prefixes and the monospace metadata, does the page still look like a well-designed portfolio? It should. The TUI is a flavor, not a crutch.

---

## 9. File Map Summary

### New Files

| File | Purpose |
|---|---|
| `src/data/projects.ts` | Structured project data (14 entries, typed) |
| `src/pages/projects/[slug].astro` | Dynamic project detail page template |
| `public/avatar.png` | Self-hosted GitHub avatar |

### Modified Files

| File | Change |
|---|---|
| `src/styles/global.css` | Dark-first color tokens, new TUI tokens, reduced animation durations |
| `src/layouts/BaseLayout.astro` | Default dark theme, theme-color meta, `<html data-theme="dark">` |
| `src/components/Header.astro` | Path-prompt TUI style + avatar |
| `src/components/Hero.astro` | `$ whoami` section with avatar |
| `src/components/ProjectHighlights.astro` | `$ ls -la featured/` — 5 projects from data, screenshot thumbs |
| `src/components/ProjectCard.astro` | TUI-styled cards with screenshot, demo badge |
| `src/components/About.astro` | `$ cat about.md` header |
| `src/components/Contact.astro` | `$ contact` header |
| `src/components/Footer.astro` | Terminal status-line |
| `src/components/CommandPalette.tsx` | Commands from data file |
| `src/pages/index.astro` | New section order + `$ cat skills.md` section |
| `src/pages/projects/index.astro` | 14 projects from data, grouped by cluster |
| `src/pages/404.astro` | TUI error aesthetic |
| `public/favicon.svg` | Avatar-derived favicon |

### Deleted Files

| File | Reason |
|---|---|
| `src/pages/projects/aistudio-proxy-api.astro` | Replaced by `[slug].astro` |
| `src/pages/projects/audioscholar.astro` | Replaced by `[slug].astro` |
| `src/pages/projects/fbscrapeideas.astro` | Replaced by `[slug].astro` |
| `src/pages/projects/opencode-smart-voice-notify.astro` | Replaced by `[slug].astro` |
| `src/pages/projects/pi-tool-display.astro` | Replaced by `[slug].astro` |
| `src/pages/projects/rustdupe.astro` | Replaced by `[slug].astro` |

---

## 10. 14 Confirmed Projects for Data Layer

These entries populate `src/data/projects.ts`. All data sourced from `docs/research/portfolio-content-inventory-2026-04-12.md` and `docs/research/github-projects-catalog-2026-04-12.md`.

| # | id | title | cluster | featured | stars | demo? | screenshots? |
|---|---|---|---|---|---|---|---|
| 1 | `pi-tool-display` | pi-tool-display | dev-tooling | ✅ (order 1) | 52 | ❌ | ✅ 5 images |
| 2 | `opencode-smart-voice-notify` | opencode-smart-voice-notify | dev-tooling | ✅ (order 2) | 52 | ❌ | ✅ 1 image |
| 3 | `aistudio-proxy-api` | AIstudioProxyAPI-EN | ai-infra | ✅ (order 3) | 35 | ❌ | ❌ |
| 4 | `fbscrapeideas` | FBScrapeIdeas | ai-infra | ✅ (order 4) | 35 | ❌ | ✅ 1 image |
| 5 | `rustdupe` | RustDupe | systems | ✅ (order 5) | 2 | ✅ crates.io | ✅ 1 image |
| 6 | `pi-rtk-optimizer` | pi-rtk-optimizer | dev-tooling | ❌ | 19 | ❌ | ✅ 1 image |
| 7 | `opencode-godot-lsp` | opencode-godot-lsp | dev-tooling | ❌ | 13 | ❌ | ❌ |
| 8 | `pi-permission-system` | pi-permission-system | dev-tooling | ❌ | 10 | ❌ | ✅ 1 image |
| 9 | `pi-image-tools` | pi-image-tools | dev-tooling | ❌ | 5 | ❌ | ✅ 1 image |
| 10 | `pi-multi-auth` | pi-multi-auth | dev-tooling | ❌ | 3 | ❌ | ✅ 1 image |
| 11 | `audioscholar` | AudioScholar | products | ❌ | 1 | ✅ Vercel | Logo only |
| 12 | `citu-course-builder` | CITUCourseBuilder | products | ❌ | 2 | ✅ GH Pages | ✅ in-repo |
| 13 | `luv-charms-ecommerce` | Luv-Charms E-commerce | products | ❌ | 1 | ✅ Vercel | ✅ in-repo |
| 14 | `masusensei-bot` | MasuSenseiBotV3-Agent | ai-infra | ❌ | 1 | ❌ | ❌ |

**Grouped entries (not individual cards, but single grouped cards):**

| Group id | title | cluster | entries | demos? | screenshots? |
|---|---|---|---|---|---|
| `templates` | Website Templates | templates | 6 (dev-portfolio, restaurant, ModernSaaS, photography, travel, education) | ✅ all on GH Pages | ✅ each has a preview image |
| `userscripts` | WTR-Lab Enhancement Suite | userscripts | 5 (image-gen, reviewer, term-replacer, inconsistency-finder, enhancer) | ❌ | ✅ image-gen has demo GIF |
| `transport` | RecursiveDev Transport | transport | 3 (Pasahe, JeepMe, ReCursor) | ✅ JeepMe + ReCursor on GH Pages | ❌ |

---

## 11. Change Log

| Date | Change | Author |
|---|---|---|
| 2026-04-12 | Initial brief created | Architect agent |

---

*This brief requires explicit "Yes, proceed" approval before implementation begins.*