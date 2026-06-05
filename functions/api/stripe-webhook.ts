/**
 * POST /api/stripe-webhook — future-ready gated delivery (inert until keys set).
 *
 * Guarded behind STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET so builds/deploys
 * succeed without Stripe configured. When enabled:
 *   1. Verifies the Stripe-Signature (HMAC-SHA256, Web Crypto — no SDK).
 *   2. On checkout.session.completed, mints a signed, time-limited download URL
 *      to an R2 object (the file key comes from the session metadata) and
 *      emails it via Resend.
 *
 * Files live in R2 (DOWNLOADS binding), never at a public URL. Payment Links
 * work today; switch this on for automatic protected delivery (see README).
 */
import { json, hmacSha256Hex, timingSafeEqual } from "../_utils";

interface Env {
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  DOWNLOAD_SIGNING_SECRET?: string;
  CONTACT_FROM?: string;
  DOWNLOADS?: R2Bucket;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Feature flag: do nothing (and don't ask Stripe to retry) until configured.
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return json({ ok: true, disabled: true }, 200);
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  const valid = await verifyStripeSignature(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET,
  );
  if (!valid) return json({ ok: false, message: "Invalid signature" }, 400);

  let event: any;
  try {
    event = JSON.parse(payload);
  } catch {
    return json({ ok: false, message: "Bad payload" }, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object ?? {};
    const email = session.customer_details?.email || session.customer_email;
    // Set `file_key` as metadata on your Stripe Payment Link / Price.
    const fileKey = session.metadata?.file_key;

    if (email && fileKey && env.DOWNLOADS) {
      try {
        const origin = new URL(request.url).origin;
        const url = await signDownloadUrl(origin, fileKey, env);
        await emailDownloadLink(env, email, url);
      } catch (err) {
        console.error("[stripe] delivery failed:", err);
        // Still 200 — we don't want Stripe retrying a delivery-side issue.
      }
    } else {
      console.log(
        "[stripe] checkout completed but missing email/file_key/R2 — skipping delivery",
      );
    }
  }

  return json({ ok: true, received: true });
};

/** Verify Stripe's `t=...,v1=...` signature with a 5-minute tolerance. */
async function verifyStripeSignature(
  payload: string,
  header: string,
  secret: string,
): Promise<boolean> {
  const parts: Record<string, string> = {};
  for (const kv of header.split(",")) {
    const [k, v] = kv.split("=");
    if (k && v) parts[k.trim()] = v.trim();
  }
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(t)) > 300) return false;

  const expected = await hmacSha256Hex(secret, `${t}.${payload}`);
  return timingSafeEqual(expected, v1);
}

/** Build a signed, time-limited URL to /api/download. */
async function signDownloadUrl(
  origin: string,
  key: string,
  env: Env,
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 60 * 30; // 30 minutes
  const secret =
    env.DOWNLOAD_SIGNING_SECRET || (env.STRIPE_WEBHOOK_SECRET as string);
  const sig = await hmacSha256Hex(secret, `${key}.${exp}`);
  const token = btoa(JSON.stringify({ key, exp, sig })).replace(/=+$/, "");
  return `${origin}/api/download?token=${encodeURIComponent(token)}`;
}

async function emailDownloadLink(
  env: Env,
  to: string,
  url: string,
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    console.log(`[stripe] no RESEND_API_KEY — would email ${to}: ${url}`);
    return;
  }
  const from = env.CONTACT_FROM || "TechSober <noreply@thetechsober.com>";
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Your TechSober download",
      text: `Thanks for your purchase!\n\nDownload your file (link valid for 30 minutes):\n${url}\n\n— TechSober`,
    }),
  });
}
