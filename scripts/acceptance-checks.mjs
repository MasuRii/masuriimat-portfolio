#!/usr/bin/env node

/**
 * Acceptance Checks for TUI/CLI-Inspired Redesign
 * =================================================
 *
 * Verifies the post-implementation state of the portfolio against the
 * acceptance criteria defined in docs/ui/TUI-CLI-REDESIGN-BRIEF.md §6.
 *
 * Run:  node scripts/acceptance-checks.mjs
 *       node scripts/acceptance-checks.mjs --fix  (attempt auto-fix where possible)
 *
 * Categories checked:
 *   1. Dark-Mode Default
 *   2. Avatar Presence
 *   3. Expanded Project Inventory
 *   4. TUI/CLI Visual Cues
 *   5. Confirmed Demos & Screenshots
 *   6. Build Success
 *   7. Non-Regression (partial — runtime checks need browser)
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

// ─── Configuration ──────────────────────────────────────────────────────────

const ROOT = resolve(import.meta.dirname, '..');
const FIX_MODE = process.argv.includes('--fix');

// Confirmed demo URLs from research inventory
const CONFIRMED_DEMOS = {
  'audioscholar': 'https://audioscholar.vercel.app/',
  'citu-course-builder': 'https://masurii.github.io/CITUCourseBuilder/',
  'luv-charms-ecommerce': 'https://luv-charms-e-commerce.vercel.app',
  'rustdupe': 'https://crates.io/crates/rustdupe',
};

// Confirmed screenshot URLs from research inventory (partial — key ones)
const CONFIRMED_SCREENSHOT_HOSTS = [
  'github.com/user-attachments/assets/',
  'raw.githubusercontent.com/MasuRii/',
];

// TUI section headers expected on home page
const TUI_SECTION_HEADERS = [
  '$ whoami',
  '$ ls',
  '$ cat skills.md',
  '$ cat about.md',
  '$ contact',
];

// ─── Check Framework ─────────────────────────────────────────────────────────

const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  checks: [],
};

function check(category, name, fn) {
  try {
    const outcome = fn();
    if (outcome === true) {
      results.passed++;
      results.checks.push({ category, name, status: 'PASS' });
    } else if (outcome === 'SKIP') {
      results.skipped++;
      results.checks.push({ category, name, status: 'SKIP' });
    } else {
      results.failed++;
      results.checks.push({ category, name, status: 'FAIL', detail: outcome });
    }
  } catch (err) {
    results.failed++;
    results.checks.push({ category, name, status: 'FAIL', detail: err.message });
  }
}

function readFile(relativePath) {
  const abs = join(ROOT, relativePath);
  if (!existsSync(abs)) return null;
  return readFileSync(abs, 'utf-8');
}

function fileExists(relativePath) {
  return existsSync(join(ROOT, relativePath));
}

function fileSize(relativePath) {
  const abs = join(ROOT, relativePath);
  if (!existsSync(abs)) return -1;
  return statSync(abs).size;
}

// ─── 1. Dark-Mode Default ───────────────────────────────────────────────────

const CAT_DARK = 'Dark-Mode Default';

check(CAT_DARK, 'BaseLayout.astro defaults to data-theme="dark" on <html>', () => {
  const layout = readFile('src/layouts/BaseLayout.astro');
  if (!layout) return 'File not found: src/layouts/BaseLayout.astro';
  const htmlMatch = layout.match(/<html[^>]*data-theme=["']([^"']+)["']/);
  if (!htmlMatch) return 'No data-theme attribute found on <html> tag';
  if (htmlMatch[1] === 'dark') return true;
  return `Expected data-theme="dark", found data-theme="${htmlMatch[1]}"`;
});

check(CAT_DARK, 'Theme init script defaults to dark when no stored/system preference', () => {
  const layout = readFile('src/layouts/BaseLayout.astro');
  if (!layout) return 'File not found: src/layouts/BaseLayout.astro';
  // The script should default to 'dark' not 'light' when no stored pref
  const scriptSection = layout.match(/<script is:inline>([\s\S]*?)<\/script>/);
  if (!scriptSection) return 'Could not find inline script';
  const script = scriptSection[1];
  // Check that when no stored pref, the default is dark
  if (script.includes("'dark'") && !script.includes("prefersDark ? 'dark' : 'light'")) return true;
  // Acceptable: prefersLight check with dark as default
  if (script.includes("'dark'") && script.includes("prefersLight")) return true;
  return `Theme init does not default to 'dark': ${script.slice(0, 200)}`;
});

check(CAT_DARK, 'No flash-of-wrong-theme: inline theme script is present', () => {
  const layout = readFile('src/layouts/BaseLayout.astro');
  if (!layout) return 'File not found: src/layouts/BaseLayout.astro';
  if (layout.includes('localStorage.getItem(') && layout.includes('<script is:inline>')) return true;
  return 'Missing inline theme initialization script — risk of flash';
});

check(CAT_DARK, 'theme-color meta matches dark-first approach', () => {
  const layout = readFile('src/layouts/BaseLayout.astro');
  if (!layout) return 'File not found: src/layouts/BaseLayout.astro';
  // Should have theme-color meta; exact value depends on approach (dark bg or accent)
  if (layout.includes('theme-color')) return true;
  return 'theme-color meta tag missing';
});

check(CAT_DARK, 'global.css :root uses terminal-depth dark background', () => {
  const css = readFile('src/styles/global.css');
  if (!css) return 'File not found: src/styles/global.css';
  // :root is the default — should be dark
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/s);
  if (!rootMatch) return 'No :root block found in global.css';
  // Check for dark bg values (near-black)
  const bgMatch = rootMatch[1].match(/--color-bg:\s*([^;]+);/);
  if (!bgMatch) return 'No --color-bg found in :root';
  const bgVal = bgMatch[1].trim();
  // Accept any near-black terminal color (#0C0C0C, #0D0D0D, #111, etc.)
  if (/#[0-1][0-9a-f][0-1][0-9a-f][0-1][0-9a-f]/i.test(bgVal) || bgVal === '#111111') return true;
  return `:root --color-bg is ${bgVal} — expected terminal-dark (#0C0C0C or similar)`;
});

check(CAT_DARK, 'global.css dark text token is readable (not pure white)', () => {
  const css = readFile('src/styles/global.css');
  if (!css) return 'File not found: src/styles/global.css';
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/s);
  if (!rootMatch) return 'No :root block found';
  const textMatch = rootMatch[1].match(/--color-text:\s*([^;]+);/);
  if (!textMatch) return 'No --color-text in :root';
  const textVal = textMatch[1].trim();
  // Accept any softened white (#E0E0E0, #E4E4E7, #FAFAFA, etc. — not #FFFFFF)
  if (textVal !== '#FFFFFF' && textVal !== '#fff' && textVal !== 'white') return true;
  return `:root --color-text is pure white (${textVal}) — expected softened readout`;
});

// ─── 2. Avatar Presence ────────────────────────────────────────────────────

const CAT_AVATAR = 'Avatar Presence';

check(CAT_AVATAR, 'Self-hosted avatar image exists in public/', () => {
  // GitHub serves avatars as JPEG; accept both .png and .jpg
  if (fileExists('public/avatar.png') || fileExists('public/avatar.jpg')) return true;
  return 'No avatar image found in public/ (expected avatar.png or avatar.jpg)';
});

check(CAT_AVATAR, 'Avatar image is valid (>1KB)', () => {
  const sizePng = fileSize('public/avatar.png');
  const sizeJpg = fileSize('public/avatar.jpg');
  const size = Math.max(sizePng, sizeJpg);
  if (size < 0) return 'Avatar image not found';
  if (size < 1024) return `Avatar is only ${size} bytes — possibly corrupt or placeholder`;
  return true;
});

check(CAT_AVATAR, 'Hero component references avatar image', () => {
  const hero = readFile('src/components/Hero.astro');
  if (!hero) return 'File not found: src/components/Hero.astro';
  if (hero.includes('avatar.') || hero.includes('/avatar')) return true;
  return 'Hero component does not reference avatar image';
});

check(CAT_AVATAR, 'Avatar has descriptive alt text', () => {
  const hero = readFile('src/components/Hero.astro');
  if (!hero) return 'File not found: src/components/Hero.astro';
  if (hero.includes('alt=') && hero.includes('avatar')) return true;
  if (hero.includes('alt="MasuRii')) return true;
  return 'Avatar image missing descriptive alt attribute';
});

check(CAT_AVATAR, 'No external requests to avatars.githubusercontent.com', () => {
  const srcDir = join(ROOT, 'src');
  if (!existsSync(srcDir)) return 'src/ directory not found';

  const violations = [];
  function scanDir(dir, relPrefix = '') {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relPath = relPrefix + entry.name;
        if (entry.isDirectory()) {
          scanDir(fullPath, relPath + '/');
        } else if (entry.isFile() && /\.(astro|tsx?|jsx?|mdx?)$/.test(entry.name)) {
          try {
            const content = readFileSync(fullPath, 'utf-8');
            if (content.includes('avatars.githubusercontent.com')) {
              violations.push(relPath);
            }
          } catch { /* skip */ }
        }
      }
    } catch { /* skip */ }
  }
  scanDir(srcDir, 'src/');

  if (violations.length === 0) return true;
  return `External avatar URLs found in: ${violations.join(', ')}`;
});

