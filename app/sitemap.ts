import type { MetadataRoute } from "next";
import { business } from "@/lib/business";
import { hreflangMap, locales } from "@/lib/i18n";

const ROUTES = [
  "",
  "/suites",
  "/services",
  "/restaurant",
  "/contact",
  "/privacy-policy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ROUTES.flatMap((route) =>
    locales.map((locale) => ({
      url: `${business.siteUrl}/${locale}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [
            hreflangMap[l],
            `${business.siteUrl}/${l}${route}`,
          ]),
        ),
      },
    })),
  );
}
