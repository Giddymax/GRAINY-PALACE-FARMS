/**
 * Fallback brand/contact defaults.
 *
 * Everything here is also stored in the `site_content` table so staff can edit
 * it from /admin without a redeploy. These constants are only the seed values
 * and the safety-net used if a `site_content` row is ever missing.
 */
export const siteConfig = {
  name: "Grainy Palace Farm Limited",
  shortName: "Grainy Palace Farm",
  tagline: "Cultivating Excellence. Feeding the Future.",
  brandPromise:
    "From our certified fields to your table — safe, natural, and traceable.",
  description:
    "Grainy Palace Farm Limited is a Ghanaian integrated agribusiness supplying certified grains, livestock, fish, seedlings and processed foods across Ghana — grown, raised and processed with full farm-to-fork traceability.",
  domain: "grainypalacefarm.com",
  altDomain: "grainypalacefarm.com.gh",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://grainypalacefarm.com",
  currency: "GHS",
  currencySymbol: "₵",
  region: "Greater Accra & Ashanti Region, Ghana",
  contact: {
    phone: "+233 20 123 4567",
    whatsapp: "233201234567",
    email: "info@grainypalacefarm.com",
    address: "Plot 14, Adenta-Dodowa Road, Greater Accra Region, Ghana",
    hours: "Monday – Saturday, 7:00am – 6:00pm GMT",
  },
  social: {
    facebook: "https://facebook.com/grainypalacefarm",
    instagram: "https://instagram.com/grainypalacefarm",
    twitter: "https://x.com/grainypalacefm",
    linkedin: "https://linkedin.com/company/grainy-palace-farm",
  },
  trustBadges: [
    "FDA-registered",
    "Certified",
    "HACCP",
    "Cage-Free",
    "Halal",
    "QR-Traceable",
    "Eco-Packaged",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