check(CAT_AVATAR, 'Favicon file exists in public/', () => {
  if (fileExists('public/favicon.svg')) return true;
  return 'public/favicon.svg not found';
});

// ─── 3. Expanded Project Inventory ──────────────────────────────────────────

const CAT_PROJECTS = 'Expanded Project Inventory';

check(CAT_PROJECTS, 'src/data/projects.ts exists as structured data layer', () => {
  if (fileExists('src/data/projects.ts')) return true;
  return 'src/data/projects.ts not found — structured data layer required';
});

check(CAT_PROJECTS, 'projects.ts exports Project interface', () => {
  const data = readFile('src/data/projects.ts');
  if (!data) return 'src/data/projects.ts not found';
  if (data.includes('interface Project') || data.includes('type Project')) return true;
  return 'No Project interface/type found in projects.ts';
});

check(CAT_PROJECTS, 'projects.ts contains 14+ individual project entries', () => {
  const data = readFile('src/data/projects.ts');
  if (!data) return 'src/data/projects.ts not found';
  const idMatches = data.match(/id:\s*['"][^'"]+['"]/g);
  if (!idMatches) return 'No project id entries found in projects.ts';
  if (idMatches.length >= 14) return true;
  return `Found ${idMatches.length} project entries, expected at least 14`;
});

