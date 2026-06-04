/**
 * Inline SVG icon bodies — the inner markup is copied verbatim from the
 * approved mock so rendering is pixel-identical. Colour/stroke come from CSS
 * (CSS rules override the svg's presentation attributes), matching the mock.
 *
 * `solid: true` => filled glyph (no stroke); otherwise stroked outline.
 */
export interface IconDef {
  body: string;
  solid?: boolean;
}

export const ICONS: Record<string, IconDef> = {
  // YouTube / video tile (rect + filled play triangle) — from the mock.
  youtube: {
    body: '<rect x="2" y="4" width="20" height="16" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/>',
  },
  // AI spark/atom — from the mock's "AI Projects" nav card.
  ai: {
    body: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/><circle cx="12" cy="12" r="2.5"/>',
  },
  // Document / blog — from the mock's "Blog" nav card.
  doc: {
    body: '<path d="M5 4h11l3 3v13H5z"/><path d="M16 4v4h4M9 13h6M9 17h4"/>',
  },
  // Envelope / mail — from the mock's "Get in Touch" card + contact rows.
  mail: {
    body: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/>',
  },
  // Arrow-right — ghost links.
  arrow: { body: '<path d="M5 12h14M13 6l6 6-6 6"/>' },
  // Solid play triangle — card thumbnails.
  play: { body: '<path d="M8 5v14l11-7z"/>', solid: true },
  // Trend-up — gold result/metric pills.
  trend: { body: '<path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v6h-6"/>' },
  // Social: Instagram.
  instagram: {
    body: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  },
  // Social: TikTok.
  tiktok: {
    body: '<path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46"/><path d="M14 4a5 5 0 0 0 5 4"/>',
  },
  // Social: X.
  x: { body: '<path d="M4 4l16 16M20 4L4 20"/>' },

  // --- Extra icons for the other pages (same line weight / style) ---
  rocket: {
    body: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.8-.8.9-2 .2-2.8-.7-.7-2-.6-3.2.8z"/><path d="M9 12c3-7 8-9 12-9 0 4-2 9-9 12l-3-3z"/><circle cx="14.5" cy="9.5" r="1.5"/>',
  },
  bolt: { body: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>' },
  layers: {
    body: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  },
  headphones: {
    body: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/>',
  },
  graduate: {
    body: '<path d="M12 4L2 9l10 5 10-5-10-5z"/><path d="M6 11v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4"/>',
  },
  gear: {
    body: '<circle cx="12" cy="12" r="3.2"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2l-.4-2.5H8.8l-.4 2.5a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 4 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.5h6.4l.4-2.5a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"/>',
  },
  check: { body: '<path d="M5 13l4 4L19 7"/>' },
  warning: {
    body: '<path d="M12 3l9 16H3l9-16z"/><path d="M12 10v4M12 17v.5"/>',
  },
  download: {
    body: '<path d="M12 3v12M7 11l5 5 5-5"/><path d="M5 21h14"/>',
  },
  external: {
    body: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v5H5V5h5"/>',
  },
  search: {
    body: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  },
  clock: {
    body: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  },
};

export type IconName = keyof typeof ICONS;
