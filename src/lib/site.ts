/**
 * Central site configuration. One place to change brand-wide facts:
 * nav, socials, contact, and the env-driven feature flags that let the
 * site build/deploy gracefully before any API keys exist.
 */

export const SITE = {
  name: "TechSober",
  /** Used in <title> suffixes and JSON-LD. */
  tagline: "Tech & AI, minus the hype.",
  description:
    "TechSober is honest, hype-free tech and AI coverage — reviews, AI tools and workflows that call out the costs, limits and marketing spin.",
  /** Canonical production origin (also set via SITE env in astro.config). */
  url: "https://thetechsober.com",
  email: "contact@thetechsober.com",
  author: "Ashwin Chettiar",
  authorHandle: "@techsober",
  ogImage: "/og-default.png",
  locale: "en_GB",
  lang: "en",
};

/** Primary navigation — order matches the wireframe header. */
export const NAV = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
] as const;

/** Blog categories — drive the crawlable filter routes. */
export const BLOG_CATEGORIES = ["AI", "Tech", "Review", "Gadgets"] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

/**
 * Social links. `sameAs` of these feeds the Person/Organization JSON-LD.
 * Swap the hrefs for the real profile URLs when known.
 */
export const SOCIALS = {
  youtube: "https://www.youtube.com/@techsober",
  instagram: "https://www.instagram.com/techsober",
  tiktok: "https://www.tiktok.com/@techsober",
  x: "https://x.com/techsober",
};

export const SOCIAL_LIST = [
  { name: "YouTube", href: SOCIALS.youtube, icon: "youtube" },
  { name: "Instagram", href: SOCIALS.instagram, icon: "instagram" },
  { name: "TikTok", href: SOCIALS.tiktok, icon: "tiktok" },
  { name: "X", href: SOCIALS.x, icon: "x" },
] as const;

/**
 * Feature flags driven by env presence. Public (PUBLIC_*) vars are readable in
 * client/SSG output; server-only secrets stay in the Pages Functions runtime.
 * Each integration degrades gracefully when its key is absent.
 *
 * Note: `import.meta.env` is statically replaced at build time by Astro/Vite.
 */
const env = import.meta.env;

export const FLAGS = {
  /** Cloudflare Web Analytics beacon. */
  cfAnalytics: Boolean(env.PUBLIC_CF_ANALYTICS_TOKEN),
  /** Giscus comments (GitHub Discussions). */
  giscus: Boolean(env.PUBLIC_GISCUS_REPO && env.PUBLIC_GISCUS_REPO_ID),
  /** MailerLite email capture — endpoint still posts; UI hints when off. */
  mailerlite: Boolean(env.PUBLIC_MAILERLITE_ENABLED === "true"),
  /** YouTube "latest uploads" rail — only rendered when keys exist. */
  youtube: Boolean(env.YT_API_KEY && env.YT_CHANNEL_ID),
} as const;

export const ANALYTICS_TOKEN = env.PUBLIC_CF_ANALYTICS_TOKEN ?? "";

export const GISCUS = {
  repo: env.PUBLIC_GISCUS_REPO ?? "",
  repoId: env.PUBLIC_GISCUS_REPO_ID ?? "",
  category: env.PUBLIC_GISCUS_CATEGORY ?? "Announcements",
  categoryId: env.PUBLIC_GISCUS_CATEGORY_ID ?? "",
};
