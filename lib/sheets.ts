import { createSign, randomBytes } from "node:crypto";

/**
 * Minimal Google Sheets append/lookup over the REST API.
 *
 * Deliberately dependency-free: `googleapis` is enormous for a landing site
 * that needs exactly two calls. A service-account JWT is ~40 lines with
 * node:crypto, and this is the same hand-rolled posture the project takes with
 * form validation.
 *
 * Setup (see SKILL.md): enable the Sheets API, create a service account, and
 * SHARE THE SPREADSHEET WITH THE SERVICE ACCOUNT EMAIL AS EDITOR. Skipping the
 * share is the usual cause of a 403 that otherwise looks like a bad key.
 */

const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const TAB = "Leads";

/** timestamp | name | phone | email | birth_date | code | locale | source | consent */
const APPEND_RANGE = `${TAB}!A:I`;
/** email | birth_date | code — the slice needed to look up a returning lead. */
const LOOKUP_RANGE = `${TAB}!D:F`;

export type LeadRow = {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  code: string;
  locale: string;
  source: string;
};

type Creds = { email: string; key: string; sheetId: string };

/** Read env at call time, never at module load, so a missing var logs clearly. */
function credentials(): Creds | null {
  // Dashboard paste artifacts are the norm, not the exception: values arrive
  // wrapped in the quotes copied from a .env file, or with a trailing newline.
  // Neither is visible in the UI and both break the signature with an opaque
  // error, so normalise before use.
  const clean = (v: string | undefined) =>
    v?.trim().replace(/^['"]|['"]$/g, "") || undefined;

  const email = clean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  const key = clean(process.env.GOOGLE_PRIVATE_KEY);
  const sheetId = clean(process.env.LEADS_SHEET_ID);
  if (!email || !key || !sheetId) return null;

  // Guard against the easy mistake: creating an API key (AIza…) instead of a
  // service account. An API key can only read *public* Sheets and can never
  // write, so an append would fail with an opaque 401 much later. Say so here.
  if (!email.endsWith(".iam.gserviceaccount.com")) {
    console.error(
      "[sheets] GOOGLE_SERVICE_ACCOUNT_EMAIL is not a service account address " +
        "(expected something ending in .iam.gserviceaccount.com). Use the " +
        "`client_email` field from the service account JSON key file.",
    );
    return null;
  }
  if (!key.includes("BEGIN PRIVATE KEY")) {
    console.error(
      "[sheets] GOOGLE_PRIVATE_KEY does not look like a PEM key. Use the " +
        "`private_key` field from the service account JSON (it starts with " +
        "-----BEGIN PRIVATE KEY-----). An API key (AIza…) or a private_key_id " +
        "will not work: API keys cannot write to Sheets at all.",
    );
    return null;
  }

  // Dashboards and .env files carry the PEM with literal \n escapes.
  return { email, key: key.replace(/\\n/g, "\n"), sheetId };
}

export function sheetsConfigured(): boolean {
  return credentials() !== null;
}

export function giftCode(): string {
  return `KS-${randomBytes(3).toString("hex").toUpperCase()}`;
}

const b64url = (input: string | Buffer) => Buffer.from(input).toString("base64url");

/** Per-instance token cache. Serverless gives each instance its own copy. */
let cached: { token: string; expiresAt: number } | null = null;

async function accessToken(c: Creds): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.expiresAt > now + 60) return cached.token;

  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: c.email,
      scope: SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    }),
  );

  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const assertion = `${header}.${claim}.${b64url(signer.sign(c.key))}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`token exchange ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as { access_token: string; expires_in?: number };
  cached = { token: json.access_token, expiresAt: now + (json.expires_in ?? 3600) };
  return cached.token;
}

async function sheetsFetch(c: Creds, path: string, init?: RequestInit) {
  const token = await accessToken(c);
  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${c.sheetId}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
}

/**
 * The gift code already issued to this email, if any. A returning visitor gets
 * their original code back rather than an error or a second row.
 */
export async function findExistingCode(email: string): Promise<string | null> {
  const c = credentials();
  if (!c) return null;

  const res = await sheetsFetch(c, `/values/${encodeURIComponent(LOOKUP_RANGE)}`);
  if (!res.ok) {
    throw new Error(`lookup ${res.status}: ${await res.text()}`);
  }

  const { values } = (await res.json()) as { values?: string[][] };
  const needle = email.toLowerCase();
  for (const row of values ?? []) {
    if ((row[0] ?? "").trim().toLowerCase() === needle) return row[2] ?? null;
  }
  return null;
}

export async function appendLead(row: LeadRow): Promise<void> {
  const c = credentials();
  if (!c) throw new Error("sheets not configured");

  const res = await sheetsFetch(
    c,
    `/values/${encodeURIComponent(APPEND_RANGE)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      body: JSON.stringify({
        values: [
          [
            new Date().toISOString(),
            row.name,
            // Leading apostrophe stops Sheets mangling +55… into a formula.
            `'${row.phone}`,
            row.email,
            row.birthDate,
            row.code,
            row.locale,
            row.source,
            "TRUE",
          ],
        ],
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`append ${res.status}: ${await res.text()}`);
  }
}
