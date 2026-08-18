"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Windguru forecast widget for the Praia Seca / Araruama lagoon spot.
 *
 * Windguru spot 7063 = "Araruama - Praia Seca" (https://www.windguru.cz/7063).
 * The vendor script is unusual: it looks itself up with
 * `document.getElementById(uid)` — where `uid` is the id of its own <script>
 * tag — and inserts the forecast iframe as that tag's *next sibling*. So the
 * script element has to be appended into the container we want the widget to
 * appear in; loading it from <head> or via next/script renders nothing.
 */

const SPOT_ID = "7063";
const MODEL = "100"; // GFS 13 km
const UID = "wg_fwdg_7063_100_kitesuites";

function widgetSrc(locale: Locale): string {
  const params = new URLSearchParams({
    s: SPOT_ID,
    m: MODEL,
    uid: UID,
    wj: "knots", // wind in knots — what kiters actually read
    tj: "c",
    waj: "m",
    tij: "cm",
    odh: "0",
    doh: "24",
    fhours: "72",
    hrsm: "2",
    vt: "forecasts",
    lng: locale === "pt" ? "pt" : "en",
    idbs: "1",
    // WINDSPD = wind speed, GUST = gusts, SMER = wind direction,
    // TMPE = temperature, CDC = cloud cover.
    p: "WINDSPD,GUST,SMER,TMPE,CDC",
  });
  return `https://www.windguru.cz/js/widget.php?${params.toString()}`;
}

export function WindWidget({
  locale,
  fallback,
}: {
  locale: Locale;
  fallback: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    // React 19 StrictMode runs effects twice in dev; without this the widget
    // would be injected (and the iframe duplicated) on every re-run.
    if (host.querySelector(`#${UID}`)) return;

    const script = document.createElement("script");
    script.id = UID;
    script.src = widgetSrc(locale);
    script.async = true;
    script.onerror = () => setFailed(true);
    host.appendChild(script);

    return () => {
      host.replaceChildren();
    };
  }, [locale]);

  return (
    <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white p-3 shadow-sm sm:p-4">
      <div ref={ref} className="min-h-[220px] [&_iframe]:w-full" />
      {failed ? (
        <p className="px-2 py-6 text-center text-sm text-ink-500">{fallback}</p>
      ) : null}
    </div>
  );
}
