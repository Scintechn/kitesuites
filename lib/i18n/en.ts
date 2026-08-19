import type { Dictionary } from "./types";

export const en: Dictionary = {
  meta: {
    siteTitle: "Kite Suites — Stay & Dine in Praia Seca, Brazil",
    siteDescription:
      "Guesthouse and restaurant facing the Araruama lagoon in Praia Seca. Suites with breakfast, kitesurf lessons, beach service and day trips.",
  },

  nav: {
    home: "Home",
    suites: "Rooms",
    services: "Services",
    restaurant: "Restaurant",
    contact: "Contact",
    bookCta: "Book now",
    bookShort: "Book",
    whatsappCta: "WhatsApp",
    callCta: "Call",
    skipToContent: "Skip to content",
  },

  hero: {
    eyebrow: "Praia Seca · Araruama · Brazil",
    headline: "Waiting for new winds",
    subheadline: "Time for yourself",
    body: "Disconnect from the daily rush. Our rooms are a perfect blend of nature and comfort. Nothing beats waking up facing the lagoon and heading straight out to your favourite sport. Come and discover Kite Suites — you deserve it.",
    primaryCta: "See the rooms",
    secondaryCta: "Book on WhatsApp",
    badges: [
      "Facing the lagoon",
      "Breakfast included",
      "Swimming pool",
      "Kitesurf lessons",
    ],
  },

  highlights: {
    title: "You deserve it...",
    intro:
      "Somewhere to sleep, somewhere to eat and the Praia Seca wind — all a few steps from the Araruama lagoon.",
    items: [
      {
        title: "Restaurant",
        description:
          "Breakfast, lunch or an açaí bowl at our restaurant facing the lagoon.",
        icon: "utensils",
      },
      {
        title: "Kitesurf lessons",
        description:
          "Certified instructors for your first lesson or to take your riding further.",
        icon: "kite",
      },
      {
        title: "Beach service",
        description:
          "Chairs, umbrellas and service so you can enjoy a full day on the lagoon or the beach.",
        icon: "umbrella",
      },
      {
        title: "Day trips",
        description:
          "Buggy, jet ski and boat trips around Praia Seca and Arraial do Cabo with our partners.",
        icon: "compass",
      },
    ],
  },

  wind: {
    title: "Wind in Praia Seca",
    intro:
      "Wind speed, gusts and direction for the next 3 days on the Araruama lagoon. Windguru forecast for the Araruama - Praia Seca spot.",
    note: "Speed and gusts in knots (kt) · direction shown by the arrow · data from Windguru.",
    fallback:
      "The forecast could not be loaded right now. Check the spot directly on Windguru.",
    spotCta: "Open on Windguru",
  },

  suitesTeaser: {
    title: "Rooms",
    intro:
      "Two suites overlooking the lagoon and a bunk-bed hostel room — all with breakfast, air conditioning and WiFi.",
    cta: "See all rooms",
  },

  location: {
    title: "Where we are",
    intro:
      "On Avenida Praia dos Nobres, in São Tomé, Praia Seca — one of the best kitesurf spots in Rio de Janeiro's Lakes Region.",
    addressLabel: "Address",
    hoursLabel: "Open",
    directionsCta: "Get directions",
    mapTitle: "Map showing Kite Suites in Praia Seca",
  },

  finalCta: {
    headline: "Switch off. Come to Kite Suites.",
    subheadline:
      "Message us on WhatsApp to lock in your dates — we answer every day, 8am to 6pm.",
    primaryCta: "Book on WhatsApp",
    secondaryCta: "Send a message",
  },

  suitesPage: {
    pageTitle: "Rooms",
    pageDescription:
      "Arubinha and Coroinha suites with lagoon views, plus the Downwind hostel room. Breakfast, air conditioning, WiFi and a pool.",
    title: "Rooms",
    intro:
      "Every room includes breakfast, served at the restaurant facing the lagoon.",
    bookCta: "Book now",
    detailsLabel: "Details",
    capacityLabel: "Capacity",
    items: [
      {
        slug: "arubinha",
        name: "Arubinha Suite",
        description:
          "A cosy 17 m² room with a wonderful view over the lagoon. Everything you need, nothing you don't.",
        beds: "1 queen bed or 2 singles, plus 1 extra single.",
        amenities: [
          { label: "Breakfast", icon: "coffee" },
          { label: "Mini fridge", icon: "fridge" },
          { label: "Air conditioning", icon: "wind" },
          { label: "TV", icon: "tv" },
          { label: "WiFi", icon: "wifi" },
        ],
        capacity: "Sleeps up to 3 guests.",
        image: "/images/room-1.jpg",
        imageAlt:
          "Arubinha suite with a double bed and a balcony overlooking the lagoon",
        gallery: [
          { src: "/images/room-4.jpg", alt: "Suite bathroom with a solid wood vanity" },
          { src: "/images/room-3.jpg", alt: "Mini fridge, coffee machine and mirror in the suite" },
        ],
      },
      {
        slug: "coroinha",
        name: "Coroinha Suite",
        description:
          "A cosy 17 m² room with a wonderful view over the lagoon. Everything you need, nothing you don't.",
        beds: "1 queen bed or 2 singles, plus 1 extra single.",
        amenities: [
          { label: "Breakfast", icon: "coffee" },
          { label: "Mini fridge", icon: "fridge" },
          { label: "Air conditioning", icon: "wind" },
          { label: "TV", icon: "tv" },
          { label: "WiFi", icon: "wifi" },
        ],
        capacity: "Sleeps up to 3 guests.",
        image: "/images/room-7.jpg",
        imageAlt: "Coroinha suite with a queen bed and wooden headboard",
        gallery: [
          { src: "/images/room-2.jpg", alt: "Day bed and TV in the Coroinha suite" },
          { src: "/images/room-5.jpg", alt: "Bathroom with a glass shower and wooden vanity" },
        ],
      },
      {
        slug: "downwind",
        name: "Downwind Hostel",
        description:
          "Two bunk beds with lockers. On the ground floor, next to the men's and women's changing rooms.",
        beds: "2 bunk beds (4 beds).",
        amenities: [
          { label: "Breakfast", icon: "coffee" },
          { label: "Air conditioning", icon: "wind" },
          { label: "WiFi", icon: "wifi" },
          { label: "Locker with key", icon: "lock" },
        ],
        capacity: "Sleeps up to 4 guests.",
        image: "/images/hostel-1.jpg",
        imageAlt: "Downwind hostel room with two bunk beds and a wardrobe",
        gallery: [
          { src: "/images/hostel-2.jpg", alt: "Hostel doorway opening onto the garden and pool" },
        ],
      },
    ],
  },

  servicesPage: {
    pageTitle: "Services",
    pageDescription:
      "Lagoon-front dining, kitesurf lessons with certified instructors, beach service and day trips around Praia Seca and Arraial do Cabo.",
    title: "Services",
    intro: "Break the routine. Choose Kite Suites.",
    items: [
      {
        slug: "gastronomia",
        title: "Restaurant",
        description:
          "Come for breakfast, lunch or an açaí bowl at our restaurant facing the lagoon.",
        icon: "utensils",
        image: "/images/svc-1.jpg",
        imageAlt: "Breakfast table with fruit, juice and bread",
        cta: "See the restaurant",
      },
      {
        slug: "kitesurf",
        title: "Kitesurf lessons",
        description:
          "Book a lesson with our certified instructors and get into the incredible world of kitesurfing.",
        icon: "kite",
        image: "/images/svc-2.jpg",
        imageAlt: "Instructor guiding a student during a kitesurf lesson on the lagoon",
        cta: "Book a lesson",
        whatsappMessage:
          "Hi! I'd like to book a kitesurf lesson at Kite Suites.",
      },
      {
        slug: "praia",
        title: "Beach service",
        description:
          "Everything you need to make the most of your day on the lagoon or at the beach.",
        icon: "umbrella",
        image: "/images/svc-3.jpg",
        imageAlt: "Sun loungers and umbrellas set up on the beach",
      },
      {
        slug: "passeios",
        title: "Day trips",
        description:
          "Buggy, jet ski and boat trips around Praia Seca and Arraial do Cabo with our partners.",
        icon: "compass",
        image: "/images/svc-4.jpg",
        imageAlt: "Quad bike and buggy on the Praia Seca dunes",
        cta: "Book a trip",
        whatsappMessage: "Hi! I'd like information about the Kite Suites trips.",
      },
    ],
  },

  restaurantPage: {
    pageTitle: "Restaurant",
    pageDescription:
      "The Kite Suites restaurant menu: breakfasts, sandwiches, starters, mains, desserts, drinks and cocktails.",
    title: "Restaurant",
    intro: "Served at the lagoon-front restaurant, every day from 8am to 6pm.",
    currencyNote: "Prices in Brazilian reais (R$).",
    sections: [
      {
        title: "Breakfast",
        items: [
          {
            name: "Café Lagoa",
            price: "40",
            description:
              "1 hot drink (coffee, milk, chocolate or tea) · juice of the day · butter, jam and cream cheese · bread (French roll, sliced or sourdough) · cold cuts platter (mozzarella, minas cheese, ham and turkey breast).",
          },
          {
            name: "Café Kite",
            price: "65",
            description:
              "1 hot drink (coffee, milk, chocolate or tea) · juice of the day · butter, jam, cream cheese, honey and granola · fruit of the day · yoghurt · bread (French roll, sliced or sourdough) · fried or scrambled eggs · cold cuts platter · cake of the day.",
          },
          {
            name: "Toast (avocado or bacon)",
            price: "25",
            description: "On sourdough. Avocado + egg, or egg + bacon.",
          },
          {
            name: "Eggs (2)",
            price: "16",
            description: "Fried or scrambled.",
          },
        ],
      },
      {
        title: "Breakfast extras",
        items: [
          { name: "Honey, granola, jam or cream cheese", price: "8" },
          { name: "Bacon or cold cuts platter", price: "12" },
          { name: "Yoghurt and honey", price: "10" },
          { name: "Fruit of the day", price: "10" },
        ],
      },
      {
        title: "Sandwiches, breads and cakes",
        items: [
          {
            name: "Toasted ham & cheese, or cheese toastie",
            price: "20",
            description: "On sliced bread or a French roll.",
          },
          { name: "Minas cheese with turkey breast", price: "25" },
          { name: "Grilled French roll", price: "8" },
          {
            name: "House toastie",
            price: "29",
            description: "Cheese, ham and tomato on sourdough.",
          },
          { name: "Grilled sourdough (2 slices)", price: "13" },
          { name: "Cheese bread (6 pcs)", price: "12" },
          { name: "Cake of the day", price: "12" },
        ],
      },
      {
        title: "Chia tapioca or omelette",
        note: "Choose 2 fillings: prato cheese, minas cheese, ham, turkey breast, bacon or banana with honey. Add if you like: tomato, onion.",
        items: [{ name: "Tapioca or omelette", price: "25" }],
      },
      {
        title: "Açaí",
        items: [
          {
            name: "Full açaí bowl",
            price: "30",
            description: "350 ml with banana, cane syrup and granola.",
          },
        ],
      },
      {
        title: "Sandwiches",
        items: [
          {
            name: "Burger",
            price: "45",
            description: "Cheese, mayo, lettuce, tomato and fries.",
          },
          {
            name: "House toastie with tomato",
            price: "29",
            description: "On sourdough.",
          },
          { name: "Chicken or tuna sandwich", price: "24" },
        ],
      },
      {
        title: "Starters",
        items: [
          { name: "Mini cheese pastéis (6 pcs)", price: "22" },
          { name: "Mini prawn pastéis (6 pcs)", price: "34" },
          {
            name: "Beef croquettes (6 pcs)",
            price: "24",
            description: "With lemon mayonnaise.",
          },
          { name: "Salt cod fritters (6 pcs)", price: "28" },
          { name: "Fries with paprika aioli", price: "29" },
          {
            name: "Catch-of-the-day ceviche",
            price: "47",
            description: "With corn tortillas.",
          },
          { name: "Beef tenderloin with onions and toasts", price: "54" },
          {
            name: "House salad",
            price: "36",
            description:
              "Fresh minas cheese, tomato, boiled egg, green beans, olives, onion and citrus dressing.",
          },
        ],
      },
      {
        title: "Main courses",
        items: [
          { name: "Penne rigate with prawn ragù", price: "65" },
          {
            name: "Grilled fish",
            price: "68",
            description: "Herb oil, parsnip purée and broccoli.",
          },
          {
            name: "Downwind chicken",
            price: "42",
            description: "Grilled, with rice, salad, beans and farofa.",
          },
          {
            name: "Beef tenderloin",
            price: "83",
            description: "Smashed potatoes, green beans and confit tomatoes.",
          },
        ],
      },
      {
        title: "Kids' menu",
        items: [
          {
            name: "Beef or chicken strips",
            price: "38",
            description: "With rice, beans and fries.",
          },
          { name: "Pasta with tomato sauce", price: "36" },
          { name: "Pasta with beef or chicken strips", price: "38" },
        ],
      },
      {
        title: "Desserts",
        items: [
          { name: "Churros with dulce de leche (6 pcs)", price: "29" },
          { name: "Chocolatudo (jar dessert)", price: "35" },
          { name: "Lime pie (jar dessert)", price: "35" },
        ],
      },
      {
        title: "Drinks",
        items: [
          { name: "Water", price: "5" },
          { name: "Sparkling water", price: "6" },
          { name: "Tonic water", price: "7" },
          { name: "Espresso", price: "7" },
          { name: "Filter coffee", price: "8" },
          { name: "Americano or tea", price: "8" },
          { name: "Cappuccino / mokkaccino", price: "10" },
          { name: "White coffee", price: "10" },
          { name: "Hot or cold chocolate", price: "12" },
          { name: "Orange juice (300 ml)", price: "15" },
          { name: "Juice of the day (300 ml)", price: "18" },
          { name: "Heineken / Corona / Praya", price: "16" },
          { name: "House iced mate", price: "12" },
          { name: "Gatorade", price: "10" },
          { name: "Guaraviton", price: "6" },
          { name: "Iced tea", price: "7" },
          { name: "Red Bull", price: "16" },
          { name: "Soft drink", price: "7" },
          { name: "Whole grape juice", price: "7" },
          { name: "YoPro / whey", price: "15" },
        ],
      },
      {
        title: "Snacks",
        items: [
          { name: "Peanuts", price: "10" },
          { name: "Protein bar", price: "12" },
          { name: "Crisps", price: "10" },
          { name: "Paçoca", price: "3" },
          { name: "Talento chocolate", price: "10" },
        ],
      },
      {
        title: "Cocktails",
        note: "Ask us for the wine list too.",
        items: [
          { name: "Caipirinha", price: "24" },
          { name: "Caipiroska (Smirnoff)", price: "26" },
          { name: "Caipiroska (Absolut)", price: "32" },
          { name: "Gin & tonic (Tanqueray)", price: "34" },
          { name: "Tropical gin (Tanqueray)", price: "34" },
        ],
      },
    ],
  },

  contact: {
    pageTitle: "Contact",
    pageDescription:
      "Message Kite Suites on WhatsApp or send us a note. Open every day 8am to 6pm, in Praia Seca, Araruama - RJ, Brazil.",
    title: "You deserve it",
    intro:
      "Book your stay, arrange a lesson or just ask us anything. We answer every day.",
    directTitle: "Talk to us directly",
    whatsappLabel: "WhatsApp",
    phoneLabel: "Phone",
    hoursLabel: "Open",
    hoursValue: "Every day, 8am to 6pm",
    addressLabel: "Address",
    instagramLabel: "Instagram",
    form: {
      title: "Send a message",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@email.com",
      phone: "Phone",
      phonePlaceholder: "+55 22 99999-9999",
      subject: "Subject",
      subjectOptions: [
        { value: "hospedagem", label: "Accommodation" },
        { value: "kitesurf", label: "Kitesurf lesson" },
        { value: "restaurante", label: "Restaurant" },
        { value: "passeios", label: "Day trips" },
        { value: "outro", label: "Something else" },
      ],
      message: "Message",
      messagePlaceholder:
        "Tell us your dates, how many people and what you're looking for.",
      consent: "I have read and accept the",
      consentLink: "privacy policy",
      submit: "Send message",
      submitting: "Sending...",
      success: "Message sent! We'll get back to you shortly.",
      errorGeneric:
        "We couldn't send that right now. Please try again or message us on WhatsApp.",
      errorValidation: "Please check the highlighted fields.",
    },
  },

  privacy: {
    pageTitle: "Privacy policy",
    pageDescription:
      "How Kite Suites handles the personal data submitted through the contact form.",
    updated: "Last updated: 18 August 2026",
    body: [
      {
        heading: "Who we are",
        paragraphs: [
          "This site is operated by Kite Suites, Av. Praia dos Nobres, 741 - São Tomé, Praia Seca, Araruama - RJ, 28970-000, Brazil.",
        ],
      },
      {
        heading: "Data we collect",
        paragraphs: [
          "We only collect what you type into the contact form: name, email, phone (optional), subject and message.",
          "We use no advertising cookies. Visit statistics are collected anonymously and cookie-free by Vercel Analytics.",
        ],
      },
      {
        heading: "Purpose and legal basis",
        paragraphs: [
          "We use your data solely to answer your booking or information request. The legal basis is your consent, given by ticking the box on the form.",
        ],
      },
      {
        heading: "Sharing and retention",
        paragraphs: [
          "Form messages are delivered to our team over Telegram. We do not sell or share your data with third parties for marketing.",
          "We keep messages only as long as needed to follow up on your request.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "You can ask us to access, correct or delete your data at any time on WhatsApp +55 22 99988-6066.",
        ],
      },
    ],
  },

  terms: {
    pageTitle: "Terms of use",
    pageDescription:
      "Terms for using the Kite Suites website, and how bookings work.",
    updated: "Last updated: 18 August 2026",
    body: [
      {
        heading: "Using this site",
        paragraphs: [
          "The content here is provided for information. We do our best to keep prices, rooms and services up to date, but they may change without notice.",
        ],
      },
      {
        heading: "Bookings",
        paragraphs: [
          "This site does not take payments and does not confirm bookings automatically. A booking is only confirmed once our team confirms it explicitly over WhatsApp.",
        ],
      },
      {
        heading: "Menu and prices",
        paragraphs: [
          "Menu prices are in Brazilian reais (R$) and may vary with availability and season. The menu published here is indicative.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "The photographs, brand and text on this site belong to Kite Suites and may not be reused without permission.",
        ],
      },
    ],
  },

  footer: {
    rights: "All rights reserved.",
    navTitle: "Navigation",
    contactTitle: "Contact",
    privacy: "Privacy policy",
    terms: "Terms of use",
  },

  localeSwitcher: {
    pt: "PT",
    en: "EN",
    label: "Choose language",
  },
};
