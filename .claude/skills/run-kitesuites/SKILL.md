---
name: run-kitesuites
description: Build, run, screenshot and drive the Kite Suites site (Next.js 16 + Tailwind v4, pt/en). Use when asked to run, start, build, serve, test, screenshot, or verify a change in the Kite Suites app — including checking a page renders, the contact form works, the locale switcher works, the Windguru wind forecast loads, or the WhatsApp CTAs point at the right number.
---

# Run Kite Suites

Bilingual (pt/en) marketing site for the Kite Suites guesthouse in Praia Seca,
Araruama - RJ. Next.js 16 App Router, Tailwind v4, no UI library, no CMS —
copy lives in typed dictionaries under `lib/i18n/`, business facts in
`lib/business.ts`.

**Everything is driven through one script:**
`.claude/skills/run-kitesuites/driver.mjs`. It boots the Next server itself,
drives it with headless Chromium, and writes screenshots. You do not need a
second terminal running `npm run dev`.

All paths below are relative to the repo root (`/Users/sci/Claude/Projects/kitesuites`).

## Prerequisites

Node 26 and npm 11 (verified on `v26.3.0` / `11.16.0`). First time only:

```bash
npm install
npx playwright install chromium
```

`playwright` is already a devDependency; `playwright install` downloads the
browser binary (~95 MB) into `~/Library/Caches/ms-playwright/`.

## Run (agent path) — the driver

```bash
node .claude/skills/run-kitesuites/driver.mjs smoke      # all 14 routes, both locales
node .claude/skills/run-kitesuites/driver.mjs interact   # locale switch, WhatsApp CTAs, wind widget, map, mobile menu
node .claude/skills/run-kitesuites/driver.mjs form       # contact form: validation + real submit
node .claude/skills/run-kitesuites/driver.mjs shots      # 28 full-page screenshots (desktop + mobile)
node .claude/skills/run-kitesuites/driver.mjs all        # smoke, interact, form, shots
```

Check the **deployed** site instead (starts no local server):

```bash
node .claude/skills/run-kitesuites/driver.mjs prod                        # https://kitesuites.vercel.app
node .claude/skills/run-kitesuites/driver.mjs prod https://kitesuites.com.br
```

One-off screenshot of a single route:

```bash
node .claude/skills/run-kitesuites/driver.mjs shot /pt/restaurant restaurant.png
```

Flags: `--dev` (use `next dev` instead of `next start`), `--port=4310`,
`--keep` (leave the server up), `--headed` (visible browser),
`--out=DIR` (screenshot directory).

Screenshots land in `.claude/screenshots/` (gitignored). The driver exits
non-zero if any check fails, and prints every failure at the end.

**`smoke` is the check to run after any change.** It asserts, for both
locales and all 7 routes: HTTP 200, a non-empty `<h1>`, and zero console /
network errors — plus the `/` → `/pt` proxy redirect, `/robots.txt` and
`/sitemap.xml`.

Expected clean output:

```
== smoke: all routes, both locales ==
  ✓ pt/ → "À espera de novos ventos"
  ✓ pt/suites → "Acomodações"
  ...
  ✓ / → 308 → /pt (proxy redirect)
  ✓ /robots.txt → 200
  ✓ /sitemap.xml → 200

OK — smoke passed
```

## Run after every deploy (`prod`)

```bash
node .claude/skills/run-kitesuites/driver.mjs prod
```

Targets `https://kitesuites.vercel.app` by default; pass a URL to check
another host. It boots nothing locally — several of these checks *can only*
fail in production:

- All 14 routes → 200, with exactly one `<html>` and the right `lang`.
- `/` → 307/308 → `/pt`, plus `robots.txt` and `sitemap.xml`.
- **`/_vercel/insights/script.js` → 200 `application/javascript`.** This is the
  Vercel Web Analytics tracker. It 404s locally by design, so production is
  the only place it can be verified. A 404 here means analytics is off for the
  project, or the host is not served by Vercel at all.
- Security headers actually emitted by the edge (`X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`) — these come from
  `next.config.ts` but only the deployment proves they survive.
- Canonical URL, with a note when it points somewhere other than the host
  being tested.
- A real browser pass: home renders, Windguru forecast loads, no console
  errors, and a screenshot at `.claude/screenshots/prod-home.png`.

**Custom analytics events are not covered.** `whatsapp_click`, `phone_click`
and `contact_form_submit` only fire on real interaction, so they cannot be
asserted from a cold page load — check the dashboard's Events tab after
clicking. If page views arrive but events never do, that is a plan limit, not
a code fault.

