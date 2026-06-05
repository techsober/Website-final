/**
 * POST /api/subscribe — MailerLite email capture.
 *
 * Adds the subscriber via the MailerLite API (MAILERLITE_API_KEY), optionally
 * to a group (MAILERLITE_GROUP_ID). Honeypot-protected. When the key is absent
 * the endpoint degrades gracefully with a clear message instead of erroring.
 */
import { json, readBody, isEmail, clamp } from "../_utils";

interface Env {
  MAILERLITE_API_KEY?: string;
  MAILERLITE_GROUP_ID?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const data = await readBody(request);

    // Honeypot — pretend success.
    if (data.company_url) {
      return json({ ok: true, message: "✓ You're in." });
    }

    const email = clamp(data.email, 200).trim();
    const source = clamp(data.source, 80).trim() || "site";

    if (!isEmail(email)) {
      return json(
        { ok: false, message: "Please enter a valid email address." },
        400,
      );
    }

    // Graceful degradation before the key exists.
    if (!env.MAILERLITE_API_KEY) {
      console.log(`[subscribe] no MAILERLITE_API_KEY. Would subscribe: ${email} (${source})`);
      return json(
        {
          ok: false,
          message: "Email signup isn't switched on yet — check back soon.",
        },
        200,
      );
    }

    const body: Record<string, unknown> = {
      email,
      fields: { source },
      ...(env.MAILERLITE_GROUP_ID ? { groups: [env.MAILERLITE_GROUP_ID] } : {}),
    };

    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.MAILERLITE_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    // MailerLite returns 200/201 on success (and on existing subscribers).
    if (res.ok) {
      return json({ ok: true, message: "✓ You're in — check your inbox." });
    }

    const detail = await res.text().catch(() => "");
    console.error("[subscribe] MailerLite error:", res.status, detail);
    return json(
      { ok: false, message: "Couldn't sign you up just now. Please try again." },
      502,
    );
  } catch (err) {
    console.error("[subscribe] error:", err);
    return json(
      { ok: false, message: "Network error — please try again." },
      500,
    );
  }
};
