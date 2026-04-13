/**
 * Single source of truth for all portfolio project data.
 *
 * This data layer replaces the previous pattern of hardcoded project arrays
 * scattered across Astro components. All project pages and components import
 * from this file.
 *
 * Schema follows the TUI/CLI Redesign Brief §4.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type Cluster =
  | 'ai-infra'
  | 'dev-tooling'
  | 'full-stack'
  | 'systems'
  | 'templates'
  | 'userscripts'
  | 'transport';

export type ProjectTier = 'flagship' | 'notable' | 'extension';

export const tierLabels: Record<ProjectTier, string> = {
  flagship: 'Flagship',
  notable: 'Notable',
  extension: 'Extension',
};

export const tierDescriptions: Record<ProjectTier, string> = {
  flagship: 'Core products and high-impact infrastructure — the work that defines me.',
  notable: 'Solid projects with live demos, published packages, or community traction.',
  extension: 'Smaller scoped plugins, userscripts, and templates — useful, but supporting work.',
};

export const tierTuiPrefix: Record<ProjectTier, string> = {
  flagship: '##',
  notable: ' #',
  extension: '  ·',
};

export interface ProjectScreenshot {
  /** Stable image URL (raw.githubusercontent.com or github/user-attachments) */
  url: string;
  /** Descriptive alt text */
  alt: string;
  /** Optional width for aspect-ratio hint */
  width?: number;
  /** Optional height for aspect-ratio hint */
  height?: number;
}

export interface Project {
  /** kebab-case slug used for URLs and keys */
  id: string;
  /** Display name */
  title: string;
  /** One-line description */
  tagline: string;
  /** Longer paragraph description */
  description: string;
  /** GitHub repo URL */
  repo: string;
  /** Live deployment URL (if any) */
  demo?: string;
  /** Primary language */
  language: string;
  /** GitHub stars */
  stars: number;
  /** GitHub forks */
  forks: number;
  /** GitHub topics */
  topics: string[];
  /** Thematic cluster */
  cluster: Cluster;
  /** Confirmed screenshot/preview assets */
  screenshots: ProjectScreenshot[];
  /** npm package URL (for Pi/OpenCode extensions) */
  npm?: string;
  /** crates.io URL (for Rust projects) */
  crates?: string;
  /** Show in featured showcase on homepage */
  featured: boolean;
  /** Sort order for featured projects (lower = higher priority) */
  featuredOrder: number;
  /** Recruiter-friendly tier classification */
  tier: ProjectTier;
  /** Last GitHub update date (YYYY-MM-DD) */
  updated: string;
}

// ─── Cluster metadata ───────────────────────────────────────────────────────

export interface ClusterInfo {
  id: Cluster;
  label: string;
  tuiHeader: string;
  description: string;
}

export const clusters: ClusterInfo[] = [
  {
    id: 'ai-infra',
    label: 'AI Infrastructure',
    tuiHeader: '# ai-infra',
    description: 'Proxies, agents, and data pipelines for AI tooling.',
  },
  {
    id: 'dev-tooling',
    label: 'Dev Tooling — OpenCode & Pi',
    tuiHeader: '# dev-tooling',
    description: 'Extensions for terminal coding agents. 10 shipped in 3 months.',
  },
  {
    id: 'full-stack',
    label: 'Full-Stack Products',
    tuiHeader: '# products',
    description: 'Real products serving real users.',
  },
  {
    id: 'systems',
    label: 'Systems & Crates',
    tuiHeader: '# systems',
    description: 'Rust CLI tools and native binaries.',
  },
];

// ─── Grouped project collections ─────────────────────────────────────────────

export interface GroupedProject {
  id: string;
  title: string;
  description: string;
  repos: string[];
  aggregateStars: number;
  screenshot?: ProjectScreenshot;
}

export const piEcosystem: GroupedProject = {
  id: 'pi-ecosystem',
  title: 'Pi & OpenCode Ecosystem',
  description:
    '10 extensions for Pi and OpenCode coding agents — from tool display and voice notifications to auth, image handling, and LSP bridges. Combined 145★+ across the ecosystem.',
  repos: [
    'pi-tool-display',
    'opencode-smart-voice-notify',
    'pi-rtk-optimizer',
    'opencode-godot-lsp',
    'pi-permission-system',
    'pi-image-tools',
    'pi-multi-auth',
  ],
  aggregateStars: 145,
  screenshot: {
    url: 'https://github.com/user-attachments/assets/777944a2-18b2-4642-b035-2c703a5abb1b',
    alt: 'pi-tool-display showing compact diff rendering in terminal',
    width: 1360,
    height: 752,
  },
};