## Build

```bash
npm run build      # next build (Turbopack); prerenders 20 pages
npx tsc --noEmit   # types only, faster than a full build
npm run lint
```

`driver.mjs` runs `npm run build` automatically if `.next/BUILD_ID` is missing,
so `smoke` works from a clean checkout.

## Run (human path)

```bash
npm run dev   # http://localhost:3000 → redirects to /pt
```

Fine for eyeballing in a real browser. Useless for verifying anything
programmatically — use the driver.

## Routes

Locale-prefixed, always. `proxy.ts` 308-redirects any unprefixed path to `/pt`.

| Route | pt | en |
|---|---|---|
| `/{locale}` | Home | Home |
| `/{locale}/suites` | Acomodações | Rooms |
| `/{locale}/services` | Serviços | Services |
| `/{locale}/restaurant` | Restaurante | Restaurant |
| `/{locale}/contact` | Contato | Contact |
| `/{locale}/privacy-policy` · `/terms` | legal | legal |

Route segments are English in **both** locales — only the visible labels are
translated. Don't add `/pt/acomodacoes`.

## Wind forecast

The home page carries a live Windguru forecast at `#vento`
(`components/WindWidget.tsx`) — wind speed, gusts and direction for the next
72 h, in knots. Spot **7063 = "Araruama - Praia Seca"**
(<https://www.windguru.cz/7063>).

`driver.mjs interact` asserts the iframe is actually injected and taller than
100 px, and writes `.claude/screenshots/wind.png`.

The vendor script is unusual and the reason `WindWidget` looks the way it
does: it locates itself with `document.getElementById(uid)`, where `uid` is
the id of **its own `<script>` tag**, then inserts the forecast iframe as that
tag's *next sibling*. So the script element must be appended into the
container you want the widget in. Loading it via `next/script`, or from
`<head>`, renders nothing at all and fails silently.

## Where to change what

| Change | File |
|---|---|
| Phone, address, WhatsApp number, opening hours, Instagram | `lib/business.ts` |
| Any user-visible string | `lib/i18n/pt.ts` **and** `lib/i18n/en.ts` |
| Dictionary shape (adding a field) | `lib/i18n/types.ts` first — `tsc` then flags both locales |
| Menu items and prices | `restaurantPage.sections` in both dictionaries |
| Wind forecast spot / units | `components/WindWidget.tsx` (`SPOT_ID`, `widgetSrc`) |
| Rooms | `suitesPage.items` in both dictionaries |
| Colours / fonts | `app/globals.css` (`@theme` block) |
| Lead delivery | `app/[locale]/contact/actions.ts` |

## Contact form

Client validation in `components/ContactForm.tsx`, authoritative validation +
Telegram delivery in the server action `app/[locale]/contact/actions.ts`.

`driver.mjs form` submits it for real. **Without Telegram credentials the
submit correctly fails** — the action returns `{ok:false,error:"config"}`, the
UI shows the generic error banner, and the server logs
`[contact] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID`. The driver treats
that as a pass and prints a note. To exercise the success path:

```bash
printf 'TELEGRAM_BOT_TOKEN=...\nTELEGRAM_CHAT_ID=...\n' > .env.local
node .claude/skills/run-kitesuites/driver.mjs form   # now expects the success panel
```

The chat ID is at `result[].message.chat.id` in `getUpdates` — *not* the
`update_id` you see first.

## Gotchas

These all cost real time. Read them before debugging.

- **A blank grey box where the Google map should be is a screenshot artifact,
  not a bug.** Chromium renders cross-origin iframes out-of-process, and
  `fullPage: true` captures beyond the viewport do not composite them. The map
  loads fine — verified by tile requests to `maps.googleapis.com`. To actually
  see it, the iframe must be **on screen** and the shot must be **viewport,
  not fullPage** — that is what `driver.mjs interact` does, writing
  `.claude/screenshots/map.png`. Every `shots` output shows the map blank on
  `/`  and `/contact`; ignore it.

- **There must be no `app/layout.tsx`.** `app/[locale]/layout.tsx` *is* the
  root layout — it renders `<html>` and `<body>`. If a stray root layout
  reappears (create-next-app ships one, and re-scaffolding brings it back),
  you get two root layouts: the served HTML has **nested `<html>` elements**
  and the outer one wins the `lang` attribute, so every Portuguese page
  silently ships as `lang="en"`. Chromium drops the inner element without a
  console warning, so a screenshot looks perfectly fine. `smoke` now asserts
  exactly one `<html>` and the right `lang` per locale — that check exists
  because this actually happened.

- **Third-party embeds are excluded from `smoke`'s error check** —
  `windguru.cz`, `google.com/maps`, `maps.googleapis.com` are in the driver's
  `IGNORED` list. A vendor outage must not turn all 14 routes red on a change
  that had nothing to do with them. `interact` checks both embeds explicitly,
  and that is where a genuine widget regression will show up.

- **The Windguru widget is an iframe too**, so it photographs blank in `shots`
  for exactly the same reason as the map. `.claude/screenshots/wind.png` from
  `interact` is the one that shows real data.

- **`components/ui/Reveal.tsx` starts hidden** and only fades in when an
  IntersectionObserver fires. Scripted scrolling does *not* reliably trip it
  before a `fullPage` capture, so half the page photographs blank. The hidden
  state is gated behind Tailwind's `motion-safe:` variant, so the driver opens
  every context with `reducedMotion: "reduce"` and the content is simply never
  hidden. If you write your own Playwright script and your screenshots come
  out mostly empty, this is why.

  (The gating is CSS, not JS, on purpose: setting the visible state from
  inside the effect body trips `react-hooks/set-state-in-effect` and fails
  `npm run lint`.)

- **`@vercel/analytics` 404s locally, always.** It injects
  `/_vercel/insights/script.js`, which only exists on Vercel's edge. Next
  answers with a `text/plain` 404, so Chromium *also* logs
  `Refused to execute script ... MIME type ('text/plain') is not executable`.
  Both are filtered by the driver's `IGNORED` list. Don't "fix" it.

- **Killing the server needs a process group.** `npm run start` forks
  `next-server` as a grandchild; killing the npm process leaves it holding the
  port, and the next run silently talks to a **stale build**. The driver spawns
  with `detached: true` and kills `-pid`. If a run ever leaves a zombie:
  `lsof -ti :4310 | xargs kill -9`.

- **lucide v1 dropped brand icons.** There is no `Instagram` export. The glyph
  in `components/icons.tsx` is hand-rolled on lucide's 24px/2px grid. Importing
  `Instagram` from `lucide-react` fails the build.

- **The driver defaults to port 4310, not 3000** — deliberately, so it never
  collides with a dev server you left running.

- **`next start` needs a build.** Changing source and re-running the driver
  without `npm run build` tests the *old* bundle. Use `--dev` while iterating,
  or rebuild.

- **Route params are a Promise in Next 16.** Every page does
  `const { locale: raw } = await params;`. Forgetting the `await` typechecks
  but renders nothing useful.

- **`proxy.ts`, not `middleware.ts`.** Next 16 renamed the convention. The
  locale list is duplicated inside it on purpose — importing `lib/i18n` would
  pull both full dictionaries into the proxy bundle.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `Cannot find module '.../public/images/.claude/skills/...'` | You ran the driver from a subdirectory. `cd` to the repo root first. |
| `Error: server did not come up on http://127.0.0.1:4310` | Port held by a zombie: `lsof -ti :4310 \| xargs kill -9`. The driver prints the last 4 KB of server output above this. |
| Every route fails with `1 console/network error(s)` mentioning `_vercel/insights` | You edited `IGNORED` in the driver. Restore the `/_vercel\/insights\//` pattern. |
| Screenshots mostly blank below the hero | Missing `reducedMotion: "reduce"` — see Gotchas. |
| `Module '"lucide-react"' has no exported member 'Instagram'` | Import it from `@/components/icons` instead. |
| Changes not showing up | `next start` serves the last build. `npm run build`, or pass `--dev`. |
| Form always shows the red error banner | Expected without `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`. See Contact form above. |

## Deploy

Vercel. `vercel.json` pins `"framework": "nextjs"` — if the dashboard preset
ever drifts to "Other", builds finish in ~14s with `Builds: . [0ms]` and every
route 404s from the edge. Verify with `vercel inspect <deployment-url>`.

Env vars needed in production: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. They
live only in a gitignored `.env.local` locally, so they must be set in the
dashboard separately or the production contact form fails closed.

Verify a deploy with `driver.mjs prod` (see above).

**The domain has not moved yet.** `business.siteUrl` is
`https://kitesuites.com.br`, which still serves the old site, so canonical
URLs, OG tags and `sitemap.xml` all advertise a host where this content is not
published. That resolves itself when DNS points at Vercel — until then, don't
submit the sitemap to Search Console.
