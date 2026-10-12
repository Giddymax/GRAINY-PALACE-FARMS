import { siteConfig } from "@/lib/site-config";
import { footerBusinessLinks, footerCompanyLinks, footerShopLinks } from "@/lib/nav";

export type FooterField = { key: string; label: string; fallback: string; multiline?: boolean };
export type FooterFieldGroup = { title: string; fields: FooterField[] };

const linkFields = (group: string, links: { label: string; href: string }[]) =>
  links.flatMap((link, index) => [
    { key: `${group}_${index}_label`, label: `Link ${index + 1} label`, fallback: link.label },
    { key: `${group}_${index}_href`, label: `Link ${index + 1} destination`, fallback: link.href },
  ]);

export const footerFieldGroups: FooterFieldGroup[] = [
  { title: "Brand and social links", fields: [
    { key: "copyright_name", label: "Copyright brand name", fallback: siteConfig.name },
    { key: "brand_promise", label: "Brand description", fallback: siteConfig.brandPromise, multiline: true },
    { key: "facebook_label", label: "Facebook link text", fallback: "Facebook" },
    { key: "facebook_url", label: "Facebook URL", fallback: siteConfig.social.facebook },
    { key: "instagram_label", label: "Instagram link text", fallback: "Instagram" },
    { key: "instagram_url", label: "Instagram URL", fallback: siteConfig.social.instagram },
    { key: "linkedin_label", label: "LinkedIn link text", fallback: "LinkedIn" },
    { key: "linkedin_url", label: "LinkedIn URL", fallback: siteConfig.social.linkedin },
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
  { title: "Shop links", fields: linkFields("shop", footerShopLinks) },
  { title: "Company links", fields: linkFields("company", footerCompanyLinks) },
  { title: "Business links", fields: linkFields("business", footerBusinessLinks) },
  { title: "Footer bottom links", fields: [
    { key: "staff_login_label", label: "Staff login label", fallback: "Staff login" },
    { key: "staff_login_href", label: "Staff login destination", fallback: "/admin" },
    { key: "contact_link_label", label: "Contact link label", fallback: "Contact" },
    { key: "contact_link_href", label: "Contact link destination", fallback: "/contact" },
    { key: "traceability_link_label", label: "Traceability link label", fallback: "Traceability" },
    { key: "traceability_link_href", label: "Traceability link destination", fallback: "/traceability" },
    { key: "sustainability_link_label", label: "Sustainability link label", fallback: "Sustainability" },
    { key: "sustainability_link_href", label: "Sustainability link destination", fallback: "/sustainability" },
    { key: "privacy_link_label", label: "Privacy link label", fallback: "Privacy" },
    { key: "privacy_link_href", label: "Privacy link destination", fallback: "/privacy" },
    { key: "rights_reserved", label: "Copyright text", fallback: "All rights reserved." },
  ] },
];

export const footerDefaultValues = Object.fromEntries(
  footerFieldGroups.flatMap((group) => group.fields.map(({ key, fallback }) => [key, fallback]))
) as Record<string, string>;
