# MasuRii Portfolio
masurii.dev

## What

Personal portfolio and project showcase. Static site built with Astro 5, React islands, and Tailwind CSS.

## Stack

- **Runtime:** Node.js 20+
- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS 3.4
- **Interactivity:** React 19 (islands only)
- **Content:** MDX
- **Fonts:** Space Grotesk, JetBrains Mono (via @fontsource — self-hosted, no external requests)

## Development

```bash
npm install
npm run dev       # → http://localhost:4321
npm run build     # → dist/
npm run preview   # → preview production build locally
```

## Deployment

Built for static hosting. Deploy `dist/` to any static host.

### Netlify (recommended)

Connected to GitHub — push to `main` triggers automatic build. Configuration in `netlify.toml`.

### Vercel

```bash
npx vercel --prod
```

No special configuration needed; Astro's static output works with Vercel's static preset.

### Other hosts (Cloudflare Pages, Fly.io, Render)

Set build command to `npm run build` and publish directory to `dist/`.

## Project structure

```
public/          → Static assets (favicon, OG image, robots.txt)
src/
  components/    → UI components (Astro + React islands)
  layouts/        → Page layouts (BaseLayout, CaseStudyLayout)
  pages/          → File-based routing
  styles/         → Global CSS
```

## Content guidelines

- No AI slop. See `docs/ADVICE.md` and `docs/04-ui-ux-design-guide.md`.
- All personal facts come from verified sources — no fabricated achievements.
- Accessibility: skip-links, focus-visible, semantic HTML, minimum 44px touch targets.