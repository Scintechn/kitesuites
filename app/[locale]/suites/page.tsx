import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  defaultLocale,
  getDictionary,
  hreflangMap,
  isLocale,
  locales,
} from "@/lib/i18n";
import { whatsappLink } from "@/lib/business";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { SuiteCard } from "@/components/SuiteCard";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { MessageCircle } from "@/components/icons";

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
    title: dict.suitesPage.pageTitle,
    description: dict.suitesPage.pageDescription,
    alternates: {
      canonical: `/${locale}/suites`,
      languages: Object.fromEntries(
        locales.map((l) => [hreflangMap[l], `/${l}/suites`]),
      ),
    },
  };
}

export default async function SuitesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dict = getDictionary(locale);
  const t = dict.suitesPage;

  return (
    <>
      <Section variant="brand" className="py-14 sm:py-20">
        <Container>
          <h1 className="text-4xl font-semibold sm:text-5xl">{t.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-100">{t.intro}</p>
        </Container>
      </Section>

      <Section variant="paper">
        <Container>
          <div className="space-y-10">
            {t.items.map((suite, i) => (
              <SuiteCard
                key={suite.slug}
                suite={suite}
                priority={i === 0}
                labels={{
                  book: t.bookCta,
                  details: t.detailsLabel,
                  capacity: t.capacityLabel,
                }}
                bookMessage={
                  locale === "pt"
                    ? `Olá! Gostaria de reservar a ${suite.name} na Kite Suites.`
                    : `Hi! I'd like to book the ${suite.name} at Kite Suites.`
                }
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="paper-warm">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold text-brand-800 sm:text-4xl">
              {dict.finalCta.headline}
            </h2>
            <p className="mt-4 text-lg text-ink-700">
              {dict.finalCta.subheadline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppLink
                href={whatsappLink(
                  locale === "pt"
                    ? "Olá! Gostaria de verificar a disponibilidade na Kite Suites."
                    : "Hi! I'd like to check availability at Kite Suites.",
                )}
                location="final_cta"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-accent-400 px-7 text-base font-semibold text-ink-900 transition-colors hover:bg-accent-300 sm:text-lg"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {dict.finalCta.primaryCta}
              </WhatsAppLink>
              <Button href={`/${locale}/contact`} variant="secondary" size="lg">
                {dict.finalCta.secondaryCta}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
