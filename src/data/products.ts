/**
 * Digital products for the Resources page.
 *
 * v1 selling = Stripe Payment Links (no backend needed). Put each product's
 * Payment Link in an env var (PUBLIC_STRIPE_LINK_*) or paste it straight into
 * `paymentLink` below. Free items use the email-capture lead-magnet flow.
 *
 * When you're ready for automatic protected delivery, switch on the Stripe
 * webhook + R2 (see functions/api/stripe-webhook.ts and the README).
 */
const env = import.meta.env;

export interface Product {
  id: string;
  title: string;
  description: string;
  /** e.g. "PDF · 24 pages" */
  format: string;
  /** Price in whole currency units; 0/undefined => free. */
  price?: number;
  currency: string;
  /** Stripe Payment Link (paid items). '#' is a safe placeholder. */
  paymentLink?: string;
  /** Up to 3 "what you'll learn" bullets. */
  learn: string[];
  /** Editorial cover label (dark on-brand cover) when no cover image. */
  coverLabel: string;
  cover?: string;
  free?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "ai-workflow-vault",
    title: "The AI Workflow Vault",
    description:
      "24 battle-tested AI workflows you can copy today — each with the real cost per run and where it falls over.",
    format: "PDF · 24 pages",
    price: 12,
    currency: "GBP",
    paymentLink: env.PUBLIC_STRIPE_LINK_VAULT ?? "#",
    learn: [
      "Copy-paste prompts and node setups",
      "Real cost-per-run for each workflow",
      "The failure modes nobody mentions",
    ],
    coverLabel: "The AI Workflow Vault",
  },
  {
    id: "n8n-automation-workbook",
    title: "n8n Automation Workbook",
    description:
      "A hands-on workbook that takes you from zero to five working automations — with honest notes on rate limits and upkeep.",
    format: "PDF · 32 pages",
    price: 19,
    currency: "GBP",
    paymentLink: env.PUBLIC_STRIPE_LINK_N8N ?? "#",
    learn: [
      "Five end-to-end automations to build",
      "When self-hosting beats paying",
      "Maintenance cost, stated up front",
    ],
    coverLabel: "n8n Automation Workbook",
  },
  {
    id: "honest-reviewer-checklist",
    title: "The Honest Reviewer's Checklist",
    description:
      "The exact checklist I run before recommending any gadget — the questions that survive two weeks of real use.",
    format: "PDF · 8 pages",
    currency: "GBP",
    free: true,
    learn: [
      "The 12 checks that actually matter",
      "Spec-sheet traps to ignore",
      "A scoring sheet you can reuse",
    ],
    coverLabel: "The Honest Reviewer's Checklist",
  },
  {
    id: "local-ai-starter",
    title: "Local AI Starter Guide",
    description:
      "Everything you need to run capable models on your own machine — hardware floors, model picks, and honest expectations.",
    format: "PDF · 14 pages",
    currency: "GBP",
    free: true,
    learn: [
      "What runs on which hardware",
      "Ollama vs LM Studio, decided",
      "When the cloud is just smarter",
    ],
    coverLabel: "Local AI Starter Guide",
  },
];

export const formatPrice = (p: Product): string =>
  p.free || !p.price ? "Free" : `£${p.price}`;
