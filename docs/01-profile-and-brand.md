# Profile & Brand: MasuRii Portfolio

> Audience: The developer (MasuRii) building their portfolio site, and any collaborator helping with copy or design.
> Purpose: Define who the portfolio is about, what makes them distinct, and how to communicate that consistently.

---

## The Person Behind the Profile

| Field | Detail |
|---|---|
| **Name** | MasuRii Math Lee マス・リー |
| **Location** | Cebu, Philippines |
| **GitHub** | [github.com/MasuRii](https://github.com/MasuRii) — 51 public repos, 17 followers |
| **Core Stack** | Rust · Python · TypeScript · React.js · Flutter |
| **Account Since** | August 2016 |
| **Blog** | None yet — opportunity for the portfolio to fill this gap |

## What the GitHub Profile Actually Shows

When you look at the repo catalog as a whole, three things stand out:

1. **AI infrastructure depth** — Six repos focused on AI proxying, relay, key rotation, and scraping with AI. This isn't surface-level "I used OpenAI's API once" — it's systems-level work (FastAPI, Playwright, Camoufox, Cloudflare Workers, protocol bridging).

2. **Developer experience craftsmanship** — Thirteen repos in the OpenCode and Pi extension ecosystems. Not just contributing, but *prolifically shipping* — 10 Pi extensions in 3 months covering UX rendering, performance optimization, permissions, voice, and auth. The two highest-starred repos (52★ each) are both dev-ex tools.

3. **Real products shipped** — AudioScholar (Kotlin + React, live on Vercel), CITUCourseBuilder (serves real students), Luv-Charms E-commerce (built for a family business), TrustGuard (Flutter offline-first expense ledger). These aren't tutorial projects.

Add to that: a published Rust crate (RustDupe on crates.io), 6 website templates showing design sensibility, and Godot/LSP work showing cross-domain curiosity.

## Brand Narrative

A brand narrative is not a job title — it's the one sentence you want someone to remember after they close the tab.

**Recommended narrative:**

> I build the invisible infrastructure — AI middleware, developer tools, and real products — that makes powerful technology work for real people.

This works because it:
- Ties the three thematic clusters (AI infra, dev tools, products) into one arc
- Says "*invisible* infrastructure" — signaling humility and systems thinking
- Ends with "*real people*" — connecting technical depth to human impact
- Is specific enough to differentiate from "full-stack developer" (which is a category, not a narrative)

### Alternative angles (if the primary doesn't feel right)

| Angle | One-Liner | Best If… |
|---|---|---|
| AI-first | "I build the plumbing between AI models and the developers who use them." | Targeting AI/ML engineering roles |
| DevEx-first | "I obsess over developer experience — from voice notifications to terminal rendering to permission systems." | Targeting platform/developer-tooling roles |
| Product-first | "I ship end-to-end products — from AI proxies to small-business e-commerce to student scheduling tools." | Targeting full-stack / startup roles |

Pick **one** as the spine. The other two become supporting evidence, not competing headlines.

## Voice & Tone

The portfolio's written voice should feel like talking to a thoughtful colleague, not reading a LinkedIn summary.

| Do | Don't |
|---|---|
| "I spent three weeks figuring out why WebSocket reconnections silently dropped half the payload." | "I am passionate about crafting elegant, scalable solutions." |
| "Built an OpenAI-compatible proxy because the official API was too slow for my use case." | "Leveraged cutting-edge AI technologies to drive innovation." |
| "This project has 52 stars — I didn't expect that." | "My groundbreaking project received widespread community recognition." |
| "I live in Cebu. Yes, the lechon is that good." | (No personality at all) |

**Tone targets:**
- **Conversational but precise** — Use plain language, but don't shy from technical detail when it matters.
- **Understated confidence** — Let numbers and live demos speak. No exclamation marks after star counts.
- **Honest about process** — Mention the debugging, the dead ends, the things you'd redo. That's what makes a case study credible.
- **Briefly personal** — A touch of humor or location detail makes the site feel hand-built, not LLM-generated.

## Brand Elements to Define

These should be locked down *before* writing any code. They feed into the design system, typography, and color decisions covered in [04-ui-ux-design-guide.md](04-ui-ux-design-guide.md).

| Element | Decision | Notes |
|---|---|---|
| **Primary domain** | `masurii.dev` or `masuriimat.dev` | Check availability. `.dev` signals developer identity. ADVICE.md calls this "non-negotiable." |
| **Display name on site** | MasuRii | Use the brand name consistently — don't switch between "MasuRii," "Masu," "Math Lee" across pages. |
| **Tagline** | Use the narrative one-liner | Below the name, in the hero. Not "Full-Stack Developer" (too generic). |
| **Avatar/Visual ID** | TBD — but *not* a stock illustration or AI-generated avatar | A photo, a simple geometric mark, or a self-drawn element. Something that doesn't appear on 500 other sites. |
| **Favicon** | Derived from avatar/visual ID | Consistent with the rest of the brand. |

---

## Quick Reference: Profile Data for Portfolio Copy

Use these concrete facts when writing site content — all sourced directly from the GitHub API (see [`docs/research/github-projects-catalog-2026-04-12.md`](research/github-projects-catalog-2026-04-12.md) for full details).

- 51 public repositories
- Top-starred originals: **pi-tool-display** (52★), **opencode-smart-voice-notify** (52★), **AIstudioProxyAPI-EN** (35★), **FBScrapeIdeas** (35★)
- Published crate: **RustDupe** on crates.io
- 13 extension/plugin repositories across OpenCode and Pi ecosystems
- Live-deployed products: AudioScholar (Vercel), CITUCourseBuilder (GitHub Pages), Luv-Charms E-commerce (Vercel)
- Core languages on GitHub: TypeScript, Python, Rust, Kotlin, Dart, GDScript, JavaScript
- Active projects updated in 2026: AIstudioProxyAPI-EN, FBScrapeIdeas, pi-tool-display, pi-rtk-optimizer, opencode-smart-voice-notify