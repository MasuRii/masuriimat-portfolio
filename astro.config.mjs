import { defineConfig } from 'astro/config';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://masurii.dev',
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