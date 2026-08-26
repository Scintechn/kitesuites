# Kite Suites

Marketing site for **Kite Suites** — guesthouse, restaurant and kitesurf spot
facing the Araruama lagoon in Praia Seca, Araruama - RJ, Brazil.

Bilingual (pt-BR primary, en secondary), statically prerendered, deployed on
Vercel.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme` tokens in `app/globals.css`) |
| Icons | lucide-react |
| Fonts | `next/font/google` — Fraunces (display), Inter (body) |
| Analytics | `@vercel/analytics`, cookieless |
| Forms | React 19 `useState` + Server Action → Telegram bot |
| Leads | Server Action → Airtable REST API (`lib/airtable.ts`) |
| Hosting | Vercel |

No UI component library, no state management, no CMS, no database. Copy lives
in typed dictionaries; business facts live in one file.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000 → /pt
```

## Driving it programmatically

There is a browser driver that boots the server, exercises every route, drives
the contact form and writes screenshots:

```bash
npx playwright install chromium                          # first time
node .claude/skills/run-kitesuites/driver.mjs smoke      # all routes, both locales
node .claude/skills/run-kitesuites/driver.mjs all        # + interactions, form, screenshots
```

Full documentation — including the non-obvious traps — is in
[`.claude/skills/run-kitesuites/SKILL.md`](.claude/skills/run-kitesuites/SKILL.md).
Claude Code auto-loads it as the `/run-kitesuites` skill.

## Project layout

```
app/[locale]/          pt + en pages (home, suites, services, menu, contact, legal)
components/            Header, Footer, ContactForm, SuiteCard, ui/ primitives
lib/business.ts        single source of truth for business facts
lib/i18n/{pt,en}.ts    single source of truth for all copy
proxy.ts               locale-prefix redirect (Next 16 renamed middleware.ts)
public/images/         property photography and brand marks
```

## Two rules

1. **A business fact has exactly one home:** `lib/business.ts`. Changing the
   phone number is a one-line diff.
2. **A user-visible string has exactly one home:** `lib/i18n/pt.ts` and its
   `en.ts` twin, both typed against `lib/i18n/types.ts`. Adding a key to the
   type makes TypeScript flag every locale that is missing it.

## Environment

```
TELEGRAM_BOT_TOKEN=   # @BotFather
TELEGRAM_CHAT_ID=     # result[].message.chat.id from getUpdates
AIRTABLE_TOKEN=       # PAT from airtable.com/create/tokens (starts with pat)
AIRTABLE_BASE_ID=     # first id in the base URL (starts with app)
```

Without the Telegram pair the contact form validates and reaches the server
action, then returns a generic error — by design, and logged as
`[contact] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID`.

Without the Airtable pair the gift signup does the same, logging
`[leads] Missing AIRTABLE_...`. With them set but failing, the visitor still
gets their gift code and Telegram carries the lead instead — storage is never
allowed to cost a lead. See the `run-kitesuites` skill for the required `Leads`
table schema.

## Content provenance

Copy, menu prices, room descriptions, photography and the brand mark are
transcribed from the business's existing site at <https://kitesuites.com.br>.
