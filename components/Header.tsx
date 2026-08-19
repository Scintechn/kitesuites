"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n";
import { business, whatsappLink } from "@/lib/business";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { WhatsAppLink } from "./WhatsAppLink";
import { Menu, MessageCircle, X } from "./icons";

export function Header({
  locale,
  t,
  switcherLabels,
  bookMessage,
}: {
  locale: Locale;
  t: Dictionary["nav"];
  switcherLabels: Record<Locale, string> & { label: string };
  bookMessage: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Two different thresholds on purpose. The bar picks up its border and
      // blur almost immediately, but the medallion must not: at 12px a single
      // trackpad nudge retracted it, so the overhang was effectively never
      // seen. It now holds until you have genuinely started reading.
      setScrolled(y > 12);
      setCompact(y > 140);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const items = [
    { href: `/${locale}`, label: t.home },
    { href: `/${locale}/suites`, label: t.suites },
    { href: `/${locale}/services`, label: t.services },
    { href: `/${locale}/restaurant`, label: t.restaurant },
    { href: `/${locale}/contact`, label: t.contact },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full transition-all duration-200",
        scrolled ? "border-b border-ink-100 bg-paper/95 backdrop-blur" : "bg-paper",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-white"
      >
        {t.skipToContent}
      </a>

      {/* Height is tied to the brand lockup — see the note in Logo.tsx. */}
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:h-24 sm:px-8">
        {/*
          Brand medallion — sm and up only. The circle is taller than the
          header bar and the negative bottom margin pulls its layout box up,
          so roughly a third of it hangs *below* the header onto the page,
          giving the square stacked lockup room the bar itself doesn't have.
          On mobile there is no circle at all: just the mark in the bar.

          It retracts into the bar once the page scrolls: at full size it sits
          permanently over the top-left of the content, which is fine against
          the hero but covers body copy further down. Shrinking on scroll
          keeps the effect at rest and gets it out of the way in use.

          z-50 (not the default) so it still paints over the open mobile menu
          panel, which is z-40 inside this same stacking context. Nothing in
          the header's ancestry may set `overflow-hidden` or the overhang gets
          clipped away.
        */}
        <Link
          href={`/${locale}`}
          aria-label={business.brandName}
          className={cn(
            "relative z-50 flex shrink-0 items-center justify-center rounded-md transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400",
            // No medallion on mobile — just the mark in the bar. A disc needs
            // horizontal room to look deliberate; at 390px it was a quarter of
            // the screen and crowded the viewport's top edge either way.
            // The circle, and its overhang, begin at sm.
            "sm:rounded-full sm:bg-paper sm:ring-1 sm:ring-ink-100",
            // Overhangs at rest, then pulls back into the bar once you are
            // reading (see the `compact` threshold above) — at full size it
            // sits over the left edge of the content column and body copy
            // would slide under it.
            compact
              ? "sm:h-20 sm:w-20 sm:shadow-sm"
              : "sm:-mb-12 sm:h-32 sm:w-32 sm:shadow-lg sm:hover:shadow-xl",
          )}
        >
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-brand-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher
            current={locale}
            labels={{ pt: switcherLabels.pt, en: switcherLabels.en }}
            ariaLabel={switcherLabels.label}
          />
          <WhatsAppLink
            href={whatsappLink(bookMessage)}
            location="header"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-accent-400 px-5 text-sm font-semibold text-ink-900 shadow-sm transition-colors hover:bg-accent-300"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {t.bookCta}
          </WhatsAppLink>
        </div>

        {/*
          The booking CTA is the highest-intent action on the page, so it sits
          in the bar itself below lg rather than inside the hamburger. Same
          button and same WhatsApp target as the desktop one — only the label
          shortens on the narrowest screens.
        */}
        <div className="flex items-center gap-2 lg:hidden">
          <WhatsAppLink
            href={whatsappLink(bookMessage)}
            location="header"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-accent-400 px-4 text-sm font-semibold text-ink-900 shadow-sm transition-colors hover:bg-accent-300"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden xs:inline">{t.bookCta}</span>
            <span className="xs:hidden">{t.bookShort}</span>
          </WhatsAppLink>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink-100 bg-white text-ink-700 transition-colors hover:bg-ink-100"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          // `absolute top-full`, not `fixed` with a hard-coded offset: the
          // header sits below the (non-sticky) TopBar until the page scrolls,
          // so any fixed offset would be wrong in one state or the other.
          className="absolute inset-x-0 top-full z-40 border-t border-ink-100 bg-paper pb-8 shadow-lg lg:hidden"
        >
          <nav
            aria-label="Mobile"
            className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 pt-4 sm:px-8"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-base font-medium text-ink-900 hover:bg-ink-100"
              >
                {item.label}
              </Link>
            ))}
            {/*
              No booking CTA in here any more — it lives in the bar itself and
              is visible without opening the menu, so repeating it was just
              noise.
            */}
            <div className="mt-4 border-t border-ink-100 pt-5">
              <LocaleSwitcher
                current={locale}
                labels={{ pt: switcherLabels.pt, en: switcherLabels.en }}
                ariaLabel={switcherLabels.label}
              />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
