import type { Metadata } from "next";
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
import { ContactForm } from "@/components/ContactForm";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { PhoneLink } from "@/components/PhoneLink";
import { Clock, Instagram, MapPin, MessageCircle, Phone } from "@/components/icons";

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
    title: dict.contact.pageTitle,
    description: dict.contact.pageDescription,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: Object.fromEntries(
        locales.map((l) => [hreflangMap[l], `/${l}/contact`]),
      ),
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dict = getDictionary(locale);
  const t = dict.contact;

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
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <h2 className="text-2xl font-semibold text-brand-800">
                {t.directTitle}
              </h2>

              <ul className="mt-7 space-y-6">
                <li>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-300">
                    {t.whatsappLabel}
                  </p>
                  <WhatsAppLink
                    href={whatsappLink()}
                    location="contact_direct"
                    className="mt-1.5 inline-flex items-center gap-2 text-lg font-semibold text-brand-700 hover:text-brand-900"
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                    {business.whatsapp.display}
                  </WhatsAppLink>
                </li>

                <li>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-300">
                    {t.phoneLabel}
                  </p>
                  <PhoneLink
                    href={business.phone.mobile.href}
                    location="contact_direct"
                    className="mt-1.5 inline-flex items-center gap-2 text-lg font-semibold text-brand-700 hover:text-brand-900"
                  >
                    <Phone className="h-5 w-5" aria-hidden="true" />
                    {business.phone.mobile.display}
                  </PhoneLink>
                </li>

                <li>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-300">
                    {t.hoursLabel}
                  </p>
                  <p className="mt-1.5 inline-flex items-center gap-2 text-ink-900">
                    <Clock className="h-5 w-5 text-brand-500" aria-hidden="true" />
                    {t.hoursValue}
                  </p>
                </li>

                <li>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-300">
                    {t.addressLabel}
                  </p>
                  <p className="mt-1.5 flex items-start gap-2 text-ink-900">
                    <MapPin
                      className="mt-1 h-5 w-5 shrink-0 text-brand-500"
                      aria-hidden="true"
                    />
                    {addressOneLine()}
                  </p>
                </li>

                <li>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-300">
                    {t.instagramLabel}
                  </p>
                  <a
                    href={business.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-2 text-ink-900 hover:text-brand-700"
                  >
                    <Instagram className="h-5 w-5 text-brand-500" aria-hidden="true" />
                    @kite_suites
                  </a>
                </li>
              </ul>

              <div className="mt-8 overflow-hidden rounded-3xl border border-ink-100 shadow-sm">
                <iframe
                  src={business.mapEmbedSrc}
                  title={dict.location.mapTitle}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[280px] w-full border-0"
                />
              </div>
            </div>

            <ContactForm t={t.form} locale={locale} />
          </div>
        </Container>
      </Section>
    </>
  );
}