export const wtrLabSuite: GroupedProject = {
  id: 'wtr-lab-suite',
  title: 'WTR-Lab Enhancement Suite',
  description:
    '5 userscripts for enhanced web novel reading — AI-powered image generation, translation review, term replacement, and consistency checking.',
  repos: [
    'wtr-lab-novel-image-generator',
    'wtr-lab-novel-reviewer',
    'wtr-lab-term-replacer',
    'wtr-term-inconsistency-finder',
    'wtr-lab-enhancer',
  ],
  aggregateStars: 8,
};

export const templateSuite: GroupedProject = {
  id: 'templates',
  title: 'Website Templates',
  description:
    '6 production-ready templates with live demos — portfolio, SaaS, restaurant, photography, travel, and education.',
  repos: [
    'dev-portfolio-template',
    'restaurant-website-template',
    'ModernSaaS-LandingPage-Template',
    'modernphotography-portfolio-template',
    'travelblog-website-template',
    'education-website-template',
  ],
  aggregateStars: 9,
  screenshot: {
    url: 'https://raw.githubusercontent.com/MasuRii/dev-portfolio-template/main/sample/image.png',
    alt: 'Developer portfolio template preview',
  },
};

export const transportSuite: GroupedProject = {
  id: 'transport',
  title: 'RecursiveDev — Philippines Transport',
  description:
    'Open-source transport tools for the Philippines — jeepney routing and fare estimation for Metro Cebu.',
  repos: ['JeepMe', 'ReCursor', 'Pasahe'],
  aggregateStars: 0,
};

// ─── Project data (14 showcase entries) ──────────────────────────────────────

