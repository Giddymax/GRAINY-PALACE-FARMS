export type NavLink = {
  label: string;
  href: string;
  description?: string;
  /** Key into the "nav" namespace in messages/*.json, for the language switcher. */
  i18nKey?: string;
};

/** Primary shop-adjacent links, always visible on wide screens. */
export const primaryNav: NavLink[] = [
  { label: "Shop", href: "/shop", i18nKey: "shop" },
  { label: "Livestock", href: "/livestock", i18nKey: "livestock" },
  { label: "Fish & Aquaculture", href: "/fish", i18nKey: "fish" },
  { label: "Seedlings", href: "/seedlings", i18nKey: "seedlings" },
  { label: "Wholesale", href: "/wholesale", i18nKey: "wholesale" },
];

/** Secondary links, tucked under a "More" menu on desktop and shown in full on mobile. */
export const secondaryNav: NavLink[] = [
  { label: "Knowledge Hub", href: "/articles", description: "Nutrition, food safety & farming guides", i18nKey: "knowledgeHub" },
  { label: "Lab Services", href: "/lab-services", description: "Food-safety testing & results tracker", i18nKey: "labServices" },
  { label: "News & Events", href: "/news", i18nKey: "newsEvents" },
  { label: "Sustainability", href: "/sustainability", i18nKey: "sustainability" },
  { label: "Careers", href: "/careers", description: "Jobs & the outgrower scheme", i18nKey: "careers" },
  { label: "Traceability", href: "/traceability", description: "Look up a batch by QR/reference", i18nKey: "traceability" },
  { label: "About Us", href: "/about", i18nKey: "about" },
  { label: "Contact", href: "/contact", i18nKey: "contact" },
];

export const footerShopLinks: NavLink[] = [
  { label: "Grains & Cereals", href: "/shop/grains-cereals" },
  { label: "Vegetables", href: "/shop/vegetables" },
  { label: "Poultry & Eggs", href: "/shop/poultry-eggs" },
  { label: "Fish & Seafood", href: "/shop/fish-seafood" },
  { label: "Seedlings", href: "/shop/seedlings" },
  { label: "Processed Foods", href: "/shop/processed-foods" },
];

export const footerCompanyLinks: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Careers & Outgrowers", href: "/careers" },
  { label: "News & Events", href: "/news" },
  { label: "Knowledge Hub", href: "/articles" },
  { label: "Contact", href: "/contact" },
];

export const footerBusinessLinks: NavLink[] = [
  { label: "Wholesale / B2B", href: "/wholesale" },
  { label: "Partner Portal", href: "/partners" },
  { label: "Lab Services", href: "/lab-services" },
  { label: "Traceability Lookup", href: "/traceability" },
];
