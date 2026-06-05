/**
 * POST /api/contact — brand-enquiry handler.
 *
 * Validates input, drops honeypot hits, and emails the enquiry to
 * contact@thetechsober.com. Provider order:
 *   1. Resend        (RESEND_API_KEY)        — recommended
 *   2. MailChannels  (ENABLE_MAILCHANNELS)   — opt-in; needs domain DKIM setup
 *   3. none          — accepts + logs so previews work before keys are added
 *
 * Returns JSON { ok, message } for the inline form states.
 */
import { json, readBody, isEmail, clamp } from "../_utils";

interface Env {
  RESEND_API_KEY?: string;
  ENABLE_MAILCHANNELS?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const data = await readBody(request);

    // Honeypot: silently accept so bots don't learn they were caught.
    if (data.company_url) {
      return json({ ok: true, message: "Thanks — message received." });
    }

    const name = clamp(data.name, 120).trim();
    const email = clamp(data.email, 200).trim();
    const company = clamp(data.company, 160).trim();
    const budget = clamp(data.budget, 60).trim();
    const message = clamp(data.message, 5000).trim();

    if (!name || !isEmail(email) || !message) {
      return json(
        { ok: false, message: "Please add your name, a valid email and a message." },
        400,
      );
    }

    const to = env.CONTACT_TO || "contact@thetechsober.com";
    const from = env.CONTACT_FROM || "TechSober Website <noreply@thetechsober.com>";
    const subject = `New enquiry from ${name}${company ? ` (${company})` : ""}`;
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      budget ? `Budget: ${budget}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const success = {
      ok: true,
      message: "✓ Thanks — I'll reply within 2 working days.",
    };

    // 1) Resend
    if (env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, subject, text, reply_to: email }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}`);
      return json(success);
    }

    // 2) MailChannels (opt-in; requires DKIM/SPF for your domain)
    if (env.ENABLE_MAILCHANNELS === "true") {
      const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: "noreply@thetechsober.com", name: "TechSober Website" },
          reply_to: { email },
          subject,
          content: [{ type: "text/plain", value: text }],
        }),
      });
      if (!res.ok) throw new Error(`MailChannels ${res.status}`);
      return json(success);
    }

    // 3) No provider configured — accept gracefully (and log for preview).
    console.log("[contact] no email provider configured. Submission:", text);
    return json({
      ok: true,
      message: "✓ Thanks — your message was received.",
    });
  } catch (err) {
    console.error("[contact] error:", err);
    return json(
      {
        ok: false,
        message:
          "Something went wrong. Please email contact@thetechsober.com directly.",
      },
      500,
    );
  }
};