export const projects: Project[] = [
  // ── Cluster: AI Infrastructure ──
  {
    id: 'aistudio-proxy-api',
    title: 'AIstudioProxyAPI-EN',
    tagline: 'OpenAI-compatible proxy for Google AI Studio via browser automation.',
    description:
      'FastAPI server exposing an OpenAI-compatible endpoint that routes requests to Google AI Studio using Playwright and Camoufox. Makes a web-only AI model programmatically accessible without changing your OpenAI client code.',
    repo: 'https://github.com/MasuRii/AIstudioProxyAPI-EN',
    language: 'Python',
    stars: 35,
    forks: 7,
    topics: ['camoufox', 'fastapi', 'gemini', 'google-ai-studio', 'openai-api', 'proxy', 'python'],
    cluster: 'ai-infra',
    screenshots: [],
    featured: true,
    featuredOrder: 3,
    tier: 'flagship',
    updated: '2026-04-05',
  },
  {
    id: 'fbscrapeideas',
    title: 'FBScrapeIdeas',
    tagline: 'CLI for scraping Facebook groups and analyzing content with Gemini AI.',
    description:
      'Modern CLI tool for scraping and analyzing Facebook groups using Playwright and the Gemini AI API. Features self-healing selectors that recover when Facebook changes their DOM.',
    repo: 'https://github.com/MasuRii/FBScrapeIdeas',
    language: 'Python',
    stars: 35,
    forks: 10,
    topics: ['academic-research', 'ai', 'cli', 'data-extraction', 'facebook-scraper', 'gemini-api'],
    cluster: 'ai-infra',
    screenshots: [
      {
        url: 'https://raw.githubusercontent.com/MasuRii/FBScrapeIdeas/master/assets/CLIScreenshot_2.png',
        alt: 'FBScrapeIdeas CLI interface showing data extraction results',
      },
    ],
    featured: true,
    featuredOrder: 4,
    tier: 'flagship',
    updated: '2026-04',
  },
  {
    id: 'masusensei-bot',
    title: 'MasuSenseiBotV3-Agent',
    tagline: 'Educational code review agent — a wise, patient teacher for repositories.',
    description:
      'An AI agent that reviews code repositories with a teacher persona. Provides educational feedback rather than simple linting, helping developers understand why changes matter.',
    repo: 'https://github.com/MasuRii/MasuSenseiBotV3-Agent',
    language: 'Python',
    stars: 1,
    forks: 0,
    topics: ['ai', 'code-review', 'agent'],
    cluster: 'ai-infra',
    screenshots: [],
    featured: false,
    featuredOrder: 99,
    tier: 'notable',
    updated: '2026',
  },
  // ── Cluster: Developer Tooling ──
  {
    id: 'pi-tool-display',
    title: 'pi-tool-display',
    tagline: 'Compact tool rendering, diff visualization, and output truncation for Pi TUI.',
    description:
      'Terminal rendering extension for the Pi coding agent that makes tool calls, diffs, and truncated output scannable instead of overwhelming. The highest-starred Pi extension at 52★.',
    repo: 'https://github.com/MasuRii/pi-tool-display',
    language: 'TypeScript',
    stars: 52,
    forks: 8,
    topics: ['pi', 'tui', 'diff', 'extension'],
    cluster: 'dev-tooling',
    screenshots: [
      {
        url: 'https://github.com/user-attachments/assets/777944a2-18b2-4642-b035-2c703a5abb1b',
        alt: 'pi-tool-display showing compact rendering in terminal',
        width: 1360,
        height: 752,
      },
      {
        url: 'https://github.com/user-attachments/assets/7d5e36d3-cbe1-4d54-8bed-ae3dbdef870c',
        alt: 'pi-tool-display full-screen diff view',
        width: 1920,
        height: 1080,
      },
    ],
    featured: true,
    featuredOrder: 1,
    tier: 'flagship',
    updated: '2026-04',
  },
  {
    id: 'opencode-smart-voice-notify',
    title: 'opencode-smart-voice-notify',
    tagline: 'Smart voice notifications for OpenCode with multi-engine TTS support.',
    description:
      'Voice notification plugin for OpenCode supporting ElevenLabs, Edge TTS, Windows SAPI, and OpenAI-compatible endpoints. Accessibility-focused, multi-provider plugin architecture.',
    repo: 'https://github.com/MasuRii/opencode-smart-voice-notify',
    language: 'TypeScript',
    stars: 52,
    forks: 6,
    topics: ['accessibility', 'edge-tts', 'elevenlabs', 'opencode', 'text-to-speech'],
    cluster: 'dev-tooling',
    screenshots: [
      {
        url: 'https://github.com/user-attachments/assets/52ccf357-2548-400b-a346-6362f2fc3180',
        alt: 'opencode-smart-voice-notify configuration panel',
        width: 1456,
        height: 720,
      },
    ],
    featured: true,
    featuredOrder: 2,
    tier: 'flagship',
    updated: '2026-04',
  },
  {
    id: 'pi-rtk-optimizer',
    title: 'pi-rtk-optimizer',
    tagline: 'RTK command rewriting and tool output compaction for Pi.',
    description:
      'Extension for Pi that rewrites commands and compacts tool output, saving tokens and improving agent performance. Demonstrates pipeline-based optimization for coding agents.',
    repo: 'https://github.com/MasuRii/pi-rtk-optimizer',
    language: 'TypeScript',
    stars: 19,
    forks: 4,
    topics: ['pi', 'rtk', 'optimization', 'tokens'],
    cluster: 'dev-tooling',
    screenshots: [
      {
        url: 'https://github.com/user-attachments/assets/f4536889-62ec-429a-984e-dc0de9f1f709',
        alt: 'pi-rtk-optimizer reducing token usage',
        width: 1360,
        height: 752,
      },
    ],
    featured: true,
    featuredOrder: 5,
    tier: 'notable',
    updated: '2026-04',
  },
  {
    id: 'opencode-godot-lsp',
    title: 'opencode-godot-lsp',
    tagline: 'GDScript LSP bridge for OpenCode — enables Godot language server support.',
    description:
      'Language Server Protocol bridge connecting OpenCode to the Godot engine LSP. Enables GDScript autocompletion, diagnostics, and hover info inside the OpenCode terminal.',
    repo: 'https://github.com/MasuRii/opencode-godot-lsp',
    language: 'JavaScript',
    stars: 13,
    forks: 0,
    topics: ['game-development', 'gdscript', 'godot', 'language-server', 'lsp'],
    cluster: 'dev-tooling',
    screenshots: [],
    featured: false,
    featuredOrder: 99,
    tier: 'extension',
    updated: '2026',
  },
  {
    id: 'pi-permission-system',
    title: 'pi-permission-system',
    tagline: 'Permission enforcement extension for Pi.',
    description:
      'Security and permission management extension for the Pi coding agent. Controls which tools can execute and under what conditions.',
    repo: 'https://github.com/MasuRii/pi-permission-system',
    language: 'TypeScript',
    stars: 10,
    forks: 0,
    topics: ['pi', 'permissions', 'security'],
    cluster: 'dev-tooling',
    screenshots: [
      {
        url: 'https://github.com/user-attachments/assets/3e85190a-17fa-4d94-ac8e-efa54337df5d',
        alt: 'pi-permission-system access control interface',
        width: 1360,
        height: 752,
      },
    ],
    featured: false,
    featuredOrder: 99,
    tier: 'extension',
    updated: '2026',
  },
  {
    id: 'pi-image-tools',
    title: 'pi-image-tools',
    tagline: 'Image attachment and preview extension for Pi TUI.',
    description:
      'Extension for Pi that adds image attachment and preview capabilities to the TUI, using Sixel or Kitty image protocols where available, with graceful fallback to URL display.',
    repo: 'https://github.com/MasuRii/pi-image-tools',
    language: 'TypeScript',
    stars: 5,
    forks: 0,
    topics: ['pi', 'image-processing', 'media-handling'],
    cluster: 'dev-tooling',
    screenshots: [
      {
        url: 'https://github.com/user-attachments/assets/c7b462c4-6316-495e-a3fa-5a7e22edd91f',
        alt: 'pi-image-tools inline image preview in terminal',
        width: 1360,
        height: 752,
      },
    ],
    featured: false,
    featuredOrder: 99,
    tier: 'extension',
    updated: '2026',
  },
  {
    id: 'pi-multi-auth',
    title: 'pi-multi-auth',
    tagline: 'Multi-provider credential management, OAuth login, and account rotation for Pi.',
    description:
      'Extension for Pi that manages credentials across multiple AI providers. Supports OAuth login, API key rotation, and account switching — essential infrastructure for multi-provider agent workflows.',
    repo: 'https://github.com/MasuRii/pi-multi-auth',
    language: 'TypeScript',
    stars: 3,
    forks: 0,
    topics: ['pi', 'oauth', 'multi-provider', 'authentication', 'security'],
    cluster: 'dev-tooling',
    screenshots: [
      {
        url: 'https://github.com/user-attachments/assets/1aff63b4-0e1e-4eaa-93b4-5f4f9188224b',
        alt: 'pi-multi-auth architecture overview',
        width: 1024,
        height: 506,
      },
    ],
    featured: false,
    featuredOrder: 99,
    tier: 'extension',
    updated: '2026',
  },
  // ── Cluster: Full-Stack Products ──
  {
    id: 'audioscholar',
    title: 'AudioScholar',
    tagline: 'Dual-platform audio summarization — Android app + React web interface.',
    description:
      'Upload or record audio, get an AI-generated summary. Ships as both a native Android app (Kotlin) and a React web interface, deployed live on Vercel.',
    repo: 'https://github.com/MasuRii/AudioScholar',
    demo: 'https://audioscholar.vercel.app/',
    language: 'Kotlin',
    stars: 1,
    forks: 0,
    topics: ['kotlin', 'react', 'ai', 'audio-summarization'],
    cluster: 'full-stack',
    screenshots: [
      {
        url: 'https://raw.githubusercontent.com/MasuRii/AudioScholar/main/logo/AudioScholarLogoNoBG.png',
        alt: 'AudioScholar logo',
      },
    ],
    featured: true,
    featuredOrder: 7,
    tier: 'notable',
    updated: '2026',
  },
  {
    id: 'citu-course-builder',
    title: 'CITUCourseBuilder',
    tagline: 'Class schedule planner for CITU students — filter, optimize, and build timetables.',
    description:
      'Web app built with Astro + React (same stack as this portfolio) that helps CITU students plan, filter, and optimize their class schedules. Community product with a live GitHub Pages deployment.',
    repo: 'https://github.com/MasuRii/CITUCourseBuilder',
    demo: 'https://masurii.github.io/CITUCourseBuilder/',
    language: 'TypeScript',
    stars: 2,
    forks: 1,
    topics: ['coursebuilder', 'class-scheduler', 'astro', 'react', 'student-tool'],
    cluster: 'full-stack',
    screenshots: [],
    featured: false,
    featuredOrder: 99,
    tier: 'notable',
    updated: '2026',
  },
  {
    id: 'luv-charms-ecommerce',
    title: "Luv Charms E-commerce",
    tagline: "E-commerce for handmade bracelets with a 'Checkout to Messenger' workflow.",
    description:
      "Next.js 16 + React 19 e-commerce site for a handmade bracelet business. Features a 'Checkout to Messenger' workflow optimized for the Philippines market and social-first selling.",
    repo: 'https://github.com/MasuRii/Luv-Charms-E-commerce',
    demo: 'https://luv-charms-e-commerce.vercel.app',
    language: 'TypeScript',
    stars: 1,
    forks: 0,
    topics: ['nextjs', 'ecommerce', 'messenger', 'philippines'],
    cluster: 'full-stack',
    screenshots: [],
    featured: false,
    featuredOrder: 99,
    tier: 'notable',
    updated: '2026',
  },
  // ── Cluster: Systems ──
  {
    id: 'rustdupe',
    title: 'RustDupe',
    tagline: 'Smart duplicate file finder with BLAKE3 hashing and an interactive TUI.',
    description:
      'Rust CLI tool with an interactive TUI that finds duplicate files using BLAKE3 hashing. Published on crates.io. Demonstrates systems programming breadth beyond web/TypeScript.',
    repo: 'https://github.com/MasuRii/RustDupe',
    demo: 'https://crates.io/crates/rustdupe',
    crates: 'https://crates.io/crates/rustdupe',
    language: 'Rust',
    stars: 2,
    forks: 0,
    topics: ['blake3', 'cli', 'deduplication', 'rust', 'tui'],
    cluster: 'systems',
    screenshots: [
      {
        url: 'https://raw.githubusercontent.com/MasuRii/RustDupe/master/public/images/rustdupe_tuiscreenshot.png',
        alt: 'RustDupe TUI showing interactive duplicate file scan results',
      },
    ],
    featured: true,
    featuredOrder: 6,
    tier: 'notable',
    updated: '2026',
  },
];

