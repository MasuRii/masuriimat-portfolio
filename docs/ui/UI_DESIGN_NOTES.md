# TUI/CLI Redesign — UI Design Notes

> **Status**: IMPLEMENTED  
> **Date**: 2026-04-12  
> **Aesthetic**: Terminal-first, dark-mode-default, readable TUI

## Design Decisions

### Why TUI/CLI Aesthetic?

The portfolio owner (MasuRii) builds the highest-starred Pi terminal extensions. A terminal-inspired portfolio is authentic, memorable, and consistent with the work being showcased. It doesn't parody terminals — it reads as a well-crafted TUI with readable content hierarchy.

### Color System

| Token | Dark (default) | Light (override) | Purpose |
|---|---|---|---|
| `--color-bg` | `#0C0C0C` | `#FAFAFA` | Page background |
| `--color-surface` | `#161616` | `#F0F0F0` | Cards, blocks |
| `--color-surface-raised` | `#1E1E1E` | `#E8E8E8` | Elevated surfaces |
| `--color-text` | `#E4E4E7` | `#18181B` | Primary text |
| `--color-text-muted` | `#71717A` | `#71717A` | Secondary text |
| `--color-text-dim` | `#52525B` | `#A1A1AA` | Tertiary/prompt dim |
| `--color-accent` | `#FF6B4A` | `#E8553A` | Terracotta accent |
| `--color-accent-hover` | `#FF8566` | `#D94429` | Accent hover |
| `--color-accent-muted` | `#FF6B4A18` | `#E8553A18` | Accent backgrounds |
| `--color-prompt` | `#FF6B4A` | `#E8553A` | `$` prompt prefix |
| `--color-path` | `#60A5FA` | `#2563EB` | Path/URL styling |
| `--color-green` | `#4ADE80` | `#16A34A` | Live/success badges |
| `--color-border` | `#27272A` | `#D4D4D8` | Borders |

### Typography

- **Space Grotesk** — display/headings (preserved from prior design)
- **JetBrains Mono** — all TUI chrome (prompts, tags, badges, status lines, nav items)
- Body text stays Space Grotesk for readability — monospace is only for metadata, not prose

### Component: TUI Prompt Headers

All section headers use a two-line pattern:
1. **Prompt line**: `<p class="tui-heading"><span class="text-accent">$</span> whoami</p>`
2. **Readable label**: `<h2 class="text-3xl …">About</h2>`

This reinforces the TUI metaphor without sacrificing SEO (the `<h2>` has the real heading text).

### Component: Status Badges

```
┌─ live ● ─┐   ← .tui-badge--live (green border + dot)
│ ★ 52     │   ← .tui-badge--stars (accent border)
│ Rust      │   ← plain .tui-tag (border + muted text)
└──────────┘
```

### Component: Project Card

Cards use TUI-styling without becoming unwelcoming:
- Monospace `font-mono` for metadata (stars, language)
- Screenshot thumbnails rendered with `.tui-screenshot` styling (1px border, rounded corners)
- `hover:bg-surface/30` subtle hover state
- Status line with `tui-badge` for live demos

### Accessibility

- All interactive elements have `min-h-[44px]` touch targets
- `.skip-link` preserved for keyboard navigation
- `focus-visible` outlines on all interactive elements
- `prefers-reduced-motion` respected (no animations at all)
- Color contrast: all text on dark bg meets WCAG AA (4.5:1+)
- Avatar has `alt="MasuRii avatar"`
- Screenshots have descriptive `alt` text from data layer

### Dark-First Theme Initialization

1. `<html data-theme="dark">` in HTML (prevents flash)
2. Inline `<script is:inline>` reads `localStorage.getItem('theme')`
3. Falls back to dark — only switches to light if explicitly stored OR OS `prefers-color-scheme: light`
4. Theme toggle in header/footer persists preference

### Files Architecture

| File | Purpose |
|---|---|
| `src/data/projects.ts` | Single source of truth for all project data |
| `src/styles/global.css` | Color tokens, TUI component classes, animation |
| `src/layouts/BaseLayout.astro` | Dark-first theme, meta, fonts |
| `src/layouts/CaseStudyLayout.astro` | Project detail pages with screenshots |
| `src/components/Header.astro` | TUI path-bar nav (`~/masurii $`) |
| `src/components/Hero.astro` | `$ whoami` section with avatar |
| `src/components/ProjectHighlights.astro` | `$ ls -la featured/` section |
| `src/components/ProjectCard.astro` | TUI-styled card with status badges |
| `src/components/About.astro` | `$ cat skills.md` + `$ cat about.md` |
| `src/components/Contact.astro` | `$ contact` section |
| `src/components/Footer.astro` | Terminal status-line footer |
| `src/components/CommandPalette.tsx` | React island, TUI-styled (`$` prefix) |
| `public/avatar.jpg` | Self-hosted GitHub profile avatar |

### Anti-Patterns Avoided

- No CRT scanlines, Matrix rain, phosphor glow, or neon effects
- No fake terminal animation (typing effect, blinking cursor beyond `::after`)
- Monospace is for metadata/chrome only — body text uses Space Grotesk
- Color palette uses terracotta accent (#FF6B4A) consistently, not rainbow terminal colors
- No external font requests — all self-hosted via @fontsource