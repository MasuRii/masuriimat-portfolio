# Portfolio Content Strategy

> Audience: The developer building the portfolio site — making decisions about what goes on each page, how it's structured, and what to write.
> Purpose: Practical page-by-page content guidance. Not "write whatever feels right" — specific recommendations with reasoning.

---

## Page Structure

Keep it simple. A portfolio is not a CMS. Five pages (or sections on a single long page) is plenty.

```
/                → Hero + About + Project highlights + Contact
/projects        → Case studies (3–5 detailed, not 10 shallow)
/projects/[slug] → Individual case study pages (MDX or markdown)
/blog            → (Optional, post-launch) — Process posts, learnings
/now             → (Optional) — What you're currently working on / reading / building
```

Alternatively, use a single-page layout with command-menu navigation — see the "One Surprise Element" section in [04-ui-ux-design-guide.md](04-ui-ux-design-guide.md).

---

## Home Page

### Hero Section

The hero has one job: make the visitor want to keep scrolling. You have about 3 seconds.

**Recommended structure:**

```
[Name/Visual Mark]
[One-line narrative — not a job title]
[Brief supporting line — 8–12 words max]
[Primary CTA: "See my work" or "View projects"]
[Secondary: GitHub icon link]
```

**Specific copy suggestion (adapt to your voice):**

> **MasuRii**
> I build the invisible infrastructure that makes powerful technology work for real people.
> AI middleware · Developer tools · Shipped products
> [View Projects ↓] [GitHub ↗]

**Anti-patterns to avoid in the hero:**
- "Hi, I'm MasuRii 👋" — 90% of developer portfolios start this exact way (confirmed by Parth Sharma, 2026)
- "Full-Stack Developer" — A category, not a hook
- Typing animation for the tagline — Adds latency, reduces scannability
- "Passionate about building elegant solutions" — Means nothing specific

### About Section

Short. 100–150 words max. Not a resume objective — a person.

**Structure:**
1. Where you are (Cebu, Philippines — grounds you in a real place)
2. What you build (AI infra, dev tools, real products — mirrors the narrative)
3. One personal detail that makes it feel human (the kind of thing an LLM wouldn't invent)
4. Tech stack as inline text, not a logo wall

**Example direction:**

> I'm a full-stack developer based in Cebu, Philippines. I build AI infrastructure (proxies, relays, scraping tools), developer experience extensions (voice notifications, terminal rendering, permission systems), and real products that serve real people — from students planning their schedules to small businesses selling handmade goods.
>
> Most days I'm writing TypeScript or Python, occasionally Rust. I've published a crate, shipped 13 developer-tool extensions across two ecosystems, and maintained projects with 50+ GitHub stars.
>
> When I'm not coding, [1 personal sentence — you fill this in].

### Project Highlights (Home Page)

On the home page, show 3 projects maximum — the strongest three that tell the narrative. Link to the full `/projects` page for the rest.

Recommended home page trio:
1. **AIstudioProxyAPI-EN** — "AI infrastructure" proof
2. **pi-tool-display** — "Developer UX" proof
3. **AudioScholar** — "Real product" proof

Each gets a compact card with: name, one-sentence hook, tech tags, link to case study + GitHub.

---

## Projects Page

### Layout

**Not** a 3-column grid of identical cards (that's the #1 AI-slop layout pattern per Parth Sharma and WalterSignal).

**Recommended:** A stacked list or alternating layout where the featured project gets more visual weight than the others. Case study links are prominent; GitHub stars and live-demo badges are visible.

### Per-Project Card Content

| Element | What to Include |
|---|---|
| **Project name** | Consistent with GitHub repo name |
| **One-sentence hook** | What it does, not how it's built (save tech for the case study) |
| **Thumbnail or screenshot** | Real, not a mockup. Terminal UI projects can use asciinema recordings. |
| **Stars + forks badge** | If ≥5 stars, show it. It's social proof. |
| **Tech tags** | 3–4 max. Not an exhaustive list. |
| **Links** | Case study · GitHub · Live demo (if available) |

### Case Study Pages

Each case study follows a consistent structure so visitors know what to expect:

```markdown
## [Project Name]

**What it does** — 1–2 sentences

### The Problem
What was broken, missing, or painful?

### Approach
How did you solve it? What were the key architectural decisions?

### Challenges
What went wrong? What was harder than expected?

### Results
Quantifiable outcomes — stars, forks, users, performance improvements, deployment status.

### What I'd Do Differently
Honest retrospective. This is the section that makes the case study feel real.

---
[GitHub] · [Live Demo] · [Back to Projects]
```

Case study outlines for all five showcase projects are in [02-project-inventory.md](02-project-inventory.md).

---

## Contact

Not a form. Forms are impersonal and nobody fills them out on a portfolio.

**Recommended:**

```
Let's talk.
email@address.dev · GitHub ↗ · LinkedIn ↗
(If you'd rather I reach out, leave your email and I'll get back within 24h.)
[Small email input + send button — optional]
```

**Key rules:**
- Contact info visible on every page (header or footer), not just the contact section
- Use a real email address, not a "Contact Us" form
- If including LinkedIn, make sure the profile is up to date before launch

---

## Blog (Post-Launch)

A blog section is a strong differentiator because most developer portfolios don't have one. Two or three well-written process posts add more value than any visual polish.

**Starter topics (based on the project inventory):**

1. **"How I Built an OpenAI-Compatible Proxy for Google AI Studio"** — Technical, specific, has a clear audience of AI/API devs
2. **"Why I Built 10 Pi Extensions in 3 Months"** — Shows initiative, speed, and ecosystem-thinking
3. **"The Self-Healing Selector Pattern"** — From FBScrapeIdeas; practical web scraping technique that others can use

**Format:** MDX with code blocks, images, and proper formatting. Each post should take 15–30 minutes to read (1,500–3,000 words). Not tweets, not novellas.

---

## SEO & Metadata

| Item | Implementation |
|---|---|
| **Title tag** | `MasuRii — AI Infrastructure & Developer Tools` (not "Portfolio" — that's vague) |
| **Meta description** | Use the narrative one-liner, under 160 chars |
| **OG image** | Design one branded OG image. Reuse for all pages with dynamic text overlay. |
| **JSON-LD** | `Person` schema + `WebSite` schema on home; `SoftwareSourceCode` on project pages |
| **Sitemap** | Auto-generated by Astro — no extra work |
| **Robots.txt** | Allow all; no secret pages to hide |

---

## Copy Checklist

Before publishing any page, check:

- [ ] No sentence could be copied to another developer's portfolio unchanged
- [ ] Every "I" claim has evidence (stars, live demo, published crate)
- [ ] No exclamation marks on factual statements ("35 stars!" → "35 stars")
- [ ] No word-salad phrases ("leveraging cutting-edge," "passionate about crafting," "driving innovation")
- [ ] Tech stack listed as inline text or compact tags — not a wall of 30 logos
- [ ] Personal detail on About section is genuinely personal, not generic
- [ ] Case studies include challenges and honest retrospectives, not just highlights

---

## Sources

- Parth Sharma: "Why 90% of Developer Portfolios Look the Same" (2026-02)
- WalterSignal: "Web Design 2026: What Converts vs. AI Slop" (2026-03)
- Aneta Kmiecik: "Portfolios in 2026: Diaries to Designed Experiences" (2026)
- ADVICE.md: Section on personalization and AI usage discipline
- Full research details: [`docs/research/portfolio-design-guidance-2026-04-12.md`](research/portfolio-design-guidance-2026-04-12.md)