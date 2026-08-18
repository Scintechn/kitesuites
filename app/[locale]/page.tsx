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
import { addressOneLine, business, whatsappLink } from "@/lib/business";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { WindWidget } from "@/components/WindWidget";
import { ServiceGlyph } from "@/components/Icon";
import {
  ArrowRight,
  Check,
  Instagram,
  MapPin,
  MessageCircle,
  Wind,
} from "@/components/icons";

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
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [hreflangMap[l], `/${l}`])),
    },
  };
}

/** Instagram-style strip of the property, straight from the current site. */
const MOMENTS = [
  "/images/home-1.jpg",
  "/images/home-6.jpg",
  "/images/home-4.jpg",
  "/images/home-5.jpg",
  "/images/home-2.jpg",
  "/images/home-3.jpg",
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dict = getDictionary(locale);
  const t = dict.hero;

  const bookMessage =
    locale === "pt"
      ? "Olá! Gostaria de reservar uma acomodação na Kite Suites."
      : "Hi! I'd like to book a room at Kite Suites.";

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-brand-900">
        <Image
          src="/images/room-1.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-brand-900/85 via-brand-900/60 to-brand-900/90"
          aria-hidden="true"
        />

        <Container className="relative py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-300">
              {t.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
              {t.headline}
            </h1>
            <p className="mt-3 text-xl text-brand-100 sm:text-2xl">
              {t.subheadline}
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-100/90 sm:text-lg">
              {t.body}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={`/${locale}/suites`} size="lg">
                {t.primaryCta}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
              <WhatsAppLink
                href={whatsappLink(bookMessage)}
                location="hero"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 text-base font-semibold text-white transition-colors hover:bg-white/15 sm:text-lg"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {t.secondaryCta}
              </WhatsAppLink>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-brand-100">
              {t.badges.map((badge) => (
                <li key={badge} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-accent-300" aria-hidden="true" />
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Highlights */}
      <Section variant="paper">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold text-brand-800 sm:text-4xl">
                {dict.highlights.title}
              </h2>
              <p className="mt-4 text-lg text-ink-700">{dict.highlights.intro}</p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dict.highlights.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-ink-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <ServiceGlyph name={item.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-brand-800">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-800"
            >
              {dict.servicesPage.title}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </Section>

      {/* Wind forecast — the first thing a kiter checks */}
      <Section variant="brand-deep" id="vento">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-start lg:gap-12">
            <div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-accent-300">
                <Wind className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">
                {dict.wind.title}
              </h2>
              <p className="mt-4 text-lg text-brand-100">{dict.wind.intro}</p>
              <p className="mt-4 text-sm text-brand-200">{dict.wind.note}</p>
              <a
                href="https://www.windguru.cz/7063"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-300 hover:text-accent-200"
              >
                {dict.wind.spotCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <WindWidget locale={locale} fallback={dict.wind.fallback} />
          </div>
        </Container>
      </Section>

      {/* Rooms teaser */}
      <Section variant="paper-warm">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold text-brand-800 sm:text-4xl">
                {dict.suitesTeaser.title}
              </h2>
              <p className="mt-4 text-lg text-ink-700">{dict.suitesTeaser.intro}</p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {dict.suitesPage.items.map((suite, i) => (
              <Reveal key={suite.slug} delay={i * 80}>
                <Link
                  href={`/${locale}/suites#${suite.slug}`}
                  className="group block h-full overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={suite.image}
                      alt={suite.imageAlt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-brand-800">
                      {suite.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-700">
                      {suite.description}
                    </p>
                    <p className="mt-4 text-sm font-medium text-ink-500">
                      {suite.capacity}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-10">
            <Button href={`/${locale}/suites`} variant="secondary">
              {dict.suitesTeaser.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </Container>
      </Section>

      {/* Moments strip */}
      <section className="bg-brand-900 py-14 sm:py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              {business.brandName}
            </h2>
            <a
              href={business.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent-300 hover:text-accent-200"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
              @kite_suites
            </a>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {MOMENTS.map((src) => (
              <li key={src} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src={src}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Location */}
      <Section variant="paper">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div>
                <h2 className="text-3xl font-semibold text-brand-800 sm:text-4xl">
                  {dict.location.title}
                </h2>
                <p className="mt-4 text-lg text-ink-700">{dict.location.intro}</p>

                <dl className="mt-8 space-y-5">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-300">
                      {dict.location.addressLabel}
                    </dt>
                    <dd className="mt-1.5 flex items-start gap-2 text-ink-900">
                      <MapPin
                        className="mt-1 h-4 w-4 shrink-0 text-brand-500"
                        aria-hidden="true"
                      />
                      {addressOneLine()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-300">
                      {dict.location.hoursLabel}
                    </dt>
                    <dd className="mt-1.5 text-ink-900">
                      {dict.contact.hoursValue}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8">
                  <Button
                    href={business.mapDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                  >
                    {dict.location.directionsCta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="overflow-hidden rounded-3xl border border-ink-100 shadow-sm">
                <iframe
                  src={business.mapEmbedSrc}
                  title={dict.location.mapTitle}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[360px] w-full border-0"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section variant="brand">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              {dict.finalCta.headline}
            </h2>
            <p className="mt-4 text-lg text-brand-100">
              {dict.finalCta.subheadline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppLink
                href={whatsappLink(bookMessage)}
                location="final_cta"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-accent-400 px-7 text-base font-semibold text-ink-900 transition-colors hover:bg-accent-300 sm:text-lg"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {dict.finalCta.primaryCta}
              </WhatsAppLink>
              <Button
                href={`/${locale}/contact`}
                variant="outline-light"
                size="lg"
              >
                {dict.finalCta.secondaryCta}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
