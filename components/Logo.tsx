import Image from "next/image";
import { business } from "@/lib/business";
import { cn } from "@/lib/cn";

type Tone = "dark" | "light";

/**
 * The official brand lockup, used exactly as supplied — no re-drawing, no
 * re-arranging of the stacked kite / KITE / SUITES / PRAIA SECA · RJ.
 *
 * Because the artwork is a *square stacked* lockup, its wordmark is only ever
 * about a third of the rendered height, so it needs real size to read. The
 * header solves that with a circular medallion that overhangs the header's
 * bottom edge (see `Header.tsx`), giving the mark far more room than the
 * header bar itself has. Logo size and medallion size move together.
 *
 * The source PNG is 250×250, so h-24 (96 CSS px) is the practical ceiling:
 * that needs 192px on a 2× display. Larger and it will visibly soften.
 *
 * `dark`  — the teal-on-transparent stack, for light backgrounds.
 * `light` — the round badge on teal, for dark backgrounds (footer).
 */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: Tone;
  className?: string;
}) {
  const isDark = tone === "dark";

  return (
    <Image
      src={isDark ? "/images/logo-dark.png" : "/images/logo-light.png"}
      alt={business.brandName}
      width={250}
      height={250}
      priority
      className={cn(
        // The dark lockup is sized as a share of its container so the header
        // medallion can grow and shrink and the mark follows. That means its
        // parent must have a definite height — it always does (the medallion
        // is a fixed-size circle).
        // Mobile has no medallion, so the mark takes a plain fixed height.
        // From sm up it sits in the circle and is sized as a share of it, so
        // it follows the medallion as that grows and shrinks on scroll. 80%,
        // not less: the artwork carries its own generous clear space, and a
        // smaller share leaves it marooned in the middle of the disc.
        isDark ? "h-16 w-auto sm:h-[80%]" : "h-20 w-20 rounded-full",
        className,
      )}
    />
  );
}

/** The round badge, for dark surfaces. */
export function LogoBadge({ className }: { className?: string }) {
  return <Logo tone="light" className={className} />;
}
