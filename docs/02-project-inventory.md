# Project Inventory: Portfolio Showcase

> Audience: The developer building the portfolio, deciding what to feature and how to present each project.
> Purpose: A curated, opinionated list of projects to showcase — with case study outlines ready to adapt into portfolio content.

---

## Selection Criteria

Every project on the portfolio needs to earn its place. A project makes the cut if it meets at least two of these:

1. **Community signal** — Stars, forks, or external usage (not just your own)
2. **Technical depth** — Solves a genuinely hard problem (not a CRUD tutorial)
3. **Human story** — Serves real people, has a personal angle, or shows unusual initiative
4. **Live demo** — Visitors can click and see it working right now
5. **Unique positioning** — Demonstrates something uncommon (e.g., Rust + TUI, AI proxy architecture, plugin ecosystem contribution)

## The Showcase: 5 Projects + 1 Bonus

### 1. AIstudioProxyAPI-EN — AI Infrastructure Flagship

| Field | Detail |
|---|---|
| **Stars** | 35 · 7 forks |
| **Language** | Python |
| **URL** | [github.com/MasuRii/AIstudioProxyAPI-EN](https://github.com/MasuRii/AIstudioProxyAPI-EN) |
| **Tech** | FastAPI, Playwright, Camoufox, OpenAI API compat |

**What it is:** An OpenAI-compatible proxy server that routes requests to Google AI Studio via browser automation. It simulates human-like requests using Playwright and Camoufox (a stealthy Firefox fork) so the API endpoint appears to be accessed by a real user.

**Case study outline:**

- **Problem:** Google AI Studio provides powerful free-model access but only through their web interface — no clean API. Developers who want to use it programmatically are stuck.
- **Approach:** Build a FastAPI server that exposes an OpenAI-compatible endpoint. Under the hood, use Playwright to automate browser sessions, and Camoufox to avoid bot detection. Route standard OpenAI-format requests through to Google's models.
- **Challenges:** Bot detection is aggressive. Session management across multiple accounts. Keeping the proxy stable when the browser-side changes. Handling rate limits gracefully.
- **Results:** 35 stars, 7 forks, actively maintained through April 2026. Community adoption with real users.
- **What I'd do differently:** Add streaming response support earlier. Write more robust selector fallbacks — the self-healing selector pattern from FBScrapeIdeas would have helped here.

---

### 2. pi-tool-display — Developer UX Craftsmanship

| Field | Detail |
|---|---|
| **Stars** | 52 · 8 forks |
| **Language** | TypeScript |
| **URL** | [github.com/MasuRii/pi-tool-display](https://github.com/MasuRii/pi-tool-display) |
| **Tech** | TypeScript, Pi TUI extension API, terminal rendering |

**What it is:** An extension for the Pi coding agent that provides compact, readable rendering of tool calls, diffs, and truncated output in the terminal UI. It takes raw agent output and makes it scannable.

**Case study outline:**

- **Problem:** Pi's default tool call output in the TUI is verbose and noisy. When an agent makes 20 tool calls in a session, the terminal becomes unreadable — you lose track of what happened and why.
- **Approach:** Design a display layer that collapses, colorizes, and contextualizes tool output. Diff visualization with syntax highlighting. Smart truncation that keeps the important parts visible. All within terminal UI constraints (no rich HTML — ANSI sequences and box-drawing characters).
- **Challenges:** Terminal rendering is unforgiving — no CSS, no flexbox. Getting diff syntax highlighting to look good in 80-column constraints. Balancing information density with readability.
- **Results:** 52 stars, 8 forks — the highest-starred Pi extension. Adopted by the Pi community as a de facto standard for tool display.
- **What I'd do differently:** I'd make the truncation thresholds configurable from the start — different users have very different terminal sizes and preferences.

---

### 3. opencode-smart-voice-notify — Accessibility + Plugin Architecture

| Field | Detail |
|---|---|
| **Stars** | 52 · 6 forks |
| **Language** | TypeScript |
| **URL** | [github.com/MasuRii/opencode-smart-voice-notify](https://github.com/MasuRii/opencode-smart-voice-notify) |
| **Tech** | TypeScript, OpenCode plugin API, ElevenLabs, Edge TTS, Windows SAPI, OpenAI TTS |

**What it is:** A voice notification plugin for OpenCode that supports multiple TTS engines. When an AI coding agent finishes a task, you hear about it — even if you're looking at another window.

**Case study outline:**

- **Problem:** When you're running long AI coding tasks, you switch to other work. There's no way to know when the agent finishes, errors out, or needs input — unless you keep checking. Screen-based notifications get lost in the noise.
- **Approach:** Build a plugin that hooks into OpenCode's task lifecycle and triggers voice notifications via the user's preferred TTS engine. Abstract the TTS layer so any engine (cloud or local) can be plugged in. Support ElevenLabs (high quality, paid), Edge TTS (free, decent), Windows SAPI (local, always available), and OpenAI-compatible endpoints.
- **Challenges:** Each TTS engine has different auth, latency, and quality characteristics. Edge TTS is free but sometimes rate-limited. SAPI sounds robotic but works offline. Making the provider abstraction clean enough that adding a new engine is a single file, not a refactor.
- **Results:** 52 stars, 6 forks. Tied for highest-starred original project. Multi-provider abstraction got praise for being extensible.
- **What I'd do differently:** Add a "summary mode" — instead of reading the full output, narrate a one-sentence status. No one wants to hear 200 lines of console output read aloud.

---

### 4. FBScrapeIdeas — Data Mining + AI Integration

| Field | Detail |
|---|---|
| **Stars** | 35 · 10 forks |
| **Language** | Python |
| **URL** | [github.com/MasuRii/FBScrapeIdeas](https://github.com/MasuRii/FBScrapeIdeas) |
| **Tech** | Python, Playwright, Gemini AI, NLP, CLI |

**What it is:** A CLI tool for scraping Facebook groups and analyzing the content using Gemini AI. Features self-healing selectors (when Facebook changes their HTML, the tool recovers), session security, and offline local analysis.

**Case study outline:**

- **Problem:** Facebook groups are rich sources of market research and community sentiment, but there's no API to extract structured data. Manual scrolling and note-taking doesn't scale.
- **Approach:** Automate group browsing with Playwright. Extract posts and comments. Feed the raw text to Gemini for summarization, sentiment analysis, and idea extraction. Run all analysis locally so data never leaves the machine.
- **Challenges:** Facebook changes their DOM constantly — selectors break weekly. Built self-healing selectors with fallback strategies. Session management (login, cookies, rate limits). Handling the volume: a single group can have thousands of posts.
- **Results:** 35 stars, 10 forks (highest fork count of any MasuRii repo). Active community usage.
- **What I'd do differently:** Add export formats (CSV, JSON, Markdown) earlier. The initial version only had terminal output, which limited what people could do with the data.

---

### 5. AudioScholar — Full-Stack Real Product

| Field | Detail |
|---|---|
| **Stars** | 1 |
| **Language** | Kotlin (Android) + React (Web) |
| **URL** | [github.com/MasuRii/AudioScholar](https://github.com/MasuRii/AudioScholar) |
| **Live demo** | Deployed on Vercel |
| **Tech** | Kotlin, Android SDK, React, AI audio summarization, Vercel |

**What it is:** An audio summarization platform with a mobile Android app and a web interface. Upload or record audio, get an AI-generated summary. Live and deployed.

**Case study outline:**

- **Problem:** Students and researchers sit through long lectures and meetings. Taking notes in real time is exhausting. Reviewing hour-long recordings later is worse.
- **Approach:** Build a cross-platform tool — native Android for mobile recording, React web app for desktop use. Connect to an AI summarization backend. Make the UX dead simple: record → upload → get summary. No configuration.
- **Challenges:** Audio processing latency. Kotlin/React is an unusual combo — sharing types and validation logic across platforms requires discipline. Mobile audio recording has edge cases (background recording, permissions, storage).
- **Results:** Live product on Vercel. Capstone-level project for an academic setting.
- **What I'd do differently:** I'd start with the web version and add mobile later — the Android app took disproportionate effort relative to usage. Web-first would have shipped faster.

---

### Bonus: RustDupe — Systems Programming Breadth

| Field | Detail |
|---|---|
| **Stars** | 2 |
| **Language** | Rust |
| **URL** | [github.com/MasuRii/RustDupe](https://github.com/MasuRii/RustDupe) |
| **Published** | [crates.io](https://crates.io) |
| **Tech** | Rust, BLAKE3 hashing, interactive TUI |

**Why include it:** Most of the portfolio is Python/TypeScript/Rust-infra. RustDupe is different — it's a native Rust CLI tool with an interactive TUI, published as a crate. It shows breadth: this person doesn't just build for the web. It also demonstrates an understanding of systems-level concerns (file I/O, hashing algorithms, terminal rendering).

**Short pitch for portfolio:** "Smart duplicate file finder with BLAKE3 hashing and an interactive TUI. Published on crates.io."

---

## Projects Explicitly NOT on the Portfolio (And Why)

| Project | Reason |
|---|---|
| echoes-of-the-void / snake-game-test | No activity beyond initial commit — not polished enough to showcase |
| wtr-lab-*系列 (5 repos) | Niche userscript collection — interesting but too fragmented to feature individually; could be a single "Userscripts" project card |
| ItemExchangeApplication / QuickFix-PH | Older, low-effort projects; don't represent current skill level |
| Template repos (6 repos) | Could be a single "Templates" card at most; not individual showcases |
| Fork-only repos (chat-relay, etc.) | Show protocol bridging expertise, but are forks — feature the concept under AIstudioProxyAPI's case study instead |

---

## Using This Inventory

When building the portfolio:

1. **Each project gets a dedicated case study page** — not just a card with a GitHub link. Use the Problem → Approach → Challenges → Results → Learnings structure from the outlines above.
2. **Adapt, don't copy-paste** — The outlines above are starting points. Fill in specific numbers, specific bugs, specific decisions you remember. The details are what make it feel real.
3. **Order matters** — Lead with AIstudioProxyAPI-EN (strongest narrative hook for technical visitors), then pi-tool-display (shows UX taste), then opencode-smart-voice-notify (accessibility angle), then FBScrapeIdeas (data/AI), then AudioScholar (full-stack product). RustDupe as the bonus shows breadth.
4. **Cross-link to live demos wherever possible** — AudioScholar and CITUCourseBuilder have live deployments. Use them.

For the full project data (language breakdowns, all 51 repos, star/fork counts), see the research source: [`docs/research/github-projects-catalog-2026-04-12.md`](research/github-projects-catalog-2026-04-12.md).