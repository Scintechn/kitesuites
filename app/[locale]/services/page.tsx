import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ServiceGlyph } from "@/components/Icon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { ArrowRight } from "@/components/icons";

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
    title: dict.servicesPage.pageTitle,
    description: dict.servicesPage.pageDescription,
    alternates: {
      canonical: `/${locale}/services`,
      languages: Object.fromEntries(
        locales.map((l) => [hreflangMap[l], `/${l}/services`]),
      ),
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dict = getDictionary(locale);
  const t = dict.servicesPage;

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
          <div className="space-y-12 sm:space-y-16">
            {t.items.map((service, i) => (
              <Reveal key={service.slug}>
                <article
                  id={service.slug}
                  className="grid scroll-mt-24 items-center gap-8 lg:grid-cols-2 lg:gap-14"
                >
                  <div
                    className={
                      i % 2 === 1 ? "lg:order-2" : undefined
                    }
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-sm">
                      <Image
                        src={service.image}
                        alt={service.imageAlt}
                        fill
                        priority={i === 0}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                      <ServiceGlyph name={service.icon} className="h-6 w-6" />
                    </span>
                    <h2 className="mt-5 text-2xl font-semibold text-brand-800 sm:text-3xl">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-ink-700">
                      {service.description}
                    </p>

                    {service.cta ? (
                      <div className="mt-7">
                        {service.whatsappMessage ? (
                          <WhatsAppLink
                            href={whatsappLink(service.whatsappMessage)}
                            location="service_card"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent-400 px-6 text-sm font-semibold text-ink-900 transition-colors hover:bg-accent-300"
                          >
                            {service.cta}
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </WhatsAppLink>
                        ) : (
                          <Link
                            href={`/${locale}/restaurant`}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-800 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                          >
                            {service.cta}
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    ) : null}
                  </div>
                </article>
              </Reveal>
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
            <div className="mt-8">
              <Button href={`/${locale}/contact`} size="lg">
                {dict.finalCta.secondaryCta}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
