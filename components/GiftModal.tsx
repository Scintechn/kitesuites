"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n";
import { LeadForm } from "./LeadForm";
import { Gift, X } from "./icons";

/**
 * The gift offer as a one-time nudge.
 *
 * Rules that keep this from being the thing everyone hates:
 *  - never on load; only after the visitor has actually read (60% depth)
 *  - never on /contact or the legal pages — they are already converting, or
 *    reading something they came for
 *  - once per visitor, ever. Dismissing or converting writes localStorage and
 *    the modal never returns
 *  - dismissing does not remove the offer; the home-page section stays put
 *  - never on a page where the visitor has already reached the inline
 *    offer. Otherwise scrolling to the gift section trips the depth
 *    trigger and the modal lands on top of the form being filled in —
 *    interrupting exactly the people who were already converting.
 *
 * Uses a native <dialog>, which brings focus trapping, Esc-to-close and an
 * inert background for free — no portal or focus-trap dependency.
 */

const STORAGE_KEY = "ks_gift_v1";
const SUPPRESSED = /\/(contact|privacy-policy|terms)\/?$/;
const DEPTH = 0.6;
/** The inline offer. Its presence on screen pre-empts the modal. */
const SECTION_ID = "presente";
/** Guard against short pages, where depth is already >= DEPTH at rest. */
const MIN_SCROLL_PX = 300;

export function GiftModal({
  t,
  locale,
}: {
  t: Dictionary["gift"];
  locale: Locale;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname() ?? "";
  const [armed, setArmed] = useState(false);

  const remember = useCallback((value: "dismissed" | "converted") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* private mode — the modal simply may reappear next visit */
    }
  }, []);

  useEffect(() => {
    if (SUPPRESSED.test(pathname)) return;

    let seen: string | null = null;
    try {
      seen = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (seen) return;

    const section = document.getElementById(SECTION_ID);

    /**
     * Has the visitor reached the inline offer? Checked synchronously on every
     * scroll rather than with an IntersectionObserver: IO callbacks are
     * delivered on a later frame, so a fast programmatic jump to the section
     * fires the depth trigger first and the modal still lands on top of the
     * form. A rect read cannot lose that race.
     */
    const reachedSection = () => {
      if (!section) return false;
      return section.getBoundingClientRect().top < window.innerHeight * 0.9;
    };

    const onScroll = () => {
      if (reachedSection()) {
        window.removeEventListener("scroll", onScroll);
        return;
      }
      const doc = document.documentElement;
      const depth = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (window.scrollY > MIN_SCROLL_PX && depth >= DEPTH) {
        window.removeEventListener("scroll", onScroll);
        setArmed(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    const dialog = ref.current;
    if (!armed || !dialog || dialog.open) return;
    dialog.showModal();
    track("gift_modal_shown");
  }, [armed]);

  const close = useCallback(
    (reason: "dismissed" | "converted") => {
      remember(reason);
      if (reason === "dismissed") track("gift_modal_dismissed");
      ref.current?.close();
    },
    [remember],
  );

  if (SUPPRESSED.test(pathname)) return null;

  return (
    <dialog
      ref={ref}
      data-testid="gift-modal"
      // `cancel` fires on Esc — treat it exactly like pressing "not now".
      onCancel={(e) => {
        e.preventDefault();
        close("dismissed");
      }}
      // A click landing on the dialog itself is a backdrop click; anything
      // inside the panel stops at the panel.
      onClick={(e) => {
        if (e.target === ref.current) close("dismissed");
      }}
      className="m-auto max-h-[88svh] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-3xl border border-ink-100 bg-paper p-0 text-ink-900 shadow-2xl backdrop:bg-brand-900/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-5 sm:p-7">
        <button
          type="button"
          onClick={() => close("dismissed")}
          aria-label={t.modal.close}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-100 text-accent-600">
          <Gift className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 pr-10 text-2xl font-semibold text-brand-800">
          {t.modal.title}
        </h2>
        <p className="mt-2 text-sm text-ink-700">{t.subtitle}</p>

        <div className="mt-5">
          <LeadForm
            t={t}
            locale={locale}
            source="modal"
            compact
            onSuccess={() => remember("converted")}
          />
        </div>

        <button
          type="button"
          onClick={() => close("dismissed")}
          data-testid="gift-dismiss"
          className="mt-4 w-full rounded-full px-4 py-2 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
        >
          {t.modal.dismiss}
        </button>
      </div>
    </dialog>
  );
}
