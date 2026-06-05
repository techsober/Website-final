/**
 * GET /api/download?token=... — serves a purchased file from R2 against a
 * signed, time-limited token minted by the Stripe webhook. Part of the
 * future-ready gated-delivery flow; inert until R2 + signing secret exist.
 *
 * Files are stored in R2 (DOWNLOADS binding) and never exposed at a public URL.
 */
import { json, hmacSha256Hex, timingSafeEqual } from "../_utils";

interface Env {
  DOWNLOAD_SIGNING_SECRET?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  DOWNLOADS?: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DOWNLOADS) {
    return json({ ok: false, message: "Downloads not configured." }, 503);
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) return json({ ok: false, message: "Missing token." }, 400);

  let payload: { key: string; exp: number; sig: string };
  try {
    payload = JSON.parse(atob(token));
  } catch {
    return json({ ok: false, message: "Invalid token." }, 400);
  }

  const { key, exp, sig } = payload;
  if (!key || !exp || !sig) return json({ ok: false, message: "Invalid token." }, 400);

  if (Math.floor(Date.now() / 1000) > exp) {
    return json({ ok: false, message: "This download link has expired." }, 410);
  }

  const secret =
    env.DOWNLOAD_SIGNING_SECRET || (env.STRIPE_WEBHOOK_SECRET as string);
  const expected = await hmacSha256Hex(secret, `${key}.${exp}`);
  if (!secret || !timingSafeEqual(expected, sig)) {
    return json({ ok: false, message: "Invalid signature." }, 403);
  }

  const object = await env.DOWNLOADS.get(key);
  if (!object) return json({ ok: false, message: "File not found." }, 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "private, no-store");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${key.split("/").pop()}"`,
  );
  return new Response(object.body, { headers });
};
