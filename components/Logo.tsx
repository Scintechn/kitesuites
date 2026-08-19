import Image from "next/image";
import { business } from "@/lib/business";
import { cn } from "@/lib/cn";

type Tone = "dark" | "light";

/**
 * The official brand lockup, used exactly as supplied — no re-drawing, no
 * re-arranging of the stacked kite / KITE / SUITES / PRAIA SECA · RJ.
 *
 * Because the artwork is a *square stacked* lockup, its wordmark is only ever
 * about a third of the rendered height. The header therefore has to be tall
 * enough for it to read: `Header.tsx` runs h-20 / sm:h-24 so this can sit at
 * h-16 / sm:h-20. Shrinking the header shrinks the brand — keep them in step.
 *
 * The source PNG is 250×250, so h-20 (80 CSS px) still has enough pixels for
 * a 2× display. Don't render it larger than ~h-28 or it will soften.
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
        isDark ? "h-16 w-auto sm:h-20" : "h-20 w-20 rounded-full",
        className,
      )}
    />
  );
}

/** The round badge, for dark surfaces. */
export function LogoBadge({ className }: { className?: string }) {
  return <Logo tone="light" className={className} />;
}
