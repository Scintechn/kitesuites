/**
 * Single source of truth for Kite Suites business FACTS.
 *
 * Everything here is transcribed from kitesuites.com.br. Do not invent values:
 * if a fact is not published by the business, it is absent from this file
 * (there is deliberately no `email` — the business publishes WhatsApp only).
 */
export const business = {
  legalName: "Kite Suites",
  brandName: "Kite Suites",
  tagline: "Praia Seca · RJ",
  siteUrl: "https://kitesuites.com.br",

  address: {
    street: "Av. Praia dos Nobres, 741",
    district: "São Tomé",
    locality: "Praia Seca, Araruama",
    region: "RJ",
    postalCode: "28970-000",
    country: "Brasil",
  },

  phone: {
    mobile: { display: "+55 22 99988-6066", href: "tel:+5522999886066" },
  },

  whatsapp: {
    display: "+55 22 99988-6066",
    number: "5522999886066",
  },

  /** "Todos os dias da semana das 8h00 às 18h00" — every day, 08:00–18:00. */
  hours: {
    everyDay: { opens: "08:00", closes: "18:00" },
  },

  social: {
    instagram: "https://www.instagram.com/kite_suites",
  },

  mapDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(
      "Kite Suites, Av. Praia dos Nobres, 741, Praia Seca, Araruama - RJ, 28970-000",
    ),

  mapEmbedSrc:
    "https://www.google.com/maps?q=" +
    encodeURIComponent(
      "Av. Praia dos Nobres, 741, Praia Seca, Araruama - RJ, 28970-000",
    ) +
    "&output=embed",
} as const;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${business.whatsapp.number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function addressOneLine(): string {
  const a = business.address;
  return `${a.street} - ${a.district}, ${a.locality} - ${a.region}, ${a.postalCode}`;
}
