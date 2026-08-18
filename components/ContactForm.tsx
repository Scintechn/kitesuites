"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { ArrowRight, CheckCircle2, Loader2 } from "./icons";
import { sendContactMessage } from "@/app/[locale]/contact/actions";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;

export function ContactForm({
  t,
  locale,
}: {
  t: Dictionary["contact"]["form"];
  locale: Locale;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [subject, setSubject] = useState(t.subjectOptions[0].value);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const next: Errors = {};
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const consent = formData.get("consent") === "on";

    if (name.length < 1) next.name = t.errorValidation;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t.errorValidation;
    if (message.length < 10) next.message = t.errorValidation;
    if (!consent) next.consent = t.errorValidation;

    if (Object.keys(next).length > 0) {
      setErrors(next);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("submitting");

    const result = await sendContactMessage(formData);

    if (result.ok) {
      setStatus("success");
      track("contact_form_submit", { subject });
      form.reset();
      setSubject(t.subjectOptions[0].value);
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-900"
      >
        <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden="true" />
        <p className="mt-3 text-lg font-semibold">{t.success}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      data-testid="contact-form"
      className="space-y-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="text-xl font-semibold text-brand-800">{t.title}</h2>

      <Field label={t.name} htmlFor="name" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={200}
          placeholder={t.namePlaceholder}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={inputCls(errors.name)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.email} htmlFor="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            placeholder={t.emailPlaceholder}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputCls(errors.email)}
          />
        </Field>
        <Field label={t.phone} htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={50}
            placeholder={t.phonePlaceholder}
            className={inputCls()}
          />
        </Field>
      </div>

      <Field label={t.subject} htmlFor="subject">
        <select
          id="subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputCls()}
        >
          {t.subjectOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t.message} htmlFor="message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder={t.messagePlaceholder}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(inputCls(errors.message), "min-h-[120px] resize-y leading-relaxed")}
        />
      </Field>

      <label
        htmlFor="consent"
        className={cn(
          "flex items-start gap-3 rounded-2xl border p-4 text-sm",
          errors.consent
            ? "border-red-300 bg-red-50 text-red-900"
            : "border-ink-100 bg-paper-warm text-ink-700",
        )}
      >
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 accent-accent-500"
        />
        <span>
          {t.consent}{" "}
          <Link
            href={`/${locale}/privacy-policy`}
            className="font-semibold underline underline-offset-2 hover:text-brand-700"
          >
            {t.consentLink}
          </Link>
          .
        </span>
      </label>

      {status === "error" ? (
        <p
          role="alert"
          data-testid="form-error"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {Object.keys(errors).length > 0 ? t.errorValidation : t.errorGeneric}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent-400 px-6 text-base font-semibold text-ink-900 transition-all hover:bg-accent-300 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {t.submitting}
          </>
        ) : (
          <>
            {t.submit}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
  children,
}: {
  htmlFor: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-ink-700"
      >
        {label}
      </label>
      {children}
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
