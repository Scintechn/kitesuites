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
    title: dict.privacy.pageTitle,
    description: dict.privacy.pageDescription,
    alternates: {
      canonical: `/${locale}/privacy-policy`,
      languages: Object.fromEntries(
        locales.map((l) => [hreflangMap[l], `/${l}/privacy-policy`]),
      ),
    },
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const t = getDictionary(raw).privacy;

  return (
    <LegalPage title={t.pageTitle} updated={t.updated} body={t.body} />
  );
}
