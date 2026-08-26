import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n";
import { addressOneLine, business, whatsappLink } from "@/lib/business";
import { LogoBadge } from "./Logo";
import { WhatsAppLink } from "./WhatsAppLink";
import { PhoneLink } from "./PhoneLink";
import { Instagram, MapPin, MessageCircle, Phone } from "./icons";

export function Footer({
  locale,
  t,
  nav,
}: {
  locale: Locale;
  t: Dictionary["footer"];
  nav: Dictionary["nav"];
}) {
  const year = new Date().getFullYear();

  const navItems = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}/suites`, label: nav.suites },
    { href: `/${locale}/services`, label: nav.services },
    { href: `/${locale}/restaurant`, label: nav.restaurant },
    { href: `/${locale}/contact`, label: nav.contact },
  ];

  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <LogoBadge className="h-20 w-20" />
          <p className="mt-5 max-w-xs text-sm text-brand-200">
            <MapPin className="mr-1.5 inline h-4 w-4 align-[-2px]" aria-hidden="true" />
            {addressOneLine()}
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
            {t.navTitle}
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
            {t.contactTitle}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <WhatsAppLink
                href={whatsappLink()}
                location="footer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {business.whatsapp.display}
              </WhatsAppLink>
            </li>
            <li>
              <PhoneLink
                href={business.phone.mobile.href}
                location="footer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {business.phone.mobile.display}
              </PhoneLink>
            </li>
            <li>
              <a
                href={business.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
                @kite_suites
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-brand-200 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p>
              © {year} {business.legalName}. {t.rights}
            </p>
            <p className="mt-1.5">
              {t.developedBy}{" "}
              <a
                href={business.developer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-100 hover:text-white"
              >
                {business.developer.name}
              </a>{" "}
              — {business.developer.legalName}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={`/${locale}/privacy-policy`} className="hover:text-white">
              {t.privacy}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-white">
              {t.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
