"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n";
import { whatsappLink } from "@/lib/business";
import { cn } from "@/lib/cn";
import { submitLead } from "@/lib/actions/leads";
import { WhatsAppLink } from "./WhatsAppLink";
import { ArrowRight, Check, Copy, Gift, Loader2 } from "./icons";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<"name" | "phone" | "email" | "birthDate" | "consent", string>>;

export type LeadSource = "section" | "modal";

/**
 * Shared by the home-page section and the modal — one form, one server action,
 * distinguished only by `source` so the two surfaces can be compared in
 * analytics.
 */
export function LeadForm({
  t,
  locale,
  source,
  onSuccess,
  compact = false,
}: {
  t: Dictionary["gift"];
  locale: Locale;
  source: LeadSource;
  onSuccess?: () => void;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<"generic" | "age" | null>(null);
  const [code, setCode] = useState("");
  const [returning, setReturning] = useState(false);
  const [stored, setStored] = useState(true);
  const [copied, setCopied] = useState(false);
  const startedAt = useRef(0);

  // Stamped on mount, checked server-side: bots submit far faster than a human
  // can fill five fields.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").replace(/\D/g, "");
    const email = String(data.get("email") ?? "").trim();
    const birthDate = String(data.get("birthDate") ?? "");

    if (name.length < 2) next.name = t.form.errorValidation;
    if (phone.length < 10) next.phone = t.form.errorValidation;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t.form.errorValidation;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) next.birthDate = t.form.errorValidation;
    if (data.get("consent") !== "on") next.consent = t.form.errorValidation;

    if (Object.keys(next).length > 0) {
      setErrors(next);
      setServerError(null);
      setStatus("error");
      return;
    }

    setErrors({});
    setServerError(null);
    setStatus("submitting");

    data.set("source", source);
    data.set("locale", locale);
    data.set("startedAt", String(startedAt.current));

    const result = await submitLead(data);

    if (result.ok) {
      setCode(result.code);
      setReturning(result.returning);
      setStored(result.stored);
      setStatus("success");
      track("lead_submit", { source, returning: result.returning });
      onSuccess?.();
    } else {
      setServerError(result.error === "age" ? "age" : "generic");
      setStatus("error");
    }
  }

  if (status === "success") {
    const message =
      locale === "pt"
        ? `Olá! Cadastrei-me no clube e o meu código é ${code}. Gostaria de reservar.`
        : `Hi! I joined the club, my code is ${code}. I'd like to book.`;

    return (
      <div
        role="status"
        data-testid="lead-success"
        // Not user-facing: lets the driver tell a real sheet write from the
        // Telegram-only fallback, which otherwise look identical on screen.
        data-stored={String(stored)}
        className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 sm:p-8"
      >
        <Gift className="h-8 w-8 text-emerald-600" aria-hidden="true" />
        <p className="mt-3 text-xl font-semibold">{t.success.title}</p>
        <p className="mt-1 text-sm">
          {returning ? t.success.returningBody : t.success.body}
        </p>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            {t.success.codeLabel}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <code
              data-testid="lead-code"
              className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-lg font-bold tracking-widest text-emerald-900"
            >
              {code}
            </code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(code).then(
                  () => setCopied(true),
                  () => setCopied(false),
                );
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-100"
            >
              {copied ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {copied ? t.success.copied : t.success.codeLabel}
            </button>
          </div>
        </div>

        <WhatsAppLink
          href={whatsappLink(message)}
          location="final_cta"
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5a]"
        >
          {t.success.whatsappCta}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </WhatsAppLink>

        <p className="mt-4 text-xs text-emerald-800/80">{t.success.note}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      data-testid="lead-form"
      className={cn(
        "space-y-4 rounded-3xl border border-ink-100 bg-white shadow-sm",
        compact ? "p-5" : "p-6 sm:p-8",
      )}
    >
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`website-${source}`}>Website</label>
        <input id={`website-${source}`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field label={t.form.name} htmlFor={`lead-name-${source}`} error={errors.name}>
        <input
          id={`lead-name-${source}`}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={200}
          placeholder={t.form.namePlaceholder}
          aria-invalid={Boolean(errors.name)}
          className={inputCls(errors.name)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.form.phone} htmlFor={`lead-phone-${source}`} error={errors.phone}>
          <input
            id={`lead-phone-${source}`}
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            maxLength={50}
            placeholder={t.form.phonePlaceholder}
            aria-invalid={Boolean(errors.phone)}
            className={inputCls(errors.phone)}
          />
        </Field>
        <Field label={t.form.email} htmlFor={`lead-email-${source}`} error={errors.email}>
          <input
            id={`lead-email-${source}`}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            placeholder={t.form.emailPlaceholder}
            aria-invalid={Boolean(errors.email)}
            className={inputCls(errors.email)}
          />
        </Field>
      </div>

      <Field
        label={t.form.birthDate}
        htmlFor={`lead-birth-${source}`}
        error={errors.birthDate}
        hint={t.form.birthDateHint}
      >
        <input
          id={`lead-birth-${source}`}
          name="birthDate"
          type="date"
          autoComplete="bday"
          required
          aria-invalid={Boolean(errors.birthDate)}
          className={inputCls(errors.birthDate)}
        />
      </Field>

      <label
        htmlFor={`lead-consent-${source}`}
        className={cn(
          "flex items-start gap-3 rounded-2xl border p-4 text-sm",
          errors.consent
            ? "border-red-300 bg-red-50 text-red-900"
            : "border-ink-100 bg-paper-warm text-ink-700",
        )}
      >
        <input
          id={`lead-consent-${source}`}
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 accent-accent-500"
        />
        <span>
          {t.form.consent}{" "}
          <Link
            href={`/${locale}/privacy-policy`}
            className="font-semibold underline underline-offset-2 hover:text-brand-700"
          >
            {t.form.consentLink}
          </Link>
          .
        </span>
      </label>

      {status === "error" ? (
        <p
          role="alert"
          data-testid="lead-error"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError === "age"
            ? t.form.errorAge
            : serverError === "generic"
              ? t.form.errorGeneric
              : t.form.errorValidation}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent-400 px-6 text-base font-semibold text-ink-900 transition-all hover:bg-accent-300 disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {t.form.submitting}
          </>
        ) : (
          <>
            <Gift className="h-4 w-4" aria-hidden="true" />
            {t.form.submit}
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  htmlFor,
  label,
  error,
  hint,
  children,
}: {
  htmlFor: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputCls(error?: string) {
  return cn(
    "block w-full rounded-xl border bg-white px-4 py-2.5 text-base text-ink-900 placeholder:text-ink-300 transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent",
    error ? "border-red-300" : "border-ink-100",
  );
}
