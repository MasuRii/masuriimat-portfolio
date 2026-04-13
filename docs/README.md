# MasuRii Portfolio Documentation

> Generated: 2026-04-12 | Docs Agent

Modular documentation set for building the MasuRii portfolio site. Each guide is self-contained but cross-referenced. Start here for navigation.

---

## Guide Index

| # | Guide | Purpose | Word Count | Key Takeaway |
|---|---|---|---|---|
| 01 | [**Profile & Brand**](01-profile-and-brand.md) | Define who the portfolio is about, brand narrative, voice & tone, brand elements | ~1,200 | Three thematic clusters — AI infra, dev tools, real products — tied by one narrative: "I build the invisible infrastructure that makes powerful technology work for real people." |
| 02 | [**Project Inventory**](02-project-inventory.md) | Curated showcase of 5 projects + 1 bonus, with case study outlines ready to adapt | ~2,000 | Five projects earn their place via community signal, technical depth, and human story. Lead with AIstudioProxyAPI-EN, close with AudioScholar (live product). RustDupe as breadth bonus. |
| 03 | [**Content Strategy**](03-content-strategy.md) | Page-by-page content plan: hero copy, About section, project cards, case study template, blog starters, SEO | ~1,800 | Five-page structure max. Hero ≠ job title. Case studies use Problem → Approach → Challenges → Results → Learnings. Anti-patterns: "Hi, I'm ___ 👋" and logo walls. |
| 04 | [**UI/UX Design Guide**](04-ui-ux-design-guide.md) | Opinionated 2026 anti-slop design decisions: tech stack, typography, color, motion, layout, performance, a11y, surprise element | ~2,400 | Astro 5+ with React islands. Space Grotesk. Burnt-orange accent. One 300ms page-load animation. ≥95 Lighthouse. Cmd+K command palette as the "one surprise." |

---

## Supporting Research

The `research/` directory contains the validated source material these guides are built from.

| File | Purpose |
|---|---|
| [`research/README.md`](research/README.md) | Research index with methodology, confidence levels, and quick-start reading order |
| [`research/github-projects-catalog-2026-04-12.md`](research/github-projects-catalog-2026-04-12.md) | Full enumeration of 51 public repos with portfolio-worthiness ratings |
| [`research/portfolio-design-guidance-2026-04-12.md`](research/portfolio-design-guidance-2026-04-12.md) | 2026 public guidance on portfolio structure, anti-AI-slop UI/UX, typography, color, motion, performance |
| [`research/advice-synthesis-checklist-2026-04-12.md`](research/advice-synthesis-checklist-2026-04-12.md) | Cross-reference of ADVICE.md against 2026 research, prioritized launch checklist |

[`ADVICE.md`](ADVICE.md) is the original repository advice document (not modified by this docs effort).

---

## Coverage Map

The four guides together provide complete documentation for portfolio construction:

| Aspect | Covered In | Status |
|---|---|---|
| **Who MasuRii is & brand narrative** | [01-profile-and-brand.md](01-profile-and-brand.md) | ✅ Complete |
| **Which projects to showcase & why** | [02-project-inventory.md](02-project-inventory.md) | ✅ Complete |
| **What to write on each page** | [03-content-strategy.md](03-content-strategy.md) | ✅ Complete |
| **2026 anti-slop UI/UX guidance** | [04-ui-ux-design-guide.md](04-ui-ux-design-guide.md) | ✅ Complete |

### What These Guides Do NOT Cover

These guides are documentation for *building* the portfolio — not the site code itself. They deliberately exclude:

- Implementation scaffolding (see the Astro project that consumes these docs)
- Deployment pipeline configuration
- Testing strategy
- Post-launch analytics

These may be added as future guides (05, 06, …) when needed.

---

## Recommended Reading Order

If you're building the portfolio for the first time:

1. **[01-profile-and-brand.md](01-profile-and-brand.md)** — Lock the narrative and voice before writing anything
2. **[02-project-inventory.md](02-project-inventory.md)** — Decide what you're showcasing and why
3. **[03-content-strategy.md](03-content-strategy.md)** — Structure the pages and draft the copy
4. **[04-ui-ux-design-guide.md](04-ui-ux-design-guide.md)** — Make visual decisions *after* content is defined (content-first design)

If you're referencing a specific decision, jump directly to the relevant guide — each one is self-contained.

---

## Conventions Used Across Guides

| Convention | Details |
|---|---|
| **Audience** | The developer (MasuRii) building the portfolio; secondary: collaborators on copy or design |
| **Facts vs. Opinions** | GitHub data (stars, forks, descriptions) is factual from the API. Design and content recommendations are opinionated — based on 2026 research but labeled with reasoning so you can disagree. |
| **Cross-references** | Guides link to each other with relative paths (e.g., `02-project-inventory.md`). Research sources link into `research/`. |
| **Anti-patterns** | Every guide includes explicit "Don't" lists — these are as important as the "Do" lists. The #1 anti-pattern across all guides: AI-slop generic content that could belong to any developer. |
| **Date stamp** | All research files are dated `2026-04-12`. Guides should be revisited if significant time passes before launch. |

---

## Quick Reference: Key Decisions at a Glance

These are the non-negotiable decisions established across the guide set:

| Decision | Value | Source |
|---|---|---|
| Brand narrative | "I build the invisible infrastructure that makes powerful technology work for real people." | 01-profile-and-brand.md |
| Showcase projects (5+1) | AIstudioProxyAPI-EN, pi-tool-display, opencode-smart-voice-notify, FBScrapeIdeas, AudioScholar + RustDupe bonus | 02-project-inventory.md |
| Page structure | `/` (hero+about+highlights+contact), `/projects`, `/projects/[slug]`, optional `/blog`, optional `/now` | 03-content-strategy.md |
| Tech stack | Astro 5+ · React islands · Tailwind CSS · TypeScript · MDX | 04-ui-ux-design-guide.md |
| Display font | Space Grotesk (or Geist Sans) | 04-ui-ux-design-guide.md |
| Accent color | Burnt orange-terracotta (`#E8553A` light / `#FF6B4A` dark) | 04-ui-ux-design-guide.md |
| Lighthouse target | ≥ 95 | 04-ui-ux-design-guide.md |
| Surprise element | Cmd+K command palette | 04-ui-ux-design-guide.md |