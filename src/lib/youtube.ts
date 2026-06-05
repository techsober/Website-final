/**
 * YouTube "Latest uploads" — future-ready, OFF by default.
 *
 * Fetches the 3 newest uploads at BUILD TIME using YT_API_KEY + YT_CHANNEL_ID.
 * If either is missing (or the request fails), it returns [] and the feature is
 * skipped entirely — it can never break a build. The result is cached for the
 * duration of the build so we hit the API at most twice per build.
 *
 * Quota note: search.list costs 100 units/call; the default daily quota is
 * 10,000 units. Build-time-only fetching keeps usage tiny. For heavy rebuilds,
 * prefer the cheaper playlistItems.list (1 unit) against the uploads playlist.
 *
 * Read non-public env from process.env (the correct build-time source); these
 * are never exposed to the client.
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
}

function ytEnv() {
  const apiKey =
    (typeof process !== "undefined" && process.env?.YT_API_KEY) ||
    (import.meta.env as any).YT_API_KEY ||
    "";
  const channelId =
    (typeof process !== "undefined" && process.env?.YT_CHANNEL_ID) ||
    (import.meta.env as any).YT_CHANNEL_ID ||
    "";
  return { apiKey, channelId };
}

/** True only when both keys exist — gate UI on this. */
export function youtubeEnabled(): boolean {
  const { apiKey, channelId } = ytEnv();
  return Boolean(apiKey && channelId);
}

let cache: YouTubeVideo[] | null = null;

export async function getLatestVideos(max = 3): Promise<YouTubeVideo[]> {
  if (cache) return cache.slice(0, max);
  const { apiKey, channelId } = ytEnv();
  if (!apiKey || !channelId) {
    cache = [];
    return cache;
  }

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("channelId", channelId);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("order", "date");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", String(Math.min(Math.max(max, 1), 10)));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`YouTube API ${res.status}`);
    const data: any = await res.json();

    cache = (data.items ?? [])
      .filter((i: any) => i.id?.videoId)
      .map((i: any) => ({
        id: i.id.videoId,
        title: i.snippet.title,
        url: `https://www.youtube.com/watch?v=${i.id.videoId}`,
        thumbnail:
          i.snippet.thumbnails?.high?.url ||
          i.snippet.thumbnails?.medium?.url ||
          "",
        publishedAt: i.snippet.publishedAt,
      }));
    return cache.slice(0, max);
  } catch (err) {
    // Never break the build — log and skip.
    console.warn("[youtube] skipped:", (err as Error).message);
    cache = [];
    return cache;
  }
}