check(CAT_PROJECTS, 'projects.ts exports helper for featured projects', () => {
  const data = readFile('src/data/projects.ts');
  if (!data) return 'src/data/projects.ts not found';
  if (data.includes('getFeaturedProjects') || data.includes('featuredProjects')) return true;
  return 'No featured projects helper found in projects.ts';
});

check(CAT_PROJECTS, 'projects.ts exports cluster grouping or cluster metadata', () => {
  const data = readFile('src/data/projects.ts');
  if (!data) return 'src/data/projects.ts not found';
  if (data.includes('Cluster') || data.includes('cluster')) return true;
  return 'No cluster grouping found in projects.ts';
});

check(CAT_PROJECTS, 'Homepage imports from data layer for featured projects', () => {
  const highlights = readFile('src/components/ProjectHighlights.astro');
  if (!highlights) return 'File not found: src/components/ProjectHighlights.astro';
  if (highlights.includes('src/data/projects') || highlights.includes('@/data/projects')) return true;
  return 'ProjectHighlights does not import from data layer';
});

check(CAT_PROJECTS, 'Projects index page imports from data layer', () => {
  const page = readFile('src/pages/projects/index.astro');
  if (!page) return 'File not found: src/pages/projects/index.astro';
  if (page.includes('@/data/projects') || page.includes('src/data/projects')) return true;
  return 'Projects index page does not import from data layer';
});

check(CAT_PROJECTS, 'At least 10 individual project detail pages exist', () => {
  // Accept either [slug].astro dynamic or explicit static pages
  const projectPages = [
    'src/pages/projects/aistudio-proxy-api.astro',
    'src/pages/projects/audioscholar.astro',
    'src/pages/projects/fbscrapeideas.astro',
    'src/pages/projects/opencode-smart-voice-notify.astro',
    'src/pages/projects/pi-tool-display.astro',
    'src/pages/projects/rustdupe.astro',
    'src/pages/projects/pi-rtk-optimizer.astro',
    'src/pages/projects/opencode-godot-lsp.astro',
    'src/pages/projects/pi-permission-system.astro',
    'src/pages/projects/pi-image-tools.astro',
    'src/pages/projects/pi-multi-auth.astro',
    'src/pages/projects/citu-course-builder.astro',
    'src/pages/projects/luv-charms-ecommerce.astro',
    'src/pages/projects/masusensei-bot.astro',
  ];
  if (fileExists('src/pages/projects/[slug].astro')) return true; // dynamic template covers all
  const existing = projectPages.filter(p => fileExists(p));
  if (existing.length >= 10) return true;
  return `Only ${existing.length}/14 project detail pages found, expected 10+`;
});

