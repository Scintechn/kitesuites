"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function LocaleSwitcher({
  current,
  labels,
  ariaLabel,
  tone = "dark",
}: {
  current: Locale;
  labels: Record<Locale, string>;
  ariaLabel: string;
  tone?: "dark" | "light";
}) {
  const pathname = usePathname() ?? `/${current}`;

  const swapLocale = (target: Locale) => {
    const parts = pathname.split("/");
    if (parts[1] && (locales as readonly string[]).includes(parts[1])) {
      parts[1] = target;
    } else {
      parts.splice(1, 0, target);
    }
    return parts.join("/") || `/${target}`;
  };

  const idleTone =
    tone === "dark"
      ? "text-ink-500 hover:text-brand-700"
      : "text-brand-100 hover:text-white";
  const activeTone =
    tone === "dark" ? "bg-brand-600 text-white" : "bg-white text-brand-800";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center rounded-full border p-1 text-xs font-semibold",
        tone === "dark"
          ? "border-ink-100 bg-white/70 backdrop-blur"
          : "border-white/25 bg-white/10",
      )}
    >
      {locales.map((l) => {
        const isActive = l === current;
        return (
          <Link
            key={l}
            href={swapLocale(l)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1 transition-colors",
              isActive ? activeTone : idleTone,
            )}
          >
            {labels[l]}
          </Link>
        );
      })}
    </div>
  );
}
