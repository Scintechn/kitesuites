import { randomBytes } from "node:crypto";

/**
 * Minimal Airtable lookup/create over the REST API.
 *
 * Deliberately dependency-free, like the Sheets client it replaces: a landing
 * site needs exactly two calls, and Airtable auth is a bearer token rather
 * than a signed JWT, so there is nothing left worth a package for.
 *
 * Setup (see SKILL.md): create a base, create a Personal Access Token with
 * data.records:read + data.records:write, and GRANT THAT TOKEN ACCESS TO THE
 * BASE under "Access". Scopes alone are not enough — a token with every scope
 * and no base access still 403s, which is the usual cause of a failure that
 * otherwise looks like a bad token.
 */

const API = "https://api.airtable.com/v0";
const TABLE = "Leads";

/** Name | Phone | Email | Birth Date | Code | Locale | Source | Consent.
 *  No timestamp: Airtable stamps `createdTime` on every record by itself, and
 *  a computed created-time field would reject a write with a 422 anyway. */
export type LeadRow = {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  code: string;
  locale: string;
  source: string;
};

type Creds = { token: string; baseId: string };

/** Read env at call time, never at module load, so a missing var logs clearly. */
function credentials(): Creds | null {
  // Dashboard paste artifacts are the norm, not the exception: values arrive
  // wrapped in the quotes copied from a .env file, or with a trailing newline.
  // Neither is visible in the UI and both break the request with an opaque
  // error, so normalise before use.
  const clean = (v: string | undefined) =>
    v?.trim().replace(/^['"]|['"]$/g, "") || undefined;

  const token = clean(process.env.AIRTABLE_TOKEN);
  const baseId = clean(process.env.AIRTABLE_BASE_ID);
  if (!token || !baseId) return null;

  // Guard against the easy mistake: Airtable's legacy user API keys (key…)
  // still exist in old docs and screenshots but were deprecated in 2024 and
  // now fail with a flat 401. Personal Access Tokens start with `pat`.
  if (!token.startsWith("pat")) {
    console.error(
      "[airtable] AIRTABLE_TOKEN does not look like a Personal Access Token " +
        "(expected it to start with `pat`). Legacy API keys (key…) are " +
        "deprecated and can no longer authenticate. Create a token at " +
        "https://airtable.com/create/tokens",
    );
    return null;
  }
  // The base id, the table id and the view id all sit in the same URL and all
  // look alike. Only the base id (app…) belongs here; a table id (tbl…) gives
  // a 404 that reads as if the base does not exist.
  if (!baseId.startsWith("app")) {
    console.error(
      "[airtable] AIRTABLE_BASE_ID does not look like a base id (expected it " +
        "to start with `app`). It is the FIRST id in the base URL — " +
        "airtable.com/appXXXXXXXX/tblYYYYYYYY/viwZZZZZZZZ — not the table " +
        "(tbl…) or view (viw…) id.",
    );
    return null;
  }

  return { token, baseId };
}

export function airtableConfigured(): boolean {
  return credentials() !== null;
}

export function giftCode(): string {
  return `KS-${randomBytes(3).toString("hex").toUpperCase()}`;
}

/**
 * Airtable formulas are strings built by concatenation, so an email carrying a
 * quote or a backslash would break — or escape — the filter. The email regex in
 * leads.ts only forbids whitespace and `@`, so both characters can reach here.
 */
function escapeFormula(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function airtableFetch(
  c: Creds,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = `${API}/${c.baseId}/${encodeURIComponent(TABLE)}${path}`;
  const request = () =>
    fetch(url, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${c.token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

  const res = await request();
  // Airtable allows 5 requests/second per base and a signup makes two, so 429
  // needs a nudge rather than a queue. One retry, then let the caller throw.
  if (res.status !== 429) return res;
  const after = Number(res.headers.get("Retry-After")) || 1;
  await new Promise((r) => setTimeout(r, Math.min(after, 5) * 1000));
  return request();
}

/**
 * The gift code already issued to this email, if any. A returning visitor gets
 * their original code back rather than an error or a second record.
 */
export async function findExistingCode(email: string): Promise<string | null> {
  const c = credentials();
  if (!c) return null;

  const params = new URLSearchParams({
    filterByFormula: `LOWER({Email})="${escapeFormula(email.toLowerCase())}"`,
    maxRecords: "1",
  });
  params.append("fields[]", "Code");

  const res = await airtableFetch(c, `?${params}`);
  if (!res.ok) {
    throw new Error(`lookup ${res.status}: ${await res.text()}`);
  }

  const { records } = (await res.json()) as {
    records?: { fields?: { Code?: string } }[];
  };
  return records?.[0]?.fields?.Code ?? null;
}

export async function appendLead(row: LeadRow): Promise<void> {
  const c = credentials();
  if (!c) throw new Error("airtable not configured");

  const res = await airtableFetch(c, "", {
    method: "POST",
    body: JSON.stringify({
      records: [
        {
          fields: {
            Name: row.name,
            // No leading-apostrophe hack here: Airtable stores text as text
            // and never reinterprets +55… as a formula the way Sheets does.
            Phone: row.phone,
            Email: row.email,
            "Birth Date": row.birthDate,
            Code: row.code,
            Locale: row.locale,
            Source: row.source,
            // The action rejects the submission unless consent is checked, so
            // reaching this line means it was.
            Consent: true,
          },
        },
      ],
      // If a single-select option ever goes missing, create it rather than
      // rejecting the write — the lead matters more than the schema.
      typecast: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`create ${res.status}: ${await res.text()}`);
  }
}