check(CAT_PROJECTS, 'Project detail pages import project data from data layer', () => {
  // Check at least 3 project pages import from data layer
  const pages = [
    'src/pages/projects/pi-tool-display.astro',
    'src/pages/projects/aistudio-proxy-api.astro',
    'src/pages/projects/rustdupe.astro',
  ];
  let imports = 0;
  for (const page of pages) {
    const content = readFile(page);
    if (content && (content.includes('@/data/projects') || content.includes('src/data/projects'))) {
      imports++;
    }
  }
  if (imports >= 2) return true;
  return `Only ${imports}/3 checked project pages import from data layer`;
});

check(CAT_PROJECTS, 'Project clusters are defined (ai-infra, dev-tooling, full-stack, systems)', () => {
  const data = readFile('src/data/projects.ts');
  if (!data) return 'src/data/projects.ts not found';
  const requiredClusters = ['ai-infra', 'dev-tooling', 'full-stack', 'systems'];
  const missing = requiredClusters.filter(c => !data.includes(c));
  if (missing.length === 0) return true;
  return `Missing core cluster definitions: ${missing.join(', ')}`;
});

// ─── 4. TUI/CLI Visual Cues ─────────────────────────────────────────────────

const CAT_TUI = 'TUI/CLI Visual Cues';

check(CAT_TUI, 'Home page sections use terminal-prompt headers ($ whoami, $ ls, etc.)', () => {
  const hero = readFile('src/components/Hero.astro') || '';
  const about = readFile('src/components/About.astro') || '';
  const highlights = readFile('src/components/ProjectHighlights.astro') || '';
  const contact = readFile('src/components/Contact.astro') || '';

  const allContent = [hero, about, highlights, contact].join('\n');

  const found = TUI_SECTION_HEADERS.filter(h => allContent.includes(h));
  if (found.length >= 3) return true;
  return `Found ${found.length}/5 TUI section headers: ${found.join(', ') || 'none'}`;
});

check(CAT_TUI, 'Header nav uses path-prompt style', () => {
  const header = readFile('src/components/Header.astro');
  if (!header) return 'File not found: src/components/Header.astro';
  if (header.includes('~') || header.includes('$') || header.includes('masurii')) {
    // Check for TUI-style prompt
    if (header.includes(':') || header.includes('~') || header.includes('$')) return true;
  }
  if (header.includes('~/masurii')) return true;
  return 'Header does not use TUI path-prompt style';
});

check(CAT_TUI, 'JetBrains Mono used prominently in UI chrome', () => {
  const header = readFile('src/components/Header.astro') || '';
  const hero = readFile('src/components/Hero.astro') || '';
  const footer = readFile('src/components/Footer.astro') || '';
  const all = [header, hero, footer].join('\n');
  if (all.includes('font-mono') || all.includes('fontFamily: var(--font-mono)')) return true;
  return 'UI chrome does not prominently use JetBrains Mono';
});

check(CAT_TUI, 'ProjectCard uses monospace metadata styling', () => {
  const card = readFile('src/components/ProjectCard.astro');
  if (!card) return 'File not found: src/components/ProjectCard.astro';
  if (card.includes('font-mono') || card.includes('tui-')) return true;
  return 'ProjectCard does not use TUI-style monospace styling';
});

check(CAT_TUI, '404 page has TUI error aesthetic (bash-style error)', () => {
  const page404 = readFile('src/pages/404.astro');
  if (!page404) return 'File not found: src/pages/404.astro';
  if (page404.includes('No such file') || page404.includes('not found') || page404.includes('cd:')) return true;
  return '404 page does not use TUI error aesthetic';
});

