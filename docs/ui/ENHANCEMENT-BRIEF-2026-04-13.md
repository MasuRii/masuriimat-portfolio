# Enhancement Brief: TUI Portfolio Second Pass

> **Status:** PENDING APPROVAL
> **Date:** 2026-04-13
> **Supersedes:** None (additive to `docs/ui/TUI-CLI-REDESIGN-BRIEF.md`)
> **Audience:** Implementation agent(s) executing enhancements
> **Constraint:** No implementation without explicit approval

---

## 0. Purpose

This brief specifies **incremental enhancements** to the current live TUI/CLI portfolio. It does NOT replace the original redesign brief — it builds on it by addressing six user priorities:

1. **More animations** (tasteful, TUI-authentic, no gimmicks)
2. **More unique features** (neofetch profile, tree listing, easter eggs)
3. **Searching** (enhanced command palette + project page filters/sorting)
4. **Richer confirmed contact info** (LinkedIn, Facebook, Greasyfork, RecursiveDev org)
5. **Font 404 remediation** (JetBrains Mono woff2 path resolution)
6. **Recruiter-friendly project organization** (tier system, sort/filter, URL presets)

All content uses **confirmed public data only**. No invented LinkedIn URLs, emails, or metrics.

---

## 1. JetBrains Mono Font 404 Remediation

### 1.1 Problem

Build log shows Vite warnings:
```
./files/jetbrains-mono-latin-400-normal.woff2 referenced in ./files/jetbrains-mono-latin-400-normal.woff2 didn't resolve at build time, it will remain unchanged to be resolved at runtime
```

The `@fontsource/jetbrains-mono/400.css` and `500.css` files imported in `BaseLayout.astro` contain `url(./files/...)` relative path references. Vite correctly resolves and hashes the `.woff` files into `dist/_astro/`, and properly resolves some `cyrillic` subset `.woff2` files, but leaves `./files/` relative paths for `latin`, `latin-ext`, `greek`, `vietnamese`, and `cyrillic-ext` subset woff2 files. At runtime, `dist/files/` does not exist → **404 on every woff2 request** for those subsets. The font still renders (falls back to woff), but the 404s are noisy.

**Verified:** Space Grotesk imports resolve correctly (all woff2 → `/_astro/` hashes). Only JetBrains Mono woff2 is broken.

### 1.2 Root Cause

The `ssr.noExternal` config in `astro.config.mjs` forces `@fontsource/jetbrains-mono` through SSR processing, but Vite's CSS bundler fails to resolve the `./files/` relative woff2 URLs within that context, causing them to pass through as-is.

### 1.3 Fix Strategy

**Option A (Recommended):** Import subset-specific CSS files that only include the `latin` subset (sufficient for an English portfolio), removing the unresolved multi-subset `./files/` references entirely.

**Option B (Fallback):** Copy the required woff2 files to `public/files/` as a static safety net. Ugly but guaranteed.

**Option C (Alternative):** Remove `@fontsource/jetbrains-mono` from `ssr.noExternal` and let Vite process it normally, which may allow proper resolution.

### 1.4 Implementation Spec

In `src/layouts/BaseLayout.astro`, replace:
```typescript
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
```

With:
```typescript
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
```

Also add `latin-ext` if extended Latin coverage is needed:
```typescript
import '@fontsource/jetbrains-mono/latin-ext-400.css';
import '@fontsource/jetbrains-mono/latin-ext-500.css';
```

**Acceptance criteria:**
- [ ] `npm run build` produces zero `./files/... didn't resolve` warnings
- [ ] Built CSS in `dist/` contains NO `url(./files/...)` references for JetBrains Mono
- [ ] All JetBrains Mono woff2 files are hashed into `dist/_astro/`
- [ ] `npm run preview` or serving `dist/` shows no 404s for font files in browser dev tools
- [ ] JetBrains Mono renders correctly on both macOS and Windows browsers

---

## 2. Animations

### 2.1 Current State

The site already has:
- Section-reveal via `IntersectionObserver` (`.section-reveal` → `.revealed`)
- `animate-stagger-1` through `animate-stagger-5` classes for hero entry
- CSS transitions on hover states

### 2.2 New Animations (Prioritized)

