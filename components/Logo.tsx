import Image from "next/image";
import { business } from "@/lib/business";
import { cn } from "@/lib/cn";

/**
 * The real brand mark, exported from the current site.
 * `dark`  — stacked wordmark on transparent, for light headers.
 * `light` — the round badge on teal, for dark surfaces.
 */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const src = tone === "dark" ? "/images/logo-dark.png" : "/images/logo-light.png";

  return (
    <Image
      src={src}
      alt={business.brandName}
      width={250}
      height={250}
      priority
      className={cn("h-11 w-auto sm:h-12", className)}
    />
  );
}
