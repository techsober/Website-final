/**
 * Production build wrapper.
 *
 * Builds the TinaCMS admin (/admin) only when Tina Cloud keys are present, then
 * runs the Astro build + Pagefind index. This means the Cloudflare build
 * command stays `npm run build` and never breaks: before Tina is configured it
 * simply skips the admin; once PUBLIC_TINA_CLIENT_ID + TINA_TOKEN are set, the
 * admin is generated and deployed automatically.
 */
import { execSync } from "node:child_process";

const run = (cmd) => {
  console.log(`» ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
};

const hasTina =
  process.env.PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN;

if (hasTina) {
  try {
    run("npx tinacms build");
  } catch {
    console.warn(
      "⚠ tinacms build failed — continuing with the site build (admin not updated).",
    );
  }
} else {
  console.log(
    "ℹ TinaCMS keys not set — skipping /admin build. The site builds normally.",
  );
}

run("npx astro build");
run("npx pagefind --site dist");