All animations MUST respect `prefers-reduced-motion: reduce` — skip or make instant.

| # | Animation | Where | Type | Effort | Anti-Slop Check |
|---|-----------|-------|------|--------|-----------------|
| A1 | **Typing effect on TUI prompts** | All `$ whoami`, `$ ls` etc. headings | CSS `@keyframes` typing + `steps()` on `max-width` overflow | S | ✅ Subtle, terminal-authentic, stops after reveal |
| A2 | **Blinking cursor on active prompt** | Hero section `$ whoami` | CSS `@keyframes blink` on `::after` pseudo-element | XS | ✅ Standard terminal behavior, no JS |
| A3 | **Staggered project card entry** | Projects page and featured section | Extend existing IntersectionObserver to add per-card delay via `transition-delay` | S | ✅ Already have pattern, just per-card delays |
| A4 | **ASCII progress bars for skills** | `"$ cat skills.md"` section | Static rendered `[████░░░░] 64%` with reveal animation | S | ✅ TUI-native, not a smooth animated bar |
| A5 | **Smooth scroll-snap between sections** | Homepage | `scroll-snap-type: y proximity` on html | XS | ✅ Subtle, helps recruiter scan |
| A6 | **Glitch effect on 404** | `/404` page | CSS `@keyframes` glitch on text with `clip-path` | XS | ✅ Terminal-error aesthetic, isolated page |
| A7 | **Matrix rain easter egg** | Triggered by `matrix` command in palette | Canvas overlay, 5s self-dismissing | M | ⚠️ Ephemeral, reduced-motion kills it |

### 2.3 Animation Implementation Details

**A1: TUI Prompt Typing Effect**
- Apply to elements with `.tui-heading` class
- Use pure CSS: `overflow: hidden; white-space: nowrap; border-right: 2px solid var(--color-accent); animation: typing 0.8s steps(20) forwards, blink-caret 0.75s step-end infinite`
- Set `width: 0` initially → `width: fit-content` on `.revealed`
- For `prefers-reduced-motion`: set `width: fit-content` immediately, skip animation
- Add `will-change: width` for performance

**A2: Blinking Cursor**
- After `.tui-heading` typing completes, show blinking block cursor
- `::after` content: `█` (U+2588), animation: `@keyframes blink { 50% { opacity: 0; } }`
- Disappears when user scrolls past section (or after 3 seconds of idle)

**A4: ASCII Progress Bars**
- Replace current skill tags with a structured skill display:
  ```
  TypeScript  [██████████] 100%  ██████████░░░░░░░░░░░░  50%
  Python      [█████████░]  90%
  Rust        [██████░░░░]  60%
  React       [████████░░]  80%
  ```
- Percentages are illustrative proficiency levels, not measured metrics
- Use `font-mono` rendering, color-coded fill with `var(--color-accent)`
- Add `role="progressbar"` + `aria-valuenow` for accessibility

**A7: Matrix Rain Easter Egg**
- Add `"matrix"` command to CommandPalette actions
- On trigger: overlay a `<canvas>` element over viewport
- Render falling kanji/latin characters in green (`var(--color-success)`)
- Auto-dismiss after 5 seconds or on `Escape`/click
- Wrap in `if (prefersReducedMotion) return`

### 2.4 Acceptance Criteria

- [ ] All 7 animations render on Chrome/Firefox/Safari latest
- [ ] `prefers-reduced-motion: reduce` disables ALL animations (instant reveal, no typing, no cursor blink, no matrix)
- [ ] No cumulative layout shift (CLS > 0.1) on homepage load
- [ ] Lighthouse Performance score stays ≥ 90
- [ ] Typing effect completes in < 1s per heading
- [ ] No animation runs on elements not in viewport

---

## 3. Unique Features

### 3.1 Neofetch-Style Profile Block

Replace the current hero layout with a `neofetch`-inspired ASCII-art side-by-side:

