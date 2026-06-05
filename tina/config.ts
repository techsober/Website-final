/**
 * TinaCMS — git-backed editing for the blog. Maps a `post` collection to
 * src/content/blog, matching the Astro content schema 1:1 so edits stay valid.
 *
 * Local editing (no cloud needed):   npx tinacms dev -c "astro dev"
 *   then open http://localhost:4321/admin/index.html
 * Cloud (publish without the terminal): set PUBLIC_TINA_CLIENT_ID + TINA_TOKEN.
 * See the README for the full walkthrough.
 */
import { defineConfig } from "tinacms";

// The branch Tina commits to (auto-detected on Cloudflare / Vercel / locally).
const branch =
  process.env.TINA_BRANCH ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  // From app.tina.io (optional — only needed for cloud editing/publishing).
  clientId: process.env.PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin", // served at /admin
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads", // public/uploads
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Posts",
        path: "src/content/blog",
        format: "md",
        ui: {
          // Friendly, readable slugs from the title.
          filename: {
            slugify: (values: { title?: string }) =>
              (values?.title || "untitled-post")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
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
          {
            type: "datetime",
            name: "date",
            label: "Publish date",
            required: true,
          },
          { type: "image", name: "cover", label: "Cover image" },
          {
            type: "string",
            name: "coverAlt",
            label: "Cover alt text (accessibility)",
          },
          {
            type: "string",
            name: "author",
            label: "Author",
            // Matches the Astro schema default.
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft (hidden from the live site)",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
