import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  defaultLocale,
  getDictionary,
  hreflangMap,
  isLocale,
  locales,
} from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

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
    title: dict.restaurantPage.pageTitle,
    description: dict.restaurantPage.pageDescription,
    alternates: {
      canonical: `/${locale}/restaurant`,
      languages: Object.fromEntries(
        locales.map((l) => [hreflangMap[l], `/${l}/restaurant`]),
      ),
    },
  };
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const t = getDictionary(locale).restaurantPage;

  return (
    <>
      <Section variant="brand" className="py-14 sm:py-20">
        <Container>
          <h1 className="text-4xl font-semibold sm:text-5xl">{t.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-100">{t.intro}</p>
          <p className="mt-2 text-sm text-brand-200">{t.currencyNote}</p>
        </Container>
      </Section>

      <Section variant="paper">
        <Container>
          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-2">
            {t.sections.map((section, i) => (
              <Reveal key={section.title} delay={(i % 2) * 60}>
                <section className="break-inside-avoid">
                  <h2 className="border-b border-ink-100 pb-3 text-xl font-semibold text-brand-800 sm:text-2xl">
                    {section.title}
                  </h2>

                  {section.note ? (
                    <p className="mt-3 rounded-2xl bg-paper-warm px-4 py-3 text-sm text-ink-700">
                      {section.note}
                    </p>
                  ) : null}

                  <ul className="mt-4 space-y-4">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <div className="flex items-baseline gap-3">
                          <h3 className="text-base font-semibold text-ink-900">
                            {item.name}
                          </h3>
                          <span
                            className="h-px flex-1 border-b border-dotted border-ink-300/60"
                            aria-hidden="true"
                          />
                          {item.price ? (
                            <span className="shrink-0 text-base font-semibold tabular-nums text-brand-600">
                              R$ {item.price}
                            </span>
                          ) : null}
                        </div>
                        {item.description ? (
                          <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-500">
                            {item.description}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