// ─── Derived helpers ─────────────────────────────────────────────────────────

/** Get featured projects, sorted by featuredOrder */
export function getFeaturedProjects(): Project[] {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder);
}

/** Get projects by cluster */
export function getProjectsByCluster(cluster: Cluster): Project[] {
  return projects.filter((p) => p.cluster === cluster);
}

/** Get projects by tier */
export function getProjectsByTier(tier: ProjectTier): Project[] {
  return projects.filter((p) => p.tier === tier);
}

/** Get a project by slug ID */
export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

/** All project IDs for static path generation */
export function getAllProjectIds(): string[] {
  return projects.map((p) => p.id);
}

/** Get all unique tiers present in the project data */
export function getAllTiers(): ProjectTier[] {
  const tierSet = new Set<ProjectTier>(projects.map(p => p.tier));
  return (['flagship', 'notable', 'extension'] as ProjectTier[]).filter(t => tierSet.has(t));
}

/** Get all unique languages across projects */
export function getAllLanguages(): string[] {
  const langs = new Set(projects.map(p => p.language));
  return [...langs].sort();
}

// ─── Confirmed contact/social links ────────────────────────────────────────────

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: 'github' | 'linkedin' | 'facebook' | 'greasyfork' | 'org';
}

/** Only confirmed public social/contact profiles */
export const socialLinks: SocialLink[] = [
  {
    id: 'github',
    label: 'github/MasuRii',
    url: 'https://github.com/MasuRii',
    icon: 'github',
  },
  {
    id: 'linkedin',
    label: 'linkedin/MasuRii',
    url: 'https://www.linkedin.com/in/math-lee-biacolo-729287190',
    icon: 'linkedin',
  },
  {
    id: 'facebook',
    label: 'fb/MasuriiMathlee',
    url: 'https://www.facebook.com/MasuriiMathlee',
    icon: 'facebook',
  },
  {
    id: 'greasyfork',
    label: 'greasyfork/masuriii',
    url: 'https://greasyfork.org/en/users/1433142-masuriii',
    icon: 'greasyfork',
  },
  {
    id: 'recursive',
    label: 'org/RecursiveDev',
    url: 'https://github.com/RecursiveDev',
    icon: 'org',
  },
];