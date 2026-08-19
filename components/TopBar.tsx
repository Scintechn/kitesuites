import { business } from "@/lib/business";
import { PhoneLink } from "./PhoneLink";
import { Clock, Instagram, Phone } from "./icons";

/**
 * Thin utility strip above the header: click-to-call, opening hours, social.
 *
 * Deliberately *not* sticky. It sits above the sticky header in normal flow,
 * so it is there on arrival and scrolls away once you start reading, leaving
 * only the compact header pinned. Making it sticky too would cost ~40px of
 * viewport on every screen for the whole session.
 */
export function TopBar({ hours }: { hours: string }) {
  return (
    <div className="bg-brand-900 text-brand-100">
      <div className="mx-auto flex h-10 w-full max-w-6xl items-center justify-between gap-4 px-5 text-xs sm:px-8 sm:text-sm">
        <PhoneLink
          href={business.phone.mobile.href}
          location="header"
          className="inline-flex items-center gap-2 font-medium transition-colors hover:text-white"
        >
          <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {business.phone.mobile.display}
        </PhoneLink>

        <span className="hidden items-center gap-2 md:inline-flex">
          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {hours}
        </span>

        <a
          href={business.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 transition-colors hover:text-white"
        >
          <Instagram className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">@kite_suites</span>
          <span className="sr-only sm:hidden">Instagram</span>
        </a>
      </div>
    </div>
  );
}