```
   ┌─────────┐    MasuRii@masurii.dev
   │  AVATAR  │    ─────────────────────
   │  80x80   │    OS:        Cebu, Philippines
   └─────────┘    Host:      @RecursiveDev
                  Kernel:    TypeScript / Python / Rust
                  Shell:     astro 5 + react 19
                  Packages:  13 extensions shipped
                  Uptime:    3+ years building
                  Stars:     200+ across repos
                  Repos:     51 public
                  Theme:     dark [██████████]
                  ╭─────────────────────╮
                  │ AI · DevTools · Web │
                  ╰─────────────────────╯
```

**Implementation:**
- Render in `Hero.astro` as a CSS grid (avatar left, metadata right)
- Each row is a `<div>` with `font-mono` key-value styling
- Color-coded keys: location → `--color-accent`, org → `--color-green`, stack → `--color-yellow`
- The "theme" row shows a live mini bar for the current theme setting
- On mobile: stack vertically (avatar above, metadata below)

**Recruiter value:** Recruiters spend 55–90 seconds on first scan. Neofetch format gives all key signals in one block — location, stack, org, activity depth.

**Acceptance criteria:**
- [ ] Neofetch block renders on homepage in place of current hero
- [ ] All key-value data comes from confirmed public sources (no invention)
- [ ] Responsive: side-by-side on ≥640px, stacked on mobile
- [ ] `aria-label` on the block for screen readers
- [ ] No layout shift on font load (use `font-display: swap` + reserved space)

### 3.2 `tree` Command Project Listing

On the `/projects` page, add an optional `tree` view mode:

```
$ tree ~/projects/
~/projects/
├── ai-infra/
│   ├── AIstudioProxyAPI-EN  ★35
│   ├── FBScrapeIdeas        ★35
│   └── MasuSenseiBotV3      ★1
├── dev-tooling/
│   ├── pi-tool-display      ★52
│   ├── opencode-smart-voice ★52
│   └── [7 more extensions]
├── products/
│   ├── AudioScholar
│   ├── CITUCourseBuilder
│   └── Luv-Charms
├── systems/
│   └── RustDupe
└── collections/
    ├── Pi Ecosystem (13 ext, 200★)
    ├── WTR-Lab Suite (5 scripts)
    ├── Templates (6 demos)
    └── Transport (JeepMe, ReCursor)
```

**Implementation:**
- Add a view toggle button in the projects page header: `[Cards] [Tree]`
- Tree view renders the above using `font-mono` with Unicode box-drawing chars
- Each item is a link (`<a>` tag) to its project detail page
- Default view: Cards (current). Tree view persists in `localStorage`
- Toggle is keyboard-accessible

**Recruiter value:** The `tree` view gives instant mental model of breadth and depth without scrolling through cards. It shows the ecosystem structure at a glance.

**Acceptance criteria:**
- [ ] Toggle renders tree-format project listing with correct hierarchy
- [ ] Default view remains cards
- [ ] Each entry in tree links to its detail page
- [ ] Works on mobile (horizontal scroll for wide tree lines)
- [ ] Star counts shown inline, no external API calls at runtime

### 3.3 VFS (Virtual File System) Navigation Commands

Add terminal-style navigation commands to the command palette:

| Command | Action |
|---------|--------|
| `cd ~/about` | Scroll to about section |
| `cd ~/projects` | Navigate to `/projects` |
| `cd ~/projects/ai-infra` | Navigate to `/projects#ai-infra` |
| `ls` | Show quick-pick of top-level sections |
| `cat skills.md` | Scroll to skills section and highlight it |
| `neofetch` | Scroll to top (neofetch hero) |
| `matrix` | Trigger matrix rain easter egg |
| `theme <name>` | Switch theme directly (dark/light/matrix) |
| `clear` | Dismiss command palette |

**Implementation:**
- Extend `CommandPalette.tsx` `commands` array with new entries
- The `cd` and `cat` commands scroll to sections using `document.getElementById().scrollIntoView()`
- `ls` shows a sub-pick of navigation targets
- No new React components needed — just more entries in the existing palette

**Acceptance criteria:**
- [ ] All commands above work from ⌘K palette
- [ ] Keyboard-navigable (↑↓ + Enter)
- [ ] Fuzzy-matching still works for project search
- [ ] Commands documented in a `help` command within palette

---

## 4. Search Enhancements

### 4.1 Current State

`CommandPalette.tsx` already filters commands by `includes(query.toLowerCase())`. Project search works by matching against `project.title` and `project.section` (which is always "Projects").

