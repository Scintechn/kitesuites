import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  defaultLocale,
  getDictionary,
  hreflangMap,
  isLocale,
  locales,
} from "@/lib/i18n";
import { LegalPage } from "@/components/LegalPage";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);

  return {
    title: dict.terms.pageTitle,
    description: dict.terms.pageDescription,
    alternates: {
      canonical: `/${locale}/terms`,
      languages: Object.fromEntries(
        locales.map((l) => [hreflangMap[l], `/${l}/terms`]),
      ),
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const t = getDictionary(raw).terms;

  return <LegalPage title={t.pageTitle} updated={t.updated} body={t.body} />;
}
