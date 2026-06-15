/**
 * Content collections (Astro 5 Content Layer).
 *  - blog: Markdown/MDX posts edited via TinaCMS (git-backed).
 *  - projects: optional Markdown metadata for the project landing pages.
 *
 * Covers are plain string paths (public/ or remote) so the site builds even
 * before real images are added.
 */
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { BLOG_CATEGORIES } from "./lib/site";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(BLOG_CATEGORIES),
    date: z.coerce.date(),
    /** Optional cover image (path under public/ or a full URL). */
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    author: z.string().default("Ashwin Chettiar"),
    draft: z.boolean().default(false),
    /** Optional explicit reading time; otherwise estimated from the body. */
    readingTime: z.number().optional(),

    // --- SEO / GEO (all optional with fallbacks) ---
    /** ≤60 chars, keyword-first. Falls back to `title` for <title>/og:title. */
    seoTitle: z.string().optional(),
    /** Freshness signal -> dateModified + "Last updated". Falls back to date. */
    updatedDate: z.coerce.date().optional(),
    /** Override canonical (only when republished elsewhere). */
    canonicalUrl: z.string().optional(),
    /** Keywords + article:tag + internal linking. */
    tags: z.array(z.string()).default([]),
    /** Answer-first "Key takeaways" box (wins snippets + AI extraction). */
    keyTakeaways: z.array(z.string()).default([]),
    /** Visible FAQ block + FAQPage JSON-LD (answers must match the page). */
    faqs: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default([]),
    /** Selects the Article schema @type. */
    articleType: z
      .enum(["BlogPosting", "NewsArticle", "Review", "HowTo"])
      .default("BlogPosting"),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    /** One-line value prop shown in the card + landing hero. */
    description: z.string(),
    tagline: z.string().optional(),
    tech: z.array(z.string()).default([]),
    category: z
      .enum(["AI Tools", "Web Apps", "Automations"])
      .default("AI Tools"),
    status: z.enum(["Beta", "Free", "Demo", "Live"]).optional(),
    launchUrl: z.string().optional(),
    buildUrl: z.string().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    order: z.number().default(99),
    draft: z.boolean().default(false),
    /** "What it does" feature blocks. */
    features: z
      .array(
        z.object({
          title: z.string(),
          body: z.string(),
          icon: z.string().default("bolt"),
        }),
      )
      .default([]),
    /** The honesty box — costs, limits, what it can't do (brand differentiator). */
    honesty: z.array(z.string()).default([]),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** e.g. "PDF · 24 pages" */
    format: z.string(),
    /** Price in whole currency units; omit/0 for free items. */
    price: z.number().optional(),
    currency: z.string().default("GBP"),
    free: z.boolean().default(false),
    /** Stripe Payment Link URL (paid items). "#" is a safe placeholder. */
    paymentLink: z.string().default("#"),
    /** Up to 3 "what you'll learn" bullets. */
    learn: z.array(z.string()).default([]),
    /** Editorial cover label (used when no cover image). */
    coverLabel: z.string(),
    cover: z.string().optional(),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

/**
 * Singleton pages with a free-form rich-text body (About story, Resources
 * trust note, …). Structured bits live in frontmatter; the prose body is
 * freely editable in TinaCMS. Fields are optional so different pages can use
 * only what they need (each has its own TinaCMS collection/UI).
 */
const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    intro: z.string().optional(),
    primaryLabel: z.string().optional(),
    primaryHref: z.string().optional(),
    secondaryLabel: z.string().optional(),
    secondaryHref: z.string().optional(),
    portrait: z.string().optional(),
    whatEyebrow: z.string().optional(),
    pillarsHeading: z.string().optional(),
    pillars: z
      .array(
        z.object({
          icon: z.string().default("ai"),
          title: z.string(),
          body: z.string(),
        }),
      )
      .default([]),
    stats: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .default([]),
  }),
});

export const collections = { blog, projects, products, pages };
