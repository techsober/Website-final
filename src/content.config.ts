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

export const collections = { blog, projects };