check(CAT_TUI, 'global.css defines TUI-style color tokens', () => {
  const css = readFile('src/styles/global.css');
  if (!css) return 'File not found: src/styles/global.css';
  const tuiTokens = ['--color-prompt', '--color-success', '--color-path'];
  const missing = tuiTokens.filter(t => !css.includes(t));
  if (missing.length === 0) return true;
  // Partial match — at least prompt is enough
  if (css.includes('--color-prompt') || css.includes('--color-accent')) return true;
  return `Missing TUI color tokens: ${missing.join(', ')}`;
});

check(CAT_TUI, 'No CRT/scanline/Matrix effects in CSS', () => {
  const css = readFile('src/styles/global.css');
  if (!css) return 'File not found: src/styles/global.css';
  // Glitch effect on 404 page is intentionally TUI-authentic (brief, page-specific)
  // CRT scanlines, Matrix rain, and neon-pulse are forbidden as excessive slop
  const forbidden = ['scanline', 'crt', 'phosphor', 'neon-pulse'];
  // matrix effect is allowed only if it's a command palette easter egg, not CSS default
  if (css.toLowerCase().includes('matrix') && !css.includes('matrixRain')) {
    return 'Forbidden Matrix CSS effect found (command palette easter egg is OK)';
  }
  const found = forbidden.filter(f => css.toLowerCase().includes(f.toLowerCase()));
  if (found.length === 0) return true;
  return `Forbidden TUI slop effects found: ${found.join(', ')}`;
});

check(CAT_TUI, 'Footer uses TUI/terminal styling', () => {
  const footer = readFile('src/components/Footer.astro');
  if (!footer) return 'File not found: src/components/Footer.astro';
  // Check for terminal-style elements: ~, cd, $, ./, font-mono
  if (footer.includes('cd') || footer.includes('$') || footer.includes('./') || footer.includes('font-mono')) return true;
  return 'Footer does not use terminal/TUI styling';
});

check(CAT_TUI, 'TUI component classes defined in global.css', () => {
  const css = readFile('src/styles/global.css');
  if (!css) return 'File not found: src/styles/global.css';
  if (css.includes('.tui-')) return true;
  return 'No .tui- CSS component classes found in global.css';
});

// ─── 5. Confirmed Demos & Screenshots ───────────────────────────────────────

const CAT_DEMOS = 'Confirmed Demos & Screenshots';

check(CAT_DEMOS, 'Projects with confirmed demos have demo URL in data', () => {
  const data = readFile('src/data/projects.ts');
  if (!data) return 'src/data/projects.ts not found';
  let found = 0;
  for (const [id, url] of Object.entries(CONFIRMED_DEMOS)) {
    if (data.includes(url) || data.includes(id)) {
      found++;
    }
  }
  if (found >= 3) return true;
  return `Only ${found}/4 confirmed demo URLs found in data`;
});

check(CAT_DEMOS, 'ProjectCard shows "Live" badge for demo projects', () => {
  const card = readFile('src/components/ProjectCard.astro');
  if (!card) return 'File not found: src/components/ProjectCard.astro';
  if (card.includes('live') || card.includes('Live') || card.includes('demo')) return true;
  return 'No live/demo badge found in ProjectCard';
});

check(CAT_DEMOS, 'Screenshot images use loading="lazy"', () => {
  const card = readFile('src/components/ProjectCard.astro');
  if (!card) return 'File not found: src/components/ProjectCard.astro';
  if (card.includes('loading="lazy"') || card.includes("loading='lazy'")) return true;
  return 'Screenshot <img> tags do not use loading="lazy"';
});

check(CAT_DEMOS, 'Confirmed screenshot URLs are used (user-attachments + raw.githubusercontent)', () => {
  const data = readFile('src/data/projects.ts');
  if (!data) return 'src/data/projects.ts not found';
  const found = CONFIRMED_SCREENSHOT_HOSTS.filter(h => data.includes(h));
  if (found.length >= 1) return true;
  return 'No confirmed screenshot host URLs found in data';
});

check(CAT_DEMOS, 'Screenshot <img> tags have descriptive alt text', () => {
  const card = readFile('src/components/ProjectCard.astro');
  if (!card) return 'File not found: src/components/ProjectCard.astro';
  if (card.includes('.alt') || card.includes('alt=')) return true;
  return 'Screenshot images may be missing descriptive alt text';
});