### 4.2 Enhancement: Fuzzy Search + Tag/Topic Search

**Replace simple `includes` with Fuse.js fuzzy matching:**

```
npm install fuse.js   # ~6KB gzipped, tree-shakeable
```

Fuse config:
```typescript
const fuse = new Fuse(commands, {
  keys: [
    { name: 'label', weight: 0.7 },
    { name: 'section', weight: 0.2 },
    { name: 'tags', weight: 0.1 },  // new: project topics
  ],
  threshold: 0.4,
  includeScore: true,
});
```

Add `tags` field to project commands derived from `project.topics` and `project.cluster`.

### 4.3 Enhancement: Project Page Filter/Sort Bar

Add a filter bar at the top of `/projects` page:

```
$ ls projects/  --sort=[stars|name|updated]  --filter=[cluster|language]
```

UI implementation:
- Render as a horizontal bar with TUI-styled controls
- **Sort options:** `stars` (default), `name`, `updated`
- **Filter options:** Cluster pills (clicking a cluster scrolls to / highlights that cluster)
- **URL presets:** `?sort=stars&filter=ai-infra` — enables direct recruiter links
- Pure client-side filtering via React island component wrapping the project list
- No server rendering needed — projects are static

**Recruiter value:** URL presets (`?sort=stars&filter=dev-tooling`) let you send a hiring manager a link that highlights the most relevant subset immediately. Progressive disclosure: all projects visible, matching ones highlighted.

### 4.4 Acceptance Criteria

- [ ] ⌘K palette uses Fuse.js for fuzzy matching across projects, sections, and topics
- [ ] Typing "rust" in palette surfaces RustDupe immediately
- [ ] Typing "proxy" surfaces AIstudioProxyAPI despite word boundaries
- [ ] `/projects` page has sort/filter bar
- [ ] Sort changes re-order project cards without page reload
- [ ] Filter by cluster highlights matching cluster, dims others
- [ ] URL presets work: `/projects?sort=stars&filter=ai-infra` loads with that view
- [ ] All filter state is reflected in URL for shareability
- [ ] No external API calls at runtime — all data from `projects.ts`

---

## 5. Contact Information Upgrades

### 5.1 Current State

Current `Contact.astro` shows:
- Email: `masurii@dev.io` (note: this is NOT confirmed — no email appears in GitHub API)
- GitHub: `github.com/MasuRii`
- No LinkedIn, Facebook, or other social links

### 5.2 Confirmed Contact Signals

From GitHub GraphQL `socialAccounts` API (verified 2026-04-13):

| Platform | Value | URL | Source |
|----------|-------|-----|--------|
| **GitHub** | MasuRii | https://github.com/MasuRii | `gh api users/MasuRii` |
| **LinkedIn** | math-lee-biacolo-729287190 | https://linkedin.com/in/math-lee-biacolo-729287190 | `gh api graphql → socialAccounts(provider: LINKEDIN)` |
| **Facebook** | MasuriiMathlee | https://facebook.com/MasuriiMathlee | `gh api graphql → socialAccounts(provider: FACEBOOK)` |
| **Greasyfork** | masuriii | https://greasyfork.org/en/users/1266652-masuriii | `gh api graphql → socialAccounts(provider: GENERIC, displayName: "Greasyfork")` |
| **Organization** | @RecursiveDev | https://github.com/RecursiveDev | `gh api users/MasuRii → company` |
| **Location** | Cebu, Philippines | `gh api users/MasuRii → location` |
| **Email** | `masurii@dev.io` | ⚠️ NOT confirmed by GitHub API | Appears in site code but GitHub API shows `email: null` |

### 5.3 Changes

1. **Add** LinkedIn link with SVG icon
2. **Add** Facebook link with SVG icon
3. **Add** Greasyfork link with SVG icon
4. **Add** RecursiveDev org link
5. **Mark email as unconfirmed** or remove it if it cannot be verified. The current `masurii@dev.io` does NOT appear in GitHub's public email field. **Recommendation: remove or add a disclaimer** — do not present unconfirmed email as fact.
6. **Update JSON-LD** `personSchema.sameAs` in `BaseLayout.astro` to include all confirmed social URLs

