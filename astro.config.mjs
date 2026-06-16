// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import fs from 'node:fs';
import path from 'node:path';

// The canonical production URL. Override with the SITE env var at build time
// (e.g. on Cloudflare Pages) so canonical URLs + sitemap point at the live host.
const SITE = process.env.SITE || 'https://thetechsober.com';

// Lazy-load + async-decode every Markdown body image (perf + no CLS).
// Tiny dependency-free rehype plugin (walks the HTML AST).
function rehypeLazyImages() {
  return (tree) => {
    const walk = (node) => {
      if (node.tagName === 'img' && node.properties) {
        if (node.properties.loading == null) node.properties.loading = 'lazy';
        if (node.properties.decoding == null) node.properties.decoding = 'async';
      }
      (node.children || []).forEach(walk);
    };
    walk(tree);
  };
}

// Map each blog post URL to its freshness date (updatedDate || date) for
// accurate sitemap <lastmod>. Read at config time straight from frontmatter.
function blogLastmodMap() {
  const dir = path.resolve('./src/content/blog');
  /** @type {Record<string,string>} */
  const map = {};
  if (!fs.existsSync(dir)) return map;
  for (const file of fs.readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const slug = file.replace(/\.mdx?$/, '');
    const src = fs.readFileSync(path.join(dir, file), 'utf8');
    const fm = (src.match(/^---\s*([\s\S]*?)\s*---/) || [, ''])[1];
    const read = (k) =>
      (fm.match(new RegExp(`^${k}:\\s*'?"?([^'"\\n]+)`, 'm')) || [])[1];
    const lastmod = (read('updatedDate') || read('date') || '').trim();
    if (lastmod) map[`/blog/${slug}`] = lastmod;
  }
  return map;
}
const BLOG_LASTMOD = blogLastmodMap();

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
      serialize(item) {
        const pathname = new URL(item.url).pathname.replace(/\/$/, '');
        const lastmod = BLOG_LASTMOD[pathname];
        if (lastmod) item.lastmod = new Date(lastmod).toISOString();
        return item;
      },
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeLazyImages],
  },
  build: {
    // Inline tiny stylesheets to cut requests; keeps Lighthouse happy.
    inlineStylesheets: 'auto',
  },
  image: {
    // Allow remote cover images (e.g. from a CDN) to be optimised if used.
    remotePatterns: [{ protocol: 'https' }],
  },
});
