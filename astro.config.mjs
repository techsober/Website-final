// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// The canonical production URL. Override with the SITE env var at build time
// (e.g. on Cloudflare Pages) so canonical URLs + sitemap point at the live host.
const SITE = process.env.SITE || 'https://thetechsober.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap({
      // Drop draft/admin-ish routes from the sitemap if they ever appear.
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  build: {
    // Inline tiny stylesheets to cut requests; keeps Lighthouse happy.
    inlineStylesheets: 'auto',
  },
  image: {
    // Allow remote cover images (e.g. from a CDN) to be optimised if used.
    remotePatterns: [{ protocol: 'https' }],
  },
});
