/**
 * Content helpers shared across pages: fetch + sort posts/projects, hide
 * drafts in production, estimate reading time, and format dates consistently
 * (UK style: "12 May 2026").
 */
import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;
export type Project = CollectionEntry<"projects">;

const showDrafts = import.meta.env.DEV;

/** All non-draft blog posts, newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) =>
    showDrafts ? true : data.draft !== true,
  );
  return posts.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

/** Posts in a single category (case-insensitive match on the slugified cat). */
export async function getPostsByCategory(cat: string): Promise<Post[]> {
  const all = await getPublishedPosts();
  return all.filter((p) => slugifyCategory(p.data.category) === cat);
}

/** All non-draft projects, by `order` then title. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", ({ data }) =>
    showDrafts ? true : data.draft !== true,
  );
  return projects.sort(
    (a, b) =>
      a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

/** Estimate reading time in whole minutes (~225 wpm). */
export function readingTime(body: string | undefined, explicit?: number): number {
  if (explicit) return explicit;
  const words = (body ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

/** "12 May 2026" / "28 Apr 2026" — short month, to match the mock. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** ISO date (YYYY-MM-DD) for <time datetime>. */
export function isoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/** URL-safe category slug, e.g. "Review" -> "review". */
export function slugifyCategory(cat: string): string {
  return cat.toLowerCase().replace(/\s+/g, "-");
}

/** Pick up to `n` related posts (same category first, then recent). */
export async function getRelatedPosts(current: Post, n = 3): Promise<Post[]> {
  const all = await getPublishedPosts();
  const others = all.filter((p) => p.id !== current.id);
  const sameCat = others.filter(
    (p) => p.data.category === current.data.category,
  );
  const rest = others.filter((p) => p.data.category !== current.data.category);
  return [...sameCat, ...rest].slice(0, n);
}