### 5.4 Contact Section Layout

```
$ contact
Contact
─
Have a project in mind, or want to collaborate on AI infrastructure or developer tools?

  ✉  masurii@dev.io    ← ⚠️ remove or mark unconfirmed

  ┌─ Social ──────────────────────┐
  │  GitHub      github.com/MasuRii          │
  │  LinkedIn    linkedin.com/in/math-lee... │
  │  Facebook    facebook.com/MasuriiMathlee │
  │  Greasyfork  greasyfork.org/users/masu... │
  │  Org         @RecursiveDev              │
  └──────────────────────────────────────┘

  ┌─ Location ───────────────────┐
  │  📍  Cebu, Philippines       │
  └──────────────────────────────┘
```

### 5.5 Acceptance Criteria

- [ ] LinkedIn, Facebook, Greasyfork, and RecursiveDev links all present in Contact section
- [ ] Each social link has an appropriate SVG icon
- [ ] Unconfirmed email is either removed or clearly annotated
- [ ] Footer also updated with at least LinkedIn + RecursiveDev
- [ ] JSON-LD `sameAs` array includes all 5 confirmed URLs
- [ ] All links tested and resolve to live pages
- [ ] No invented contact details

---

## 6. Recruiter-Friendly Project Organization

### 6.1 Current State

Projects are organized by 4 primary clusters + 4 grouped collections:
- Primary: `ai-infra`, `dev-tooling`, `full-stack`, `systems`
- Grouped: Pi Ecosystem, WTR-Lab Suite, Templates, Transport

The `/projects` page lists all clusters sequentially with individual cards per project in primary clusters and `<details>` accordions for grouped collections.

### 6.2 Problem

- No visual distinction between a **flagship project** (52★) and a minor extension (2★)
- Flat listing within clusters doesn't signal which projects are most significant
- No sort/filter capability for recruiter-directed views
- The 10 Pi extensions overwhelm the dev-tooling cluster visually

### 6.3 Enhancement: Tier System + Sort/Filter

#### 6.3.1 Tier Data Model Extension

Add a `tier` field to the `Project` interface in `src/data/projects.ts`:

```typescript
export type ProjectTier = 'flagship' | 'notable' | 'extension';

// Tier rules (deterministic, no subjective judgment):
// flagship:  stars >= 30 OR has demo URL
// notable:   stars >= 10 AND stars < 30 AND no demo
// extension: stars < 10 AND is part of an ecosystem group
```

Apply tiers to all projects:

| Project | Stars | Demo | Tier | Rationale |
|---------|-------|------|------|-----------|
| AIstudioProxyAPI-EN | 35 | — | flagship | ≥30 stars |
| FBScrapeIdeas | 35 | — | flagship | ≥30 stars |
| opencode-smart-voice-notify | 52 | — | flagship | ≥30 stars |
| pi-tool-display | 52 | npm | flagship | ≥30 stars + has package |
| AudioScholar | 4 | demo | flagship | Has live demo |
| CITUCourseBuilder | 3 | demo | flagship | Has live demo |
| Luv-Charms-E-commerce | 1 | demo | flagship | Has live demo |
| ReCursor | — | demo | flagship | Has live demo |
| JeepMe | — | demo | flagship | Has live demo |
| MasuSenseiBotV3-Agent | 1 | — | notable | In flagship cluster but low stars |
| pi-rtk-optimizer | 19 | — | notable | ≥10 stars |
| RustDupe | 1 | — | notable | Unique (Rust crate) |
| opencode-godot-lsp | 5 | npm | notable | Has npm package |
| WTR-Lab Enhancement Suite | — | userscript | notable | Active userscript suite |
| Remaining Pi extensions | <10 | npm | extension | Ecosystem plugins |
| Templates | — | demo | extension | Site templates |

#### 6.3.2 Project Card Tier Styling

- **Flagship**: Full card with screenshot thumbnail, tagline, star count, demo badge, language badge
- **Notable**: Compact card with tagline, star count, no screenshot
- **Extension**: Inline/list item in the grouped collection accordion

This is mostly the current pattern — just needs formal tier assignment and visual differentiation.

#### 6.3.3 Homepage Featured: Smart Selection

