/**
 * TinaCMS — git-backed editing for the whole site. Every collection here maps
 * to files the Astro build already reads, so edits stay valid and just trigger
 * a redeploy. No database.
 *
 *   List content : Blog posts · Projects · Resources/products  (Markdown)
 *   Page content : Homepage · About · Portfolio                (JSON singletons)
 *
 * Local editing:   npx tinacms dev -c "astro dev"   → /admin/index.html
 * Cloud editing:   set PUBLIC_TINA_CLIENT_ID + TINA_TOKEN (see README).
 */
import { defineConfig } from "tinacms";

const branch =
  process.env.TINA_BRANCH ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  "main";

// Icon keys available to the Icon component (keep in sync with src/lib/icons.ts).
const ICON_OPTIONS = [
  "youtube",
  "ai",
  "doc",
  "mail",
  "trend",
  "play",
  "rocket",
  "bolt",
  "layers",
  "headphones",
  "graduate",
  "gear",
  "check",
  "warning",
  "download",
];

const headingFields = [
  { type: "string", name: "eyebrow", label: "Eyebrow" },
  { type: "string", name: "title", label: "Title" },
  { type: "string", name: "linkLabel", label: "Link label" },
  { type: "string", name: "linkHref", label: "Link URL" },
] as const;

const cardFields = [
  { type: "string", name: "category", label: "Category chip" },
  { type: "string", name: "title", label: "Title" },
  {
    type: "string",
    name: "excerpt",
    label: "Excerpt",
    ui: { component: "textarea" },
  },
  { type: "string", name: "metric", label: "Gold result pill" },
  { type: "string", name: "href", label: "Links to" },
] as const;

const statFields = [
  { type: "string", name: "value", label: "Number (e.g. 2.4M)" },
  { type: "string", name: "label", label: "Label" },
] as const;

