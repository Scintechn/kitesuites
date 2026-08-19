import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Inter, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";

import {
  defaultLocale,
  getDictionary,
  hreflangMap,
  isLocale,
  locales,
} from "@/lib/i18n";
import { addressOneLine, business } from "@/lib/business";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-runtime",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-runtime",
  weight: ["500", "600", "700"],
  display: "swap",
});

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
    metadataBase: new URL(business.siteUrl),
    title: {
      default: dict.meta.siteTitle,
      template: `%s · ${business.brandName}`,
    },
    description: dict.meta.siteDescription,
    applicationName: business.brandName,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [hreflangMap[l], `/${l}`])),
    },
    openGraph: {
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      url: `/${locale}`,
      siteName: business.brandName,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dict = getDictionary(locale);

  const bookMessage =
    locale === "pt"
      ? "Olá! Gostaria de informações sobre a hospedagem na Kite Suites."
      : "Hi! I'd like information about staying at Kite Suites.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Resort",
    name: business.brandName,
    url: business.siteUrl,
    telephone: business.phone.mobile.href.replace("tel:", ""),
    image: `${business.siteUrl}/images/room-1.jpg`,
    priceRange: "$$",
    description: dict.meta.siteDescription,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${business.address.street} - ${business.address.district}`,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: "BR",
    },
    hasMap: business.mapDirectionsUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: business.hours.everyDay.opens,
        closes: business.hours.everyDay.closes,
      },
    ],
    sameAs: [business.social.instagram],
    amenityFeature: [
      "Piscina",
      "Café da manhã",
      "WiFi",
      "Ar-condicionado",
      "Restaurante",
      "Serviço de praia",
    ].map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    availableLanguage: ["Portuguese", "English"],
  };

  const restaurantLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `${business.brandName} Restaurante`,
    servesCuisine: ["Brasileira", "Café da manhã", "Frutos do mar"],
    url: `${business.siteUrl}/${locale}/restaurant`,
    hasMenu: `${business.siteUrl}/${locale}/restaurant`,
    priceRange: "$$",
    telephone: business.phone.mobile.href.replace("tel:", ""),
    address: addressOneLine(),
  };

  return (
    <html
      lang={locale === "pt" ? "pt-BR" : "en"}
      className={`${fontSans.variable} ${fontDisplay.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink-900 antialiased">
        <TopBar hours={dict.contact.hoursValue} />
        <Header
          locale={locale}
          t={dict.nav}
          switcherLabels={{
            pt: dict.localeSwitcher.pt,
            en: dict.localeSwitcher.en,
            label: dict.localeSwitcher.label,
          }}
          bookMessage={bookMessage}
        />
        <main id="main">{children}</main>
        <Footer locale={locale} t={dict.footer} nav={dict.nav} />
        <WhatsAppFab message={bookMessage} label={dict.nav.whatsappCta} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
