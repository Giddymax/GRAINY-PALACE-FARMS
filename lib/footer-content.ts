import { siteConfig } from "@/lib/site-config";
import { footerBusinessLinks, footerCompanyLinks, footerShopLinks } from "@/lib/nav";

export type FooterField = { key: string; label: string; fallback: string; multiline?: boolean };
export type FooterFieldGroup = { title: string; fields: FooterField[] };
export type FooterLink = { label: string; href: string };
export type FooterSocialLink = FooterLink & { platform: "facebook" | "instagram" | "linkedin" | "x" };
export type FooterCollections = {
  shop: FooterLink[];
  company: FooterLink[];
  business: FooterLink[];
  bottom: FooterLink[];
  social: FooterSocialLink[];
};

const bottomLinks: FooterLink[] = [
  { label: "Staff login", href: "/admin" },
  { label: "Contact", href: "/contact" },
  { label: "Traceability", href: "/traceability" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Privacy", href: "/privacy" },
];

const socialLinks: FooterSocialLink[] = [
  { platform: "facebook", label: "Facebook", href: siteConfig.social.facebook },
  { platform: "instagram", label: "Instagram", href: siteConfig.social.instagram },
  { platform: "linkedin", label: "LinkedIn", href: siteConfig.social.linkedin },
];

const parseLinks = <T extends FooterLink>(value: string | undefined): T[] | null => {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (item): item is T =>
        item !== null &&
        typeof item === "object" &&
        "label" in item && typeof item.label === "string" &&
        "href" in item && typeof item.href === "string"
    );
  } catch {
    return null;
  }
};

export function getFooterCollections(content: Record<string, string>) {
  const fromLegacy = (group: string, links: FooterLink[]) =>
    links.map((link, index) => ({
      label: content[`${group}_${index}_label`] || link.label,
      href: content[`${group}_${index}_href`] || link.href,
    }));
  const legacySocials: FooterSocialLink[] = [
    { platform: "facebook", label: content.facebook_label || "Facebook", href: content.facebook_url || siteConfig.social.facebook },
    { platform: "instagram", label: content.instagram_label || "Instagram", href: content.instagram_url || siteConfig.social.instagram },
    { platform: "linkedin", label: content.linkedin_label || "LinkedIn", href: content.linkedin_url || siteConfig.social.linkedin },
  ];
  const savedSocials = parseLinks<FooterSocialLink>(content.social_links);
  const validSocials = savedSocials?.filter((item) => ["facebook", "instagram", "linkedin", "x"].includes(item.platform)) ?? null;

  const legacyBottomKeys = [
    ["staff_login_label", "staff_login_href"],
    ["contact_link_label", "contact_link_href"],
    ["traceability_link_label", "traceability_link_href"],
    ["sustainability_link_label", "sustainability_link_href"],
    ["privacy_link_label", "privacy_link_href"],
  ];
  return {
    shop: parseLinks<FooterLink>(content.shop_links) ?? fromLegacy("shop", footerShopLinks),
    company: parseLinks<FooterLink>(content.company_links) ?? fromLegacy("company", footerCompanyLinks),
    business: parseLinks<FooterLink>(content.business_links) ?? fromLegacy("business", footerBusinessLinks),
    bottom: parseLinks<FooterLink>(content.bottom_links) ?? bottomLinks.map((link, index) => ({
      label: content[legacyBottomKeys[index][0]] || link.label,
      href: content[legacyBottomKeys[index][1]] || link.href,
    })),
    social: validSocials ?? socialLinks.map((link, index) => ({
      ...link,
      ...legacySocials[index],
    })),
  };
}

export const footerFieldGroups: FooterFieldGroup[] = [
  { title: "Brand and social links", fields: [
    { key: "copyright_name", label: "Copyright brand name", fallback: siteConfig.name },
    { key: "brand_promise", label: "Brand description", fallback: siteConfig.brandPromise, multiline: true },
  ] },
  { title: "Column headings", fields: [
    { key: "shop_title", label: "Shop heading", fallback: "Shop" },
    { key: "company_title", label: "Company heading", fallback: "Company" },
    { key: "contact_title", label: "Contact heading", fallback: "Get in touch" },
    { key: "business_title", label: "Business links heading", fallback: "For business" },
  ] },
  { title: "Contact details", fields: [
    { key: "address_label", label: "Address label", fallback: "Address" },
    { key: "address", label: "Address", fallback: siteConfig.contact.address, multiline: true },
    { key: "phone_label", label: "Phone label", fallback: "Phone" },
    { key: "phone", label: "Phone number", fallback: siteConfig.contact.phone },
    { key: "email_label", label: "Email label", fallback: "Email" },
    { key: "email", label: "Email address", fallback: siteConfig.contact.email },
    { key: "hours_label", label: "Hours label", fallback: "Hours" },
    { key: "hours", label: "Opening hours", fallback: siteConfig.contact.hours },
  ] },
  { title: "Footer bottom links", fields: [
    { key: "rights_reserved", label: "Copyright text", fallback: "All rights reserved." },
  ] },
];

export const footerLinkCollectionLabels = {
  shop: "Shop column links",
  company: "Company column links",
  business: "Business links",
  bottom: "Bottom-row links",
  social: "Social media links",
} as const;

export const footerDefaultValues = Object.fromEntries(
  footerFieldGroups.flatMap((group) => group.fields.map(({ key, fallback }) => [key, fallback]))
) as Record<string, string>;
