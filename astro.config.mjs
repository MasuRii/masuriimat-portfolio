import { defineConfig } from 'astro/config';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

// For GitHub Pages: uses repo name as base path
// For custom domain: change site to your domain and remove base
const siteUrl = process.env.SITE_URL || 'https://masurii.github.io/masuriimat-portfolio';

export default defineConfig({
  site: siteUrl,
  base: '/masuriimat-portfolio', // Comment out for custom domain
  integrations: [
    react(),
    mdx(),
    sitemap(),
  ],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    ssr: {
      noExternal: ['@fontsource/space-grotesk'],
    },
  },
});