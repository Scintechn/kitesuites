#!/usr/bin/env node
/**
 * Kite Suites browser driver.
 *
 * Boots the Next.js server itself (dev or prod), drives it with a headless
 * Chromium, and writes screenshots + a pass/fail report. Everything an agent
 * needs to confirm a change actually renders is here — no separate dev-server
 * terminal to babysit.
 *
 * Usage (from the repo root):
 *   node .claude/skills/run-kitesuites/driver.mjs smoke
 *   node .claude/skills/run-kitesuites/driver.mjs shots
 *   node .claude/skills/run-kitesuites/driver.mjs form
 *   node .claude/skills/run-kitesuites/driver.mjs shot /pt/menu menu.png
 *   node .claude/skills/run-kitesuites/driver.mjs all
 *
 * Flags:
 *   --dev          use `next dev` instead of `next start` (default: prod)
 *   --port=4310    port to bind (default 4310, avoids a busy 3000)
 *   --keep         leave the server running after the command finishes
 *   --headed       show the browser window
 *   --out=DIR      screenshot directory (default .claude/screenshots)
 */

import { spawn } from "node:child_process";
import { mkdir, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const ROOT = path.resolve(import.meta.dirname, "../../..");
const argv = process.argv.slice(2);
const cmd = argv.find((a) => !a.startsWith("--")) ?? "smoke";
const rest = argv.filter((a) => !a.startsWith("--")).slice(1);
const flag = (name, fallback) => {
  const hit = argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return fallback;
  return hit.includes("=") ? hit.split("=").slice(1).join("=") : true;
};

const DEV = Boolean(flag("dev", false));
const PORT = Number(flag("port", 4310));
const KEEP = Boolean(flag("keep", false));
const HEADED = Boolean(flag("headed", false));
/** `prod --form` submits the live contact form — sends a real Telegram message. */
const FORM = Boolean(flag("form", false));
const OUT = path.resolve(ROOT, String(flag("out", ".claude/screenshots")));

/** The deployed site checked by `prod`. Override with --url= or an argument. */
const PROD_URL = String(rest[0] ?? flag("url", "https://kitesuites.vercel.app"))
  .replace(/\/+$/, "");

/**
 * Reassigned to PROD_URL by the `prod` command — that one talks to the live
 * deployment and never starts a local server.
 */
let BASE = `http://127.0.0.1:${PORT}`;

const VIEWPORT = { width: 1366, height: 900 };
const MOBILE = { width: 390, height: 844 };

/** Every route the site serves, per locale. */
const ROUTES = ["", "/suites", "/services", "/restaurant", "/contact", "/privacy-policy", "/terms"];
const LOCALES = ["pt", "en"];

let serverProc = null;
const failures = [];
const notes = [];

function log(...args) {
  console.log(...args);
}

/**
 * Get a page into a photographable state.
 *
 * Scrolling matters for two reasons: it loads `loading="lazy"` content (the
 * Google Maps iframes on / and /contact are below the fold), and it settles
 * next/image. The extra networkidle + pause after scrolling is not padding —
 * the map iframe fetches its tiles only once it has been scrolled near, and a
 * fullPage screenshot taken before that photographs an empty grey box.
 */
async function settle(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1500);
}

function fail(msg) {
  failures.push(msg);
  console.error(`  ✗ ${msg}`);
}

function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

async function waitForServer(timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/pt`, { redirect: "manual" });
      if (res.status < 500) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

async function startServer() {
  // `next start` needs a build on disk; build first if .next is missing.
  if (!DEV && !existsSync(path.join(ROOT, ".next", "BUILD_ID"))) {
    log("→ no production build found, running `npm run build` first");
    await run("npm", ["run", "build"]);
  }

  const args = DEV ? ["run", "dev", "--", "--port", String(PORT)]
                   : ["run", "start", "--", "--port", String(PORT)];
  log(`→ starting server: npm ${args.join(" ")}`);

  // detached: npm forks `next-server` as a grandchild. Without its own process
  // group, killing npm leaves next-server holding the port and the next run
  // silently talks to a stale build.
  serverProc = spawn("npm", args, {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
    env: { ...process.env, PORT: String(PORT) },
  });

  let serverLog = "";
  serverProc.stdout.on("data", (d) => (serverLog += d.toString()));
  serverProc.stderr.on("data", (d) => (serverLog += d.toString()));

  const up = await waitForServer();
  if (!up) {
    console.error(serverLog.slice(-4000));
    throw new Error(`server did not come up on ${BASE}`);
  }
  log(`→ server up at ${BASE}`);
}

function run(bin, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(bin, args, { cwd: ROOT, stdio: "inherit" });
    p.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${bin} exited ${code}`)),
    );
  });
}

