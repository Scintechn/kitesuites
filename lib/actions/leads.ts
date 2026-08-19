"use server";

import {
  appendLead,
  findExistingCode,
  giftCode,
  sheetsConfigured,
} from "@/lib/sheets";

export type LeadResult =
  | { ok: true; code: string; returning: boolean; stored: boolean }
  | { ok: false; error: "validation" | "age" | "config" | "delivery" };

const SOURCES = ["section", "modal"] as const;
const MIN_AGE = 18;
const MAX_AGE = 120;
/** Bots post instantly; a human cannot fill five fields this fast. */
const MIN_FILL_MS = 2500;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Whole years between a birth date and today. */
function ageOn(birth: Date, today = new Date()): number {
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

async function notifyTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("[leads] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("[leads] Telegram rejected:", res.status, await res.text());
  }
}

export async function submitLead(formData: FormData): Promise<LeadResult> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const birthDate = String(formData.get("birthDate") ?? "").trim();
  const consent = formData.get("consent") === "on";
  const sourceRaw = String(formData.get("source") ?? "");
  const localeRaw = String(formData.get("locale") ?? "pt");

  // Honeypot: a real browser leaves this hidden field empty.
  if (String(formData.get("website") ?? "") !== "") {
    console.warn("[leads] honeypot tripped");
    return { ok: false, error: "validation" };
  }

  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS) {
    console.warn("[leads] submitted too fast, rejecting as bot");
    return { ok: false, error: "validation" };
  }

  const digits = phone.replace(/\D/g, "");
  if (
    name.length < 2 ||
    name.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 200 ||
    digits.length < 10 ||
    digits.length > 15 ||
    !consent
  ) {
    return { ok: false, error: "validation" };
  }

  // Birth date is authoritative here, not in the browser: the age gate is a
  // LGPD requirement, not a UX nicety.
  const birth = new Date(`${birthDate}T00:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || Number.isNaN(birth.getTime())) {
    return { ok: false, error: "validation" };
  }
  const age = ageOn(birth);
  if (birth > new Date() || age < MIN_AGE || age > MAX_AGE) {
    return { ok: false, error: "age" };
  }

  const source = (SOURCES as readonly string[]).includes(sourceRaw)
    ? sourceRaw
    : "section";
  const locale = localeRaw === "en" ? "en" : "pt";

  if (!sheetsConfigured()) {
    console.error(
      "[leads] Missing GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY / LEADS_SHEET_ID",
    );
    return { ok: false, error: "config" };
  }

  // A returning visitor gets their original code back — no duplicate row, no
  // error, and the same gift they were promised the first time.
  let returning = false;
  let code = giftCode();
  let stored = true;

  try {
    const existing = await findExistingCode(email);
    if (existing) {
      code = existing;
      returning = true;
    } else {
      await appendLead({ name, phone, email, birthDate, code, locale, source });
    }
  } catch (err) {
    // The spreadsheet is not allowed to cost us the lead. Keep the promise to
    // the visitor, shout in the logs, and flag the alert for manual entry.
    stored = false;
    console.error(
      "[leads] Sheets write failed, falling back to Telegram:",
      err instanceof Error ? err.message : err,
    );
  }

  if (!returning) {
    await notifyTelegram(
      `<b>${stored ? "Novo lead" : "⚠️ Novo lead — NÃO gravado na planilha"}</b>\n\n` +
        `<b>Nome:</b> ${escapeHtml(name)}\n` +
        `<b>Telefone:</b> ${escapeHtml(phone)}\n` +
        `<b>E-mail:</b> ${escapeHtml(email)}\n` +
        `<b>Nascimento:</b> ${escapeHtml(birthDate)}\n` +
        `<b>Código:</b> ${escapeHtml(code)}\n` +
        `<b>Origem:</b> ${escapeHtml(source)} · ${escapeHtml(locale)}` +
        (stored ? "" : "\n\n<i>Grave este lead manualmente na planilha.</i>"),
    );
  }

  return { ok: true, code, returning, stored };
}