Current: `getFeaturedProjects()` returns projects with `featured: true` and `featuredOrder`.

Enhancement: Add a computed function that **auto-promotes** flagship projects with highest stars to the homepage featured section (top 5), even if not manually flagged:

```typescript
export function getAutoFeaturedProjects(): Project[] {
  const flagships = projects
    .filter(p => p.tier === 'flagship')
    .sort((a, b) => b.stars - a.stars);
  return flagships.slice(0, 5);
}
```

Manual `featuredOrder` still overrides for deliberate curation, but the auto-featured ensures the homepage always shows the strongest signal without stale manual flags.

#### 6.3.4 URL Presets for Recruiter-Targeted Views

On `/projects`, support query parameters that pre-filter the view:

| Preset URL | Effect |
|-----------|--------|
| `/projects?focus=ai-infra` | Expand + highlight AI Infrastructure cluster, dim others |
| `/projects?focus=dev-tooling` | Expand + highlight Dev Tooling cluster |
| `/projects?focus=products` | Expand + highlight Full-Stack Products |
| `/projects?tier=flagship` | Show only flagship-tier projects |
| `/projects?sort=stars` | Sort all clusters by star count descending |

**Implementation:**
- Read URL search params on page load via `URLSearchParams`
- Apply initial filter/sort state before React render
- React island component (`ProjectFilterBar.tsx`) manages state

#### 6.3.5 Acceptance Criteria

- [ ] `ProjectTier` type added to `projects.ts` with deterministic tier assignment
- [ ] All 14+ projects have assigned tiers (flagship/notable/extension)
- [ ] Flagship cards visually distinct from notable/extension cards
- [ ] Homepage auto-featured shows top-5 flagship by stars unless manual override
- [ ] `/projects` page has sort bar (stars/name/updated) and filter pills (by cluster)
- [ ] URL presets `?focus=`, `?tier=`, `?sort=` work and are shareable
- [ ] No external API calls at runtime for sorting — all data from `projects.ts`
- [ ] Progressive disclosure: filtering dims non-matching clusters, doesn't hide them

---

## 7. Summary of All Changes by File

| File | Change | Section | Effort |
|------|--------|---------|--------|
| `src/layouts/BaseLayout.astro` | Replace `400.css`/`500.css` imports with `latin-400.css`/`latin-500.css`; update `personSchema.sameAs`; add LinkedIn/Facebook/Greasyfork/RecursiveDev to JSON-LD | §1, §5 | S |
| `src/styles/global.css` | Add typing animation keyframes, cursor blink, glitch keyframes, ASCII progress bar styles, reduced-motion overrides | §2 | M |
| `src/components/Hero.astro` | Redesign as neofetch-style profile block; add typing animation to `$ whoami` prompt; add blinking cursor | §3.1, §2 | M |
| `src/components/Contact.astro` | Add LinkedIn, Facebook, Greasyfork, RecursiveDev links; handle unconfirmed email; reorg layout | §5 | S |
| `src/components/Footer.astro` | Add LinkedIn + RecursiveDev to external links section | §5 | XS |
| `src/components/ProjectHighlights.astro` | Use `getAutoFeaturedProjects()` for homepage featured | §6.3.3 | S |
| `src/components/ProjectCard.astro` | Add tier-based visual variants (flagship vs notable vs extension) | §6.3.2 | S |
| `src/data/projects.ts` | Add `ProjectTier` type, `tier` field to all projects, `getAutoFeaturedProjects()`, `getProjectsByTier()` functions | §6.3.1 | M |
| `src/pages/projects/index.astro` | Add sort/filter bar component; add tree view toggle | §4.3, §3.2 | L |
| `src/pages/404.astro` | Add glitch text animation | §2 | XS |
| `src/components/CommandPalette.tsx` | Add Fuse.js fuzzy search; add VFS commands (cd, ls, cat, neofetch, matrix, theme, clear, help); add tags to project commands | §3.3, §4.2 | M |
| NEW: `src/components/ProjectFilterBar.tsx` | React island for sort/filter/tier controls on projects page | §4.3 | M |
| NEW: `src/components/MatrixRain.tsx` | React island for matrix rain easter egg canvas | §2 | S |
| NEW: `src/components/TreeView.tsx` | React island for tree-format project rendering | §3.2 | M |
| `astro.config.mjs` | No change needed (Option A avoids ssr.noExternal issue) | §1 | — |
| `public/avatar.jpg` | No change | — | — |
| `package.json` | Add `fuse.js` dependency (~6KB gzipped) | §4.2 | XS |