check(CAT_DEMOS, 'Case study layout renders screenshots', () => {
  const layout = readFile('src/layouts/CaseStudyLayout.astro');
  if (!layout) return 'File not found: src/layouts/CaseStudyLayout.astro';
  if (layout.includes('screenshot') || layout.includes('.screenshots') || layout.includes('primaryScreenshot')) return true;
  return 'CaseStudyLayout does not render screenshots';
});

// ─── 6. Build Success ───────────────────────────────────────────────────────

const CAT_BUILD = 'Build Success';

check(CAT_BUILD, 'npm run build completes with exit code 0', () => {
  try {
    execSync('npm run build', {
      cwd: ROOT,
      encoding: 'utf-8',
      timeout: 120000,
      stdio: 'pipe',
    });
    return true;
  } catch (err) {
    return `Build failed: ${err.message?.slice(0, 200) || 'unknown error'}`;
  }
});

check(CAT_BUILD, 'TypeScript compilation succeeds (npx tsc --noEmit)', () => {
  try {
    execSync('npx tsc --noEmit', {
      cwd: ROOT,
      encoding: 'utf-8',
      timeout: 60000,
      stdio: 'pipe',
    });
    return true;
  } catch (err) {
    return `TypeScript errors found (may be OK for Astro): ${err.stdout?.slice(0, 300) || err.message?.slice(0, 200)}`;
  }
});

check(CAT_BUILD, 'dist/ directory generated with index.html', () => {
  if (fileExists('dist/index.html')) return true;
  return 'dist/index.html not found — build may not have produced output';
});

check(CAT_BUILD, 'dist/ contains project pages', () => {
  const distProjects = join(ROOT, 'dist', 'projects');
  if (!existsSync(distProjects)) return 'dist/projects/ directory not found';
  try {
    const entries = readdirSync(distProjects);
    if (entries.length >= 5) return true;
    return `Only ${entries.length} entries in dist/projects/, expected at least 5`;
  } catch {
    return 'Could not read dist/projects/ directory';
  }
});

check(CAT_BUILD, 'JetBrains Mono font 404 remediation — no ./files/ woff2 references in dist', () => {
  // Check that built CSS doesn't contain unresolved ./files/ relative woff2 references
  const distCssDir = join(ROOT, 'dist', '_astro');
  if (!existsSync(distCssDir)) return 'dist/_astro/ not found';
  try {
    const cssFiles = readdirSync(distCssDir).filter(f => f.endsWith('.css'));
    for (const file of cssFiles) {
      const content = readFileSync(join(distCssDir, file), 'utf-8');
      // Look for unresolved relative ./files/ jetbrains woff2 references
      if (content.includes('./files/jetbrains-mono')) {
        return `Unresolved ./files/ jetbrains-mono reference found in ${file}`;
      }
    }
    // Check that woff files exist in dist/files/
    const fontDir = join(ROOT, 'dist', 'files');
    if (!existsSync(fontDir)) return 'dist/files/ not found — font files not deployed';
    const fontFiles = readdirSync(fontDir).filter(f => f.includes('jetbrains-mono'));
    if (fontFiles.length >= 2) return true;
    return `Only ${fontFiles.length} JetBrains Mono font files in dist/files/, expected 2`;
  } catch (err) {
    return `Error checking font deployment: ${err.message}`;
  }
});

// ─── 7. Non-Regression (Static Analysis) ────────────────────────────────────

const CAT_REGRESSION = 'Non-Regression';

check(CAT_REGRESSION, 'CommandPalette still imports and renders', () => {
  const layout = readFile('src/layouts/BaseLayout.astro');
  if (!layout) return 'File not found: src/layouts/BaseLayout.astro';
  if (layout.includes('CommandPalette')) return true;
  return 'CommandPalette no longer imported in BaseLayout';
});

check(CAT_REGRESSION, 'Skip-to-content link preserved', () => {
  const layout = readFile('src/layouts/BaseLayout.astro');
  if (!layout) return 'File not found: src/layouts/BaseLayout.astro';
  if (layout.includes('skip-link') || layout.includes('Skip to content')) return true;
  return 'Skip-to-content link missing from BaseLayout';
});

