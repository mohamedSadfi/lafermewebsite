/**
 * Single source of truth for site-wide constants:
 * contact info, hours, address, geo, social URLs.
 *
 * Update here, not in components.
 */

export const SITE = {
  name: "La Ferme Agricole Tuniso-Suisse",
  shortName: "La Ferme Tuniso-Suisse",
  tagline: "Marché, restaurant et événements",
  url: "https://www.lafermetunisosuisse.com",
  description:
    "Ferme agricole tuniso-suisse à Turki, Nabeul. Marché de produits frais cultivés sur place, restaurant traditionnel tunisien, et privatisation pour vos événements.",

  contact: {
    phone: "+216 29 643 008",
    phoneTel: "+21629643008",
    email: "infos@lafermetunisosuisse.com",
  },

  address: {
    street: "Turki",
    postalCode: "8084",
    locality: "Nabeul",
    region: "Gouvernorat de Nabeul",
    country: "Tunisie",
    countryCode: "TN",
    full: "Turki, Gouvernorat de Nabeul 8084, Tunisie",
    directions: "À 2 minutes de la sortie Turki sur l'autoroute A1 Hammamet–Tunis",
  },

  geo: {
    latitude: 36.578097,
    longitude: 10.5280995,
  },

  hours: {
    daysOpen: "Mardi – Dimanche",
    closed: "Fermé le lundi",
    market: { label: "Marché", value: "8h – 18h" },
    brunch: { label: "Brunch", value: "8h – 12h" },
    lunch: { label: "Déjeuner", value: "12h – 17h" },
  },

  // Schema.org Restaurant uses these openingHours strings
  openingHoursSpec: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "18:00",
    },
  ],

  social: {
    facebook:
      "https://www.facebook.com/fermetunisosuisse/about?locale=fr_FR",
    googleMaps:
      "https://www.google.com/maps/place/Ferme+Agricole+Tuniso-Suisse/@36.578097,10.5280995,17z",
    googleMapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3198.9!2d10.5280995!3d36.578097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDM0JzQxLjEiTiAxMMKwMzEnNDEuMiJF!5e0!3m2!1sfr!2stn!4v1700000000000",
  },
} as const;

/**
 * Top-level navigation entries.
 * Hash-anchored to single-page sections.
 */
export const NAV_LINKS = [
  { href: "#histoire", label: "Histoire" },
  { href: "#marche", label: "Marché" },
  { href: "#restaurant", label: "Restaurant" },
  { href: "#evenements", label: "Événements" },
  { href: "#visiter", label: "Nous trouver" },
] as const;
