import { ImageResponse } from "next/og";
import { defaultLocale, getDictionary, isLocale, locales } from "@/lib/i18n";
import { business } from "@/lib/business";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${business.brandName} — ${business.tagline}`;

export function generateImageMetadata() {
  return locales.map((locale) => ({ id: locale }));
}

export default async function OG({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "linear-gradient(135deg, #162c29 0%, #244a44 55%, #2b5a52 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              background: "#f2842b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#162c29",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            K
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 6 }}>
              KITE SUITES
            </div>
            <div style={{ fontSize: 16, letterSpacing: 5, color: "#85b3a9" }}>
              {business.tagline.toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#f9a459" }}>
            {dict.hero.eyebrow.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            {dict.hero.headline}
          </div>
          <div style={{ fontSize: 30, color: "#b6d3cc" }}>
            {dict.hero.subheadline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "#b6d3cc",
          }}
        >
          <span>{business.address.locality}</span>
          <span style={{ color: "#f2842b", fontWeight: 700 }}>
            {business.whatsapp.display}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