export default defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: { outputFolder: "admin", publicFolder: "public" },
  media: { tina: { mediaRoot: "uploads", publicFolder: "public" } },

  schema: {
    collections: [
      // ───────────────────────────── Blog posts ─────────────────────────────
      {
        name: "post",
        label: "Blog Posts",
        path: "src/content/blog",
        format: "md",
        ui: {
          filename: {
            slugify: (values: { title?: string }) =>
              (values?.title || "untitled-post")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
          },
        },
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          {
            type: "string",
            name: "description",
            label: "Meta description (140–160 chars)",
            required: true,
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: ["AI", "Tech", "Review", "Gadgets"],
          },
          { type: "datetime", name: "date", label: "Publish date", required: true },
          {
            type: "datetime",
            name: "updatedDate",
            label: "Last updated (freshness signal — leave blank if unchanged)",
          },
          { type: "image", name: "cover", label: "Cover image" },
          { type: "string", name: "coverAlt", label: "Cover alt text (accessibility)" },
          {
            type: "string",
            name: "author",
            label: "Author (matches an Authors entry by name; blank = default)",
          },
          { type: "boolean", name: "draft", label: "Draft (hidden from the live site)" },

          // --- Search & AI ranking (all optional; sensible fallbacks) ---
          {
            type: "string",
            name: "seoTitle",
            label: "SEO title (≤60 chars, keyword first — falls back to Title)",
          },
          {
            type: "string",
            name: "tags",
            label: "Tags / keywords",
            list: true,
          },
          {
            type: "string",
            name: "articleType",
            label: "Article type (schema)",
            options: ["BlogPosting", "NewsArticle", "Review", "HowTo"],
          },
          {
            type: "string",
            name: "keyTakeaways",
            label: "Key takeaways (answer-first box at the top)",
            list: true,
            ui: { component: "textarea" },
          },
          {
            type: "object",
            name: "faqs",
            label: "FAQ (shown on page + FAQ schema)",
            list: true,
            ui: {
              itemProps: (item: { question?: string }) => ({
                label: item?.question || "FAQ",
              }),
            },
            fields: [
              { type: "string", name: "question", label: "Question" },
              {
                type: "string",
                name: "answer",
                label: "Answer",
                ui: { component: "textarea" },
              },
            ],
          },
          {
            type: "string",
            name: "canonicalUrl",
            label: "Canonical URL (only if this was first published elsewhere)",
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt (card + RSS summary — falls back to description)",
            ui: { component: "textarea" },
          },
          {
            type: "image",
            name: "ogImage",
            label: "Social share image (1200×630 — falls back to cover)",
          },
          {
            type: "object",
            name: "sources",
            label: "Sources / citations (outbound links)",
            list: true,
            ui: {
              itemProps: (item: { title?: string }) => ({
                label: item?.title || "Source",
              }),
            },
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "url", label: "URL" },
            ],
          },
          {
            type: "string",
            name: "relatedPosts",
            label:
              "Related posts (enter slugs — the part after /blog/; overrides auto by category)",
            list: true,
          },
          {
            type: "string",
            name: "focusKeyword",
            label: "Focus keyword (your reference only — not shown on the page)",
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured (pins to the top of the blog)",
          },
          {
            type: "boolean",
            name: "noindex",
            label: "Hide from search engines (noindex)",
          },
          {
            type: "number",
            name: "rating",
            label: "Review rating 1–5 (only when Article type = Review)",
          },
          {
            type: "string",
            name: "productName",
            label: "Reviewed product name (Review only)",
          },
          {
            type: "string",
            name: "pros",
            label: "Pros (Review only)",
            list: true,
          },
          {
            type: "string",
            name: "cons",
            label: "Cons (Review only)",
            list: true,
          },
          {
            type: "object",
            name: "howToSteps",
            label: "How-to steps (only when Article type = HowTo)",
            list: true,
            ui: {
              itemProps: (item: { name?: string }) => ({
                label: item?.name || "Step",
              }),
            },
            fields: [
              { type: "string", name: "name", label: "Step name" },
              {
                type: "string",
                name: "text",
                label: "Step detail",
                ui: { component: "textarea" },
              },
              { type: "image", name: "image", label: "Step image (optional)" },
            ],
          },

          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },

      // ───────────────────────────── Projects ───────────────────────────────
      {
        name: "project",
        label: "Projects",
        path: "src/content/projects",
        format: "md",
        ui: {
          filename: {
            slugify: (values: { title?: string }) =>
              (values?.title || "untitled-project")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
          },
        },
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          {
            type: "string",
            name: "description",
            label: "Short description (card + landing)",
            required: true,
            ui: { component: "textarea" },
          },
          { type: "string", name: "tagline", label: "Tagline (hero one-liner)" },
          { type: "string", name: "tech", label: "Tech chips", list: true },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: ["AI Tools", "Web Apps", "Automations"],
          },
          {
            type: "string",
            name: "status",
            label: "Status badge",
            options: ["Beta", "Free", "Demo", "Live"],
          },
          { type: "string", name: "launchUrl", label: "Launch app URL" },
          { type: "string", name: "buildUrl", label: "Watch the build URL" },
          { type: "image", name: "cover", label: "Cover / screenshot" },
          { type: "string", name: "coverAlt", label: "Cover alt text" },
          { type: "number", name: "order", label: "Sort order" },
          { type: "boolean", name: "draft", label: "Draft" },
          {
            type: "object",
            name: "features",
            label: "What it does (feature blocks)",
            list: true,
            ui: { itemProps: (i: { title?: string }) => ({ label: i?.title }) },
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
              { type: "string", name: "icon", label: "Icon", options: ICON_OPTIONS },
            ],
          },
          {
            type: "string",
            name: "honesty",
            label: "Honesty box — costs & limits",
            list: true,
            ui: { component: "textarea" },
          },
          { type: "rich-text", name: "body", label: "How-to / body", isBody: true },
        ],
      },

      // ──────────────────────── Resources / products ────────────────────────
      {
        name: "product",
        label: "Resources / Products",
        path: "src/content/products",
        format: "md",
        ui: {
          filename: {
            slugify: (values: { title?: string }) =>
              (values?.title || "untitled-product")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
          },
        },
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
            ui: { component: "textarea" },
          },
          { type: "string", name: "format", label: 'Format chip (e.g. "PDF · 24 pages")' },
          { type: "number", name: "price", label: "Price (leave blank if free)" },
          {
            type: "string",
            name: "currency",
            label: "Currency",
            options: ["GBP", "USD", "EUR"],
          },
          { type: "boolean", name: "free", label: "Free (uses email capture)" },
          { type: "string", name: "paymentLink", label: "Stripe Payment Link URL" },
          { type: "string", name: "learn", label: "What you'll learn (bullets)", list: true },
          { type: "string", name: "coverLabel", label: "Cover label (if no image)" },
          { type: "image", name: "cover", label: "Cover image" },
          { type: "number", name: "order", label: "Sort order" },
          { type: "boolean", name: "draft", label: "Draft" },
        ],
      },

      // ───────────────────────── Homepage (singleton) ───────────────────────
      {
        name: "home",
        label: "Homepage",
        path: "src/data",
        format: "json",
        match: { include: "home" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow" },
              { type: "string", name: "titleLine1", label: "Headline line 1" },
              { type: "string", name: "titleEm", label: "Headline line 2 (lavender)" },
              { type: "string", name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
              { type: "string", name: "primaryLabel", label: "Primary button label" },
              { type: "string", name: "primaryHref", label: "Primary button URL" },
              { type: "string", name: "secondaryLabel", label: "Secondary button label" },
              { type: "string", name: "secondaryHref", label: "Secondary button URL" },
              { type: "string", name: "trustStat", label: "Trust stat (bold)" },
              { type: "string", name: "trustStatSuffix", label: "Trust stat suffix" },
              { type: "string", name: "trustItems", label: "Trust items", list: true },
            ],
          },
          {
            type: "object",
            name: "navCards",
            label: "Button-nav cards",
            list: true,
            ui: { itemProps: (i: { title?: string }) => ({ label: i?.title }) },
            fields: [
              { type: "string", name: "icon", label: "Icon", options: ICON_OPTIONS },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "desc", label: "Description" },
              { type: "string", name: "arr", label: "Link text (e.g. Browse →)" },
              { type: "string", name: "href", label: "Links to" },
            ],
          },
          {
            type: "object",
            name: "featuredHeading",
            label: "Featured-work heading",
            fields: [...headingFields],
          },
          {
            type: "object",
            name: "featured",
            label: "Featured work cards",
            list: true,
            ui: { itemProps: (i: { title?: string }) => ({ label: i?.title }) },
            fields: [...cardFields],
          },
          {
            type: "object",
            name: "blogHeading",
            label: "Blog-snippets heading",
            fields: [...headingFields],
          },
        ],
      },

      // ─────────────────────────── About (singleton) ────────────────────────
      // The story is the markdown BODY (free-form rich text: headings, quotes,
      // bullets, links…). Structured hero/pillars/stats stay as fields.
      {
        name: "about",
        label: "About page",
        path: "src/content/pages",
        format: "md",
        match: { include: "about" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "eyebrow", label: "Eyebrow" },
          { type: "string", name: "title", label: "Name / title" },
          { type: "string", name: "intro", label: "Intro", ui: { component: "textarea" } },
          { type: "string", name: "primaryLabel", label: "Primary button label" },
          { type: "string", name: "primaryHref", label: "Primary button URL" },
          { type: "string", name: "secondaryLabel", label: "Secondary button label" },
          { type: "string", name: "secondaryHref", label: "Secondary button URL" },
          { type: "image", name: "portrait", label: "Portrait image" },
          { type: "string", name: "whatEyebrow", label: "Pillars eyebrow" },
          { type: "string", name: "pillarsHeading", label: "Pillars heading" },
          {
            type: "object",
            name: "pillars",
            label: "Pillars",
            list: true,
            ui: { itemProps: (i: { title?: string }) => ({ label: i?.title }) },
            fields: [
              { type: "string", name: "icon", label: "Icon", options: ICON_OPTIONS },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "stats",
            label: "By-the-numbers",
            list: true,
            ui: { itemProps: (i: { label?: string }) => ({ label: i?.label }) },
            fields: [...statFields],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Story (rich text — headings, quotes, bullets, links)",
            isBody: true,
          },
        ],
      },

      // ───────────────────── Resources page (singleton) ─────────────────────
      // Header is frontmatter; the "No-fluff guarantee" trust note is the
      // rich-text body (edit it freely). Individual products live in the
      // "Resources / Products" collection above.
      {
        name: "resourcesPage",
        label: "Resources page",
        path: "src/content/pages",
        format: "md",
        match: { include: "resources" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "eyebrow", label: "Eyebrow" },
          { type: "string", name: "title", label: "Title" },
          {
            type: "string",
            name: "subtitle",
            label: "Subtitle",
            ui: { component: "textarea" },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Trust note (rich text — headings, quotes, bullets, links)",
            isBody: true,
          },
        ],
      },

      // ───────────────────────── Portfolio (singleton) ──────────────────────
      {
        name: "portfolio",
        label: "Portfolio page",
        path: "src/data",
        format: "json",
        match: { include: "portfolio" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "eyebrow", label: "Eyebrow" },
          { type: "string", name: "title", label: "Title" },
          { type: "string", name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
          {
            type: "object",
            name: "stats",
            label: "Stat strip",
            list: true,
            ui: { itemProps: (i: { label?: string }) => ({ label: i?.label }) },
            fields: [...statFields],
          },
          {
            type: "object",
            name: "projects",
            label: "Project cards",
            list: true,
            ui: { itemProps: (i: { title?: string }) => ({ label: i?.title }) },
            fields: [...cardFields],
          },
          { type: "string", name: "viewMoreLabel", label: "View-more button label" },
          { type: "string", name: "viewMoreHref", label: "View-more button URL" },
        ],
      },
    ],
  },
});
