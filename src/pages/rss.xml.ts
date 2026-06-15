/**
 * /rss.xml — blog feed for readers, aggregators, and AI ingestion.
 * Uses each post's excerpt (falling back to its meta description).
 */
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts } from "@lib/content";
import { SITE } from "@lib/site";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: `${SITE.name} — Blog`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt ?? post.data.description,
      pubDate: post.data.updatedDate ?? post.data.date,
      link: `/blog/${post.id}/`,
      categories: [post.data.category, ...(post.data.tags ?? [])],
    })),
  });
}
