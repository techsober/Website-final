/**
 * Shared helpers for Cloudflare Pages Functions.
 * Underscore-prefixed so Pages never routes this file.
 */

export function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

/** Parse a JSON or form-encoded request body into a flat record. */
export async function readBody(
  request: Request,
): Promise<Record<string, string>> {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    return (await request.json().catch(() => ({}))) as Record<string, string>;
  }
  const form = await request.formData().catch(() => null);
  if (!form) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of form.entries()) out[k] = String(v);
  return out;
}

export function isEmail(value: string | undefined): boolean {
  if (!value) return false;
  // Pragmatic, not RFC-perfect.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** HMAC-SHA256 -> lowercase hex. Used for Stripe verification + signed URLs. */
export async function hmacSha256Hex(
  secret: string,
  message: string,
): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time string compare (avoids timing leaks on signatures). */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Basic input length guard to blunt abuse. */
export function clamp(value: string | undefined, max: number): string {
  return (value ?? "").toString().slice(0, max);
}
