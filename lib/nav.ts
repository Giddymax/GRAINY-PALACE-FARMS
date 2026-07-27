export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

/** Primary shop-adjacent links, always visible on wide screens. */
export const primaryNav: NavLink[] = [
  { label: "Shop", href: "/shop" },
  { label: "Livestock", href: "/livestock" },
  { label: "Fish & Aquaculture", href: "/fish" },
  { label: "Seedlings", href: "/seedlings" },
  { label: "Wholesale", href: "/wholesale" },
];

/** Secondary links, tucked under a "More" menu on desktop and shown in full on mobile. */
export const secondaryNav: NavLink[] = [
  { label: "Knowledge Hub", href: "/articles", description: "Nutrition, food safety & farming guides" },
  { label: "Lab Services", href: "/lab-services", description: "Food-safety testing & results tracker" },
  { label: "News & Events", href: "/news" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Careers", href: "/careers", description: "Jobs & the outgrower scheme" },
  { label: "Traceability", href: "/traceability", description: "Look up a batch by QR/reference" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
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