---

## 8. Quality Attribute Priorities

| Attribute | Priority | Target | Trade-off Accepted |
|-----------|----------|--------|-------------------|
| Performance (Lighthouse) | P1 | ≥ 90 mobile, ≥ 95 desktop | Fuse.js adds ~6KB; typing animations need `will-change` |
| Accessibility (WCAG 2.1 AA) | P1 | All interactive elements keyboard-reachable; no info lost with reduced-motion | Typing effect disabled for `prefers-reduced-motion` |
| Recruiter scannability | P1 | Neofetch block readable in 5 seconds; projects filterable in 2 clicks | More visual complexity than current minimal design |
| TUI aesthetic coherence | P2 | Every new feature uses `font-mono`, TUI prompt, box-drawing chars | Some features (filter bar) push TUI metaphor but stay on-brand |
| Font loading reliability | P1 | Zero 404s in browser dev tools console | Drops non-Latin subsets (cyrillic, greek, vietnamese) — acceptable for English portfolio |

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| JetBrains Mono subset-specific imports break at `@fontsource` version upgrade | L | M | Pin `@fontsource/jetbrains-mono` version in `package.json` |
| Fuse.js adds too much bundle weight | L | L | Fuse.js is 6KB gzipped; tree-shake unused options |
| Neofetch block feels gimmicky | M | M | Keep it data-focused (no ASCII art logo); recruiter signals justify it |
| Matrix rain easter egg triggers `prefers-reduced-motion` complaints | L | L | Hard-blocked by reduced-motion check; self-dismisses in 5s |
| Filter bar breaks TUI aesthetic | M | M | Use monospace font, accent-colored pills, `$ ls --sort=` prefix |
| Tier assignment is wrong for some projects | M | L | Tiers are deterministic formula-based; manual overrides possible |
| Email `masurii@dev.io` is unconfirmed | H | M | Remove from contact section; add note in code comment |

---

## 10. Implementation Order (Dependency Sequence)

```
Phase 1: Critical Fix (no new features)
  └── Fix JetBrains Mono 404s (§1)

Phase 2: Foundational (data model + content changes)
  ├── Add tier system to projects.ts (§6.3.1)
  ├── Add confirmed social links to Contact + Footer + JSON-LD (§5)
  └── Handle unconfirmed email (§5.3)

Phase 3: Core Features (high recruiter impact)
  ├── Neofetch hero block (§3.1)
  ├── Enhanced command palette with Fuse.js + VFS commands (§4.2, §3.3)
  └── Project page sort/filter bar (§4.3)

Phase 4: Animations (polish)
  ├── Typing effect + cursor blink (§2 A1, A2)
  ├── ASCII progress bars (§2 A4)
  ├── Staggered card reveal (§2 A3)
  └── 404 glitch effect (§2 A6)

Phase 5: Unique Features (delight)
  ├── Tree view for projects (§3.2)
  ├── Matrix rain easter egg (§2 A7)
  └── Scroll snap (§2 A5)
```

---

## 11. Do NOT Implement

These were considered and explicitly rejected:

| Idea | Why Rejected |
|------|-------------|
| CRT scanline overlay | Too gimmicky for main experience; only acceptable as easter egg, but Matrix rain is better |
| Snake/Tic-Tac-Toe mini-games | Fun but not recruiter-appropriate; detracts from portfolio purpose |
| Sound effects on commands | Accessibility concern; annoying on repeat visits |
| Full VFS with `cd`/`ls`/`cat` as URL-based routing | Over-engineers the site; current structure (Astro static routes) works. Palette commands are enough. |
| Auto-fetching GitHub star counts at runtime | External API dependency; rate limits; static site should be build-time only |
| Smooth animated skill bars | Anti-slop: smooth animations on skill bars feel gamified. ASCII bars are more TUI-authentic. |