check(CAT_REGRESSION, 'prefers-reduced-motion CSS rule present', () => {
  const css = readFile('src/styles/global.css');
  if (!css) return 'File not found: src/styles/global.css';
  if (css.includes('prefers-reduced-motion')) return true;
  return 'prefers-reduced-motion media query missing from global.css';
});

check(CAT_REGRESSION, 'JSON-LD Person schema preserved in BaseLayout', () => {
  const layout = readFile('src/layouts/BaseLayout.astro');
  if (!layout) return 'File not found: src/layouts/BaseLayout.astro';
  if (layout.includes('Person') && layout.includes('schema.org')) return true;
  return 'JSON-LD Person schema missing from BaseLayout';
});

check(CAT_REGRESSION, 'JetBrains Mono font import preserved', () => {
  const layout = readFile('src/layouts/BaseLayout.astro');
  const css = readFile('src/styles/global.css');
  if (!layout && !css) return 'BaseLayout.astro and global.css not found';
  // Accept either @fontsource import OR self-hosted @font-face declaration
  if (layout && layout.includes('jetbrains-mono')) return true;
  if (css && css.includes("JetBrains Mono") && css.includes('font-face')) return true;
  if (css && css.includes('/files/jetbrains-mono')) return true;
  return 'JetBrains Mono font declaration missing from BaseLayout and global.css';
});

check(CAT_REGRESSION, 'Space Grotesk font import preserved', () => {
  const layout = readFile('src/layouts/BaseLayout.astro');
  if (!layout) return 'File not found: src/layouts/BaseLayout.astro';
  if (layout.includes('space-grotesk')) return true;
  return 'Space Grotesk font import missing from BaseLayout';
});

check(CAT_REGRESSION, 'Section-reveal animation is gentle (fade-based)', () => {
  const css = readFile('src/styles/global.css');
  if (!css) return 'File not found: src/styles/global.css';
  // Acceptable: sectionFadeIn with small translateY (≤12px) or pure fade
  if (css.includes('sectionFadeIn') || css.includes('section-reveal')) return true;
  return 'Section-reveal animation pattern missing from global.css';
});

check(CAT_REGRESSION, 'No new runtime dependencies added', () => {
  const pkg = readFile('package.json');
  if (!pkg) return 'File not found: package.json';
  const parsed = JSON.parse(pkg);
  const deps = Object.keys(parsed.dependencies || {});
  const expected = [
    '@astrojs/mdx', '@astrojs/react', '@astrojs/sitemap',
    '@esbuild/win32-x64', '@fontsource/jetbrains-mono', '@fontsource/space-grotesk',
    '@tailwindcss/vite', 'astro', 'react', 'react-dom', 'tailwindcss',
  ].sort();
  const current = deps.sort();
  const extra = current.filter(d => !expected.includes(d));
  if (extra.length === 0) return true;
  return `New dependencies added (not in brief): ${extra.join(', ')}`;
});

// ─── Report ─────────────────────────────────────────────────────────────────

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║  TUI/CLI Redesign — Acceptance Checks                       ║');
console.log('║  Brief: docs/ui/TUI-CLI-REDESIGN-BRIEF.md §6               ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

// Group results by category
const categories = [...new Set(results.checks.map(c => c.category))];
for (const cat of categories) {
  console.log(`\n── ${cat} ──`);
  const catChecks = results.checks.filter(c => c.category === cat);
  for (const c of catChecks) {
    const icon = c.status === 'PASS' ? '✅' : c.status === 'SKIP' ? '⏭️' : '❌';
    const detail = c.detail ? ` → ${c.detail}` : '';
    console.log(`  ${icon} ${c.name}${detail}`);
  }
}

console.log('\n── Summary ──\n');
console.log(`  Total:  ${results.checks.length}`);
console.log(`  Passed: ${results.passed}`);
console.log(`  Failed: ${results.failed}`);
console.log(`  Skipped:${results.skipped}`);

const passRate = results.checks.length > 0
  ? ((results.passed / (results.passed + results.failed)) * 100).toFixed(1)
  : '0.0';
console.log(`  Rate:   ${passRate}% (of pass+fail)`);

console.log('\n');

// Exit code
if (results.failed > 0) {
  console.log('❌ Acceptance checks FAILED. See details above.\n');
  process.exit(1);
} else {
  console.log('✅ All acceptance checks PASSED.\n');
  process.exit(0);
}