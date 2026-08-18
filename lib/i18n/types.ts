export type ServiceIcon = "utensils" | "kite" | "umbrella" | "compass";
export type AmenityIcon =
  | "coffee"
  | "wind"
  | "wifi"
  | "tv"
  | "fridge"
  | "waves"
  | "lock"
  | "users";

export type MenuItem = {
  name: string;
  description?: string;
  price?: string;
};

export type MenuSection = {
  title: string;
  note?: string;
  items: MenuItem[];
};

export type Dictionary = {
  meta: {
    siteTitle: string;
    siteDescription: string;
  };
  nav: {
    home: string;
    suites: string;
    services: string;
    restaurant: string;
    contact: string;
    bookCta: string;
    whatsappCta: string;
    callCta: string;
    skipToContent: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    badges: string[];
  };
  highlights: {
    title: string;
    intro: string;
    items: { title: string; description: string; icon: ServiceIcon }[];
  };
  wind: {
    title: string;
    intro: string;
    note: string;
    fallback: string;
    spotCta: string;
  };
  suitesTeaser: {
    title: string;
    intro: string;
    cta: string;
  };
  location: {
    title: string;
    intro: string;
    addressLabel: string;
    hoursLabel: string;
    directionsCta: string;
    mapTitle: string;
  };
  finalCta: {
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
  };
  suitesPage: {
    pageTitle: string;
    pageDescription: string;
    title: string;
    intro: string;
    bookCta: string;
    detailsLabel: string;
    capacityLabel: string;
    items: {
      slug: string;
      name: string;
      description: string;
      beds: string;
      amenities: { label: string; icon: AmenityIcon }[];
      capacity: string;
      image: string;
      imageAlt: string;
      gallery: { src: string; alt: string }[];
    }[];
  };
  servicesPage: {
    pageTitle: string;
    pageDescription: string;
    title: string;
    intro: string;
    items: {
      slug: string;
      title: string;
      description: string;
      icon: ServiceIcon;
      image: string;
      imageAlt: string;
      cta?: string;
      whatsappMessage?: string;
    }[];
  };
  restaurantPage: {
    pageTitle: string;
    pageDescription: string;
    title: string;
    intro: string;
    currencyNote: string;
    sections: MenuSection[];
  };
  contact: {
    pageTitle: string;
    pageDescription: string;
    title: string;
    intro: string;
    directTitle: string;
    whatsappLabel: string;
    phoneLabel: string;
    hoursLabel: string;
    hoursValue: string;
    addressLabel: string;
    instagramLabel: string;
    form: {
      title: string;
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      subject: string;
      subjectOptions: { value: string; label: string }[];
      message: string;
      messagePlaceholder: string;
      consent: string;
      consentLink: string;
      submit: string;
      submitting: string;
      success: string;
      errorGeneric: string;
      errorValidation: string;
    };
  };
  privacy: {
    pageTitle: string;
    pageDescription: string;
    updated: string;
    body: { heading: string; paragraphs: string[] }[];
  };
  terms: {
    pageTitle: string;
    pageDescription: string;
    updated: string;
    body: { heading: string; paragraphs: string[] }[];
  };
  footer: {
    rights: string;
    navTitle: string;
    contactTitle: string;
    privacy: string;
    terms: string;
  };
  localeSwitcher: {
    pt: string;
    en: string;
    label: string;
  };
};
