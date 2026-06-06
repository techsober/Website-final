/**
 * Production build wrapper.
 *
 * Builds the TinaCMS admin (/admin) when Tina Cloud keys are present, then runs
 * the Astro build + Pagefind index. Logs loudly so a failed admin build is
 * obvious in the Cloudflare build log (the site still deploys either way).
 */
import { execSync } from "node:child_process";

const run = (cmd) => {
  console.log(`» ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
};

const hasId = Boolean(process.env.PUBLIC_TINA_CLIENT_ID);
const hasToken = Boolean(process.env.TINA_TOKEN);

console.log("──────────── TinaCMS admin ────────────");
console.log(`  PUBLIC_TINA_CLIENT_ID present: ${hasId}`);
console.log(`  TINA_TOKEN present:            ${hasToken}`);
console.log(`  branch: ${process.env.CF_PAGES_BRANCH || process.env.HEAD || "(unknown)"}`);

if (hasId && hasToken) {
  try {
    run("npx tinacms build");
    console.log("✅ TINA ADMIN BUILT (/admin)");
  } catch (err) {
    console.error("");
    console.error("❌❌❌ TINA ADMIN BUILD FAILED — /admin will be missing ❌❌❌");
    console.error(String(err && err.message ? err.message : err));
    console.error("(Continuing so the site still deploys.)");
    console.error("");
  }
} else {
  console.log("ℹ Keys missing — skipping /admin build (site builds normally).");
}
console.log("───────────────────────────────────────");

run("npx astro build");
run("npx pagefind --site dist");
