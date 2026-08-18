"use server";

type Result =
  | { ok: true }
  | { ok: false; error: "validation" | "config" | "delivery" };

const ALLOWED_SUBJECTS = [
  "hospedagem",
  "kitesurf",
  "restaurante",
  "passeios",
  "outro",
] as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendContactMessage(formData: FormData): Promise<Result> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const subjectRaw = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const consent = formData.get("consent") === "on";

  if (
    name.length < 1 ||
    name.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 200 ||
    phone.length > 50 ||
    message.length < 10 ||
    message.length > 5000 ||
    !consent
  ) {
    return { ok: false, error: "validation" };
  }

  const subject = (ALLOWED_SUBJECTS as readonly string[]).includes(subjectRaw)
    ? subjectRaw
    : "outro";

  // Read env at call time, not module load, so a missing var logs clearly
  // instead of blowing up the page render.
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("[contact] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return { ok: false, error: "config" };
  }

  const text =
    `<b>Nova mensagem do site Kite Suites</b>\n\n` +
    `<b>Nome:</b> ${escapeHtml(name)}\n` +
    `<b>E-mail:</b> ${escapeHtml(email)}\n` +
    (phone ? `<b>Telefone:</b> ${escapeHtml(phone)}\n` : "") +
    `<b>Assunto:</b> ${escapeHtml(subject)}\n\n` +
    `<b>Mensagem:</b>\n${escapeHtml(message)}`;

  try {
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
      const body = await res.text();
      console.error("[contact] Telegram API rejected:", res.status, body);
      return { ok: false, error: "delivery" };
    }
  } catch (err) {
    console.error("[contact] Telegram request failed:", err);
    return { ok: false, error: "delivery" };
  }

  return { ok: true };
}