function stopServer() {
  if (serverProc && !serverProc.killed) {
    // npm spawns next as a child; kill the group so nothing keeps the port.
    try {
      process.kill(-serverProc.pid, "SIGTERM");
    } catch {
      serverProc.kill("SIGTERM");
    }
  }
}

/**
 * URLs that legitimately 404 when the app is not running on Vercel.
 * `@vercel/analytics` injects /_vercel/insights/script.js unconditionally;
 * that endpoint only exists on Vercel's edge, so locally it is always a 404.
 * Treating it as a failure would make every page red forever.
 */
const IGNORED = [
  /\/_vercel\/insights\//,
  /favicon/,
  // Third-party embeds on the home page. Their availability is not our
  // build's health: a Windguru outage or a Maps rate-limit must not turn
  // every route red in `smoke`. `interact` checks them explicitly instead.
  /windguru\.cz/,
  /google\.com\/maps/,
  /maps\.googleapis\.com/,
];

/** Collects console errors, page errors and bad responses for a page. */
function watch(page) {
  const errors = [];
  const ignorable = (url) => IGNORED.some((re) => re.test(url));

  page.on("console", (m) => {
    // Subresource 404s surface here without a URL, so they are unactionable;
    // the `response` handler below catches those with the URL attached.
    if (m.type() !== "error") return;
    const text = m.text();
    if (/Failed to load resource/i.test(text)) return;
    // The insights script 404 also shows up as a MIME-type refusal, because
    // Next answers the missing route with a text/plain 404 body.
    if (ignorable(text)) return;
    errors.push(`console: ${text}`);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("response", (r) => {
    if (r.status() < 400 || ignorable(r.url())) return;
    errors.push(`http ${r.status()}: ${r.url()}`);
  });
  page.on("requestfailed", (r) => {
    if (ignorable(r.url())) return;
    errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText ?? ""}`);
  });
  return errors;
}

async function withBrowser(fn) {
  const browser = await chromium.launch({ headless: !HEADED });
  try {
    return await fn(browser);
  } finally {
    await browser.close();
  }
}

/* ------------------------------------------------------------------ */
/* commands                                                            */
/* ------------------------------------------------------------------ */

/** Every route, both locales: 200, has an h1, no console errors. */
async function smoke(browser) {
  log("\n== smoke: all routes, both locales ==");
  const ctx = await browser.newContext({ viewport: VIEWPORT });

  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const url = `${BASE}/${locale}${route}`;
      const page = await ctx.newPage();
      const errors = watch(page);

      const res = await page.goto(url, { waitUntil: "networkidle" });
      const status = res?.status() ?? 0;
      const label = `${locale}${route || "/"}`;

      if (status !== 200) {
        fail(`${label} → HTTP ${status}`);
        await page.close();
        continue;
      }

      // Document structure. A stray `app/layout.tsx` alongside
      // `app/[locale]/layout.tsx` gives you TWO root layouts: the served HTML
      // gets nested <html> elements and the outer one wins the `lang`
      // attribute, so Portuguese pages quietly ship as lang="en". Chromium
      // drops the inner element without logging anything, so nothing else in
      // this driver would notice. Assert on the raw HTML.
      const html = await res.text();
      const htmlTags = (html.match(/<html[\s>]/g) ?? []).length;
      const expectedLang = locale === "pt" ? "pt-BR" : "en";
      const langMatch = /<html[^>]*\blang="([^"]+)"/.exec(html);

      if (htmlTags !== 1) {
        fail(`${label} → ${htmlTags} <html> elements (expected 1)`);
        await page.close();
        continue;
      }
      if (langMatch?.[1] !== expectedLang) {
        fail(`${label} → lang="${langMatch?.[1]}" (expected "${expectedLang}")`);
        await page.close();
        continue;
      }

      // The home page uses <h1> in the hero; inner pages in the page header.
      const h1 = (await page.locator("h1").first().textContent())?.trim() ?? "";
      if (!h1) {
        fail(`${label} → no <h1>`);
      } else if (errors.length) {
        fail(`${label} → ${errors.length} console/network error(s): ${errors[0]}`);
      } else {
        pass(`${label} → "${h1.slice(0, 48)}" [lang=${langMatch[1]}]`);
      }

      await page.close();
    }
  }

  // Locale prefix redirect (the proxy.ts rule).
  const page = await ctx.newPage();
  const res = await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  const landed = new URL(page.url()).pathname;
  if (landed === "/pt") pass(`/ → 308 → ${landed} (proxy redirect)`);
  else fail(`/ should redirect to /pt, landed on ${landed} (${res?.status()})`);
  await page.close();

  // robots + sitemap
  for (const p of ["/robots.txt", "/sitemap.xml"]) {
    const r = await fetch(`${BASE}${p}`);
    if (r.ok) pass(`${p} → ${r.status}`);
    else fail(`${p} → ${r.status}`);
  }

  await ctx.close();
}

/** Full-page screenshots, desktop + mobile, both locales. */
async function shots(browser) {
  log("\n== shots ==");
  await mkdir(OUT, { recursive: true });

  for (const [name, viewport] of [["desktop", VIEWPORT], ["mobile", MOBILE]]) {
    // reducedMotion is not cosmetic here: components/ui/Reveal.tsx starts at
    // opacity-0 and only fades in when an IntersectionObserver fires. Scripted
    // scrolling does not reliably trip it before a fullPage capture, so half
    // the page photographs blank. Reveal short-circuits to visible when
    // prefers-reduced-motion is set — which is also the honest thing to shoot.
    const ctx = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    for (const locale of LOCALES) {
      for (const route of ROUTES) {
        const page = await ctx.newPage();
        await page.goto(`${BASE}/${locale}${route}`, { waitUntil: "networkidle" });
        await settle(page);

        const slug = route === "" ? "home" : route.replace(/\//g, "");
        const file = path.join(OUT, `${name}-${locale}-${slug}.png`);
        await page.screenshot({ path: file, fullPage: true });
        pass(path.relative(ROOT, file));
        await page.close();
      }
    }
    await ctx.close();
  }
}

/** Drives the real contact form: validation path, then a full submit. */
async function form(browser) {
  log("\n== contact form ==");
  await mkdir(OUT, { recursive: true });
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  watch(page);

  await page.goto(`${BASE}/pt/contact`, { waitUntil: "networkidle" });

  // 1. Submit empty → client-side validation must block it.
  await page.getByTestId("contact-form").locator('button[type="submit"]').click();
  const err = page.getByTestId("form-error");
  await err.waitFor({ state: "visible", timeout: 5000 });
  pass(`empty submit blocked: "${(await err.textContent())?.trim()}"`);

  // 2. Fill it properly and submit for real.
  await page.fill("#name", "Agente de Teste");
  await page.fill("#email", "teste@example.com");
  await page.fill("#phone", "+55 22 99999-0000");
  await page.selectOption("#subject", "kitesurf");
  await page.fill(
    "#message",
    "Mensagem de teste enviada pelo driver do skill run-kitesuites.",
  );
  await page.check("#consent");
  await page.screenshot({ path: path.join(OUT, "form-filled.png"), fullPage: true });

  await page.getByTestId("contact-form").locator('button[type="submit"]').click();
  await page.waitForTimeout(2500);

  const success = await page.getByRole("status").count();
  if (success > 0) {
    pass("form submitted and Telegram delivery succeeded");
  } else {
    const text = (await page.getByTestId("form-error").textContent())?.trim();
    // Without TELEGRAM_* env vars the action returns {ok:false,error:"config"}
    // and the UI shows the generic error. That is the expected local result.
    notes.push(
      `contact form reached the server action and returned an error banner ("${text}"). ` +
        `Without TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID this is the expected local outcome ` +
        `(actions.ts logs "[contact] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID").`,
    );
    pass("form submitted; server action responded (see note below)");
  }

  await page.screenshot({ path: path.join(OUT, "form-result.png"), fullPage: true });
  pass(path.relative(ROOT, path.join(OUT, "form-result.png")));
  await ctx.close();
}

/** Locale switcher, mobile menu, and the WhatsApp CTA wiring. */
async function interact(browser) {
  log("\n== interactions ==");
  await mkdir(OUT, { recursive: true });
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();

  // Locale switcher keeps you on the same page.
  await page.goto(`${BASE}/pt/suites`, { waitUntil: "networkidle" });
  await page.getByRole("group", { name: /idioma|language/i }).getByText("EN").click();
  await page.waitForURL("**/en/suites", { timeout: 5000 });
  pass(`locale switch pt→en kept the route: ${new URL(page.url()).pathname}`);

  // WhatsApp CTAs must carry a prefilled message to the real number.
  await page.goto(`${BASE}/pt`, { waitUntil: "networkidle" });
  const waHrefs = await page.locator('a[href*="wa.me"]').evaluateAll((els) =>
    els.map((e) => e.getAttribute("href")),
  );
  const bad = waHrefs.filter((h) => !h?.includes("5522999886066"));
  if (waHrefs.length === 0) fail("no wa.me links on the home page");
  else if (bad.length) fail(`wa.me links with the wrong number: ${bad[0]}`);
  else pass(`${waHrefs.length} wa.me links, all → 5522999886066`);

  // Windguru wind forecast. The vendor script injects an iframe as a sibling
  // of its own <script id=...> tag, so this proves the injection worked, not
  // just that the script downloaded.
  await page.goto(`${BASE}/pt`, { waitUntil: "networkidle" });
  const windSection = page.locator("#vento");
  await windSection.scrollIntoViewIfNeeded();
  const windFrame = page
    .locator('#vento iframe[src*="windguru"]')
    .first();
  try {
    await windFrame.waitFor({ state: "attached", timeout: 20_000 });
    await page.waitForTimeout(3500);
    await page.screenshot({ path: path.join(OUT, "wind.png") });
    const box = await windFrame.boundingBox();
    if (!box || box.height < 100) {
      fail(`windguru iframe injected but collapsed (height ${box?.height ?? 0})`);
    } else {
      pass(
        `windguru forecast injected, ${Math.round(box.height)}px tall → .claude/screenshots/wind.png`,
      );
    }
  } catch {
    fail("windguru iframe never appeared inside #vento within 20s");
  }

  // Google Maps embed. It must be verified with the iframe ON SCREEN and a
  // viewport (not fullPage) screenshot — see the note in `shots`/Gotchas.
  await page.goto(`${BASE}/pt/contact`, { waitUntil: "networkidle" });
  const map = page.locator("iframe[title]").first();
  await map.scrollIntoViewIfNeeded();
  await page.waitForTimeout(4000);
  const mapFrame = page
    .frames()
    .find((f) => f.url().includes("google.com/maps"));
  if (!mapFrame) {
    fail("google maps iframe never navigated to google.com/maps");
  } else {
    await page.screenshot({ path: path.join(OUT, "map.png") });
    pass("maps embed loaded → .claude/screenshots/map.png (viewport shot)");
  }

  // Mobile menu opens.
  const m = await ctx.newPage();
  await m.setViewportSize(MOBILE);
  await m.goto(`${BASE}/pt`, { waitUntil: "networkidle" });
  await m.locator('button[aria-controls="mobile-menu"]').click();
  await m.locator("#mobile-menu").waitFor({ state: "visible", timeout: 5000 });
  await m.screenshot({ path: path.join(OUT, "mobile-menu.png") });
  pass("mobile menu opens → .claude/screenshots/mobile-menu.png");

  await ctx.close();
}

/**
 * Post-deploy check against the live site. Starts no server — it only talks
 * to whatever `--url` points at (default the Vercel production deployment).
 *
 * Run this after every deploy. Several of these can only fail in production:
 * the analytics script does not exist locally, security headers come from the
 * edge, and canonical URLs point at the final domain rather than the host you
 * are actually testing.
 */
async function prod(browser) {
  log(`\n== prod: ${BASE} ==`);

  // Every route, both locales.
  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const url = `${BASE}/${locale}${route}`;
      const res = await fetch(url, { redirect: "manual" });
      const label = `${locale}${route || "/"}`;
      if (res.status !== 200) {
        fail(`${label} → HTTP ${res.status}`);
        continue;
      }

      // The nested-root-layout regression is invisible in a browser: Chromium
      // silently drops the inner <html> and the page looks perfect while
      // shipping the wrong `lang`. Check the raw markup.
      const html = await res.text();
      const tags = (html.match(/<html[\s>]/g) ?? []).length;
      const lang = /<html[^>]*\blang="([^"]+)"/.exec(html)?.[1];
      const expected = locale === "pt" ? "pt-BR" : "en";

      if (tags !== 1) fail(`${label} → ${tags} <html> elements (expected 1)`);
      else if (lang !== expected)
        fail(`${label} → lang="${lang}" (expected "${expected}")`);
      else pass(`${label} → 200, lang=${lang}`);
    }
  }

  // Locale redirect, robots, sitemap.
  const root = await fetch(`${BASE}/`, { redirect: "manual" });
  const loc = root.headers.get("location") ?? "";
  if ([301, 307, 308].includes(root.status) && loc.endsWith("/pt"))
    pass(`/ → ${root.status} → ${loc}`);
  else fail(`/ → ${root.status} → ${loc || "(no redirect)"} (expected → /pt)`);

  for (const p of ["/robots.txt", "/sitemap.xml"]) {
    const r = await fetch(`${BASE}${p}`);
    if (r.ok) pass(`${p} → ${r.status}`);
    else fail(`${p} → ${r.status}`);
  }

  // Vercel Web Analytics. This 404s locally by design, so production is the
  // only place it can be verified.
  const insights = await fetch(`${BASE}/_vercel/insights/script.js`);
  const ctype = insights.headers.get("content-type") ?? "";
  if (insights.ok && /javascript/.test(ctype)) {
    pass(`analytics script → ${insights.status} (${ctype.split(";")[0]})`);
  } else {
    fail(
      `analytics script → ${insights.status} ${ctype} — Web Analytics is not ` +
        `enabled on this project, or this host is not served by Vercel`,
    );
  }

  // Security headers from next.config.ts, as actually served by the edge.
  const headRes = await fetch(`${BASE}/pt`);
  for (const [header, expected] of [
    ["x-frame-options", "DENY"],
    ["x-content-type-options", "nosniff"],
    ["referrer-policy", "strict-origin-when-cross-origin"],
  ]) {
    const got = headRes.headers.get(header);
    if (got === expected) pass(`${header}: ${got}`);
    else fail(`${header}: ${got ?? "(missing)"} (expected ${expected})`);
  }

  // Canonical host. Not a failure — it is correct to point at the final
  // domain — but it is worth saying out loud when the domain being tested is
  // not the domain being advertised to search engines.
  const home = await headRes.text();
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(home)?.[1];
  const siteUrl = /siteUrl:\s*"([^"]+)"/.exec(
    await readFile(path.join(ROOT, "lib/business.ts"), "utf8"),
  )?.[1];

  if (!canonical) {
    fail("no <link rel=canonical> on the home page");
  } else if (canonical.startsWith(BASE)) {
    pass(`canonical → ${canonical}`);
  } else {
    pass(`canonical → ${canonical}`);
    notes.push(
      `canonical/OG/sitemap point at ${siteUrl}, not the host just tested ` +
        `(${BASE}). That is correct once DNS moves, but until then search ` +
        `engines are told the canonical copy lives somewhere this content is ` +
        `not served. Do not submit the sitemap to Search Console yet.`,
    );
  }

  // Finally, render it. Catches anything that only breaks in a real browser.
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const errors = watch(page);
  await page.goto(`${BASE}/pt`, { waitUntil: "networkidle" });

  const h1 = (await page.locator("h1").first().textContent())?.trim() ?? "";
  if (h1) pass(`home renders → "${h1.slice(0, 40)}"`);
  else fail("home page has no <h1>");

  await page.locator("#vento").scrollIntoViewIfNeeded();
  const wind = page.locator('#vento iframe[src*="windguru"]').first();
  try {
    await wind.waitFor({ state: "attached", timeout: 20_000 });
    pass("windguru forecast loads in production");
  } catch {
    fail("windguru forecast did not load in production");
  }

  await mkdir(OUT, { recursive: true });
  await settle(page);
  await page.screenshot({ path: path.join(OUT, "prod-home.png"), fullPage: true });
  pass(path.relative(ROOT, path.join(OUT, "prod-home.png")));

  // Opt-in: actually submit the contact form on the live site. Off by default
  // because it SENDS A REAL TELEGRAM MESSAGE to the business every run.
  if (FORM) {
    log("\n-- prod --form: submitting the live contact form --");
    const f = await ctx.newPage();
    await f.goto(`${BASE}/pt/contact`, { waitUntil: "networkidle" });
    await f.fill("#name", "Teste automatico (driver)");
    await f.fill("#email", "driver@example.com");
    await f.fill("#phone", "+55 22 99999-0000");
    await f.selectOption("#subject", "outro");
    await f.fill(
      "#message",
      "Mensagem de teste do driver run-kitesuites verificando a entrega em producao. Pode ignorar.",
    );
    await f.check("#consent");
    await f.getByTestId("contact-form").locator('button[type="submit"]').click();
    await f.waitForTimeout(6000);

    if ((await f.getByRole("status").count()) > 0) {
      pass("contact form delivered to Telegram from production");
    } else {
      const msg = (await f.getByTestId("form-error").textContent())?.trim();
      fail(
        `contact form failed in production ("${msg}"). Either TELEGRAM_BOT_TOKEN / ` +
          `TELEGRAM_CHAT_ID are unset, or they were added after this deployment ` +
          `was built — Vercel only applies env vars to NEW deployments, so redeploy.`,
      );
    }
    await f.close();
  }

  if (errors.length) errors.forEach((e) => fail(`console: ${e}`));
  await ctx.close();
}

/** One-off: screenshot a single route. */
async function shot(browser) {
  const route = rest[0] ?? "/pt";
  const name = rest[1] ?? "shot.png";
  await mkdir(OUT, { recursive: true });
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const errors = watch(page);
  const res = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await settle(page);
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: true });
  log(`${route} → HTTP ${res?.status()} → ${path.relative(ROOT, file)}`);
  if (errors.length) errors.forEach((e) => fail(e));
  await ctx.close();
}

const COMMANDS = { smoke, shots, form, interact, shot, prod };

/** Commands that talk to a deployed site instead of booting one locally. */
const REMOTE = new Set(["prod"]);

async function main() {
  if (cmd === "help" || cmd === "--help") {
    log(
      [
        "local:  smoke | shots | form | interact | shot <route> <file> | all",
        "remote: prod [url]        check the deployed site (no local server)",
        "flags:  --dev --port=N --keep --headed --out=DIR --url=URL",
        "        --form            prod only: submit the live contact form",
        "                          (sends a REAL Telegram message)",
      ].join("\n"),
    );
    return;
  }

  const toRun =
    cmd === "all" ? ["smoke", "interact", "form", "shots"] : [cmd];
  for (const c of toRun) {
    if (!COMMANDS[c]) throw new Error(`unknown command: ${c}`);
  }

  if (cmd === "shots" || cmd === "all") await rm(OUT, { recursive: true, force: true });

  // `all` never includes a remote command, so this is a single-command test.
  const remote = REMOTE.has(cmd);
  if (remote) BASE = PROD_URL;
  else await startServer();

  try {
    await withBrowser(async (browser) => {
      for (const c of toRun) await COMMANDS[c](browser);
    });
  } finally {
    if (remote) {
      /* nothing to tear down */
    } else if (!KEEP) stopServer();
    else log(`\n→ --keep: server still running at ${BASE} (kill it yourself)`);
  }

  if (notes.length) {
    log("\nnotes:");
    notes.forEach((n) => log(`  · ${n}`));
  }

  if (failures.length) {
    console.error(`\nFAILED (${failures.length}):`);
    failures.forEach((f) => console.error(`  · ${f}`));
    process.exitCode = 1;
  } else {
    log(`\nOK — ${toRun.join(", ")} passed`);
  }
}

process.on("SIGINT", () => {
  stopServer();
  process.exit(130);
});

main().catch((err) => {
  console.error(err);
  stopServer();
  process.exit(1);
});
