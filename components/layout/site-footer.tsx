"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { WordMark } from "@/components/brand/logo-mark";
import { siteConfig } from "@/lib/site-config";
import {
  footerShopLinks,
  footerCompanyLinks,
  footerBusinessLinks,
} from "@/lib/nav";

export function SiteFooter({ content }: { content: Record<string, string> }) {
  const year = new Date().getFullYear();
  const t = useTranslations("footer");
  const value = (key: string, fallback: string) => content[key] || fallback;
  const links = (group: string, defaults: { label: string; href: string }[]) =>
    defaults.map((link, index) => ({
      label: value(`${group}_${index}_label`, link.label),
      href: value(`${group}_${index}_href`, link.href),
    }));

  return (
    <footer className="border-t border-border bg-forest-950 text-forest-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="[&_span]:text-forest-50">
            <WordMark />
          </div>
          <p className="max-w-sm text-sm text-forest-100">
            {value("brand_promise", siteConfig.brandPromise)}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <a
              href={value("facebook_url", siteConfig.social.facebook)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-100 underline-offset-4 hover:text-gold-300 hover:underline"
            >
              {value("facebook_label", "Facebook")}
            </a>
            <a
              href={value("instagram_url", siteConfig.social.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-100 underline-offset-4 hover:text-gold-300 hover:underline"
            >
              {value("instagram_label", "Instagram")}
            </a>
            <a
              href={value("linkedin_url", siteConfig.social.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-100 underline-offset-4 hover:text-gold-300 hover:underline"
            >
              {value("linkedin_label", "LinkedIn")}
            </a>
          </div>
        </div>

        <FooterColumn title={value("shop_title", t("shop"))} links={links("shop", footerShopLinks)} />
        <FooterColumn title={value("company_title", t("company"))} links={links("company", footerCompanyLinks)} />

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-gold-300">
            {value("contact_title", t("getInTouch"))}
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-forest-100">
            <li>
              <span className="font-medium text-gold-300">{value("address_label", "Address")}: </span>{value("address", siteConfig.contact.address)}
            </li>
            <li>
              <span className="font-medium text-gold-300">{value("phone_label", "Phone")}: </span>
              <a href={`tel:${value("phone", siteConfig.contact.phone)}`} className="hover:underline">
                {value("phone", siteConfig.contact.phone)}
              </a>
            </li>
            <li>
              <span className="font-medium text-gold-300">{value("email_label", "Email")}: </span>
              <a href={`mailto:${value("email", siteConfig.contact.email)}`} className="hover:underline">
                {value("email", siteConfig.contact.email)}
              </a>
            </li>
            <li>
              <span className="font-medium text-gold-300">{value("hours_label", "Hours")}: </span>{value("hours", siteConfig.contact.hours)}
            </li>
          </ul>
          <div className="mt-2">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold-300">
              {value("business_title", t("forBusiness"))}
            </h4>
            <ul className="flex flex-col gap-1.5 text-sm text-forest-100">
              {links("business", footerBusinessLinks).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-forest-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-forest-200 sm:flex-row sm:px-6 lg:px-8">
          <p>
            &copy; {year} {value("copyright_name", siteConfig.name)}. {value("rights_reserved", t("allRightsReserved"))}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={value("staff_login_href", "/admin")}
              className="text-gold-300 hover:text-gold-100"
            >
              {value("staff_login_label", "Staff login")}
            </Link>
            <Link href={value("contact_link_href", "/contact")} className="hover:underline">
              {value("contact_link_label", "Contact")}
            </Link>
            <Link href={value("traceability_link_href", "/traceability")} className="hover:underline">
              {value("traceability_link_label", "Traceability")}
            </Link>
            <Link href={value("sustainability_link_href", "/sustainability")} className="hover:underline">
              {value("sustainability_link_label", "Sustainability")}
            </Link>
            <Link href={value("privacy_link_href", "/privacy")} className="hover:underline">
              {value("privacy_link_label", "Privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-gold-300">
        {title}
      </h3>
      <ul className="flex flex-col gap-2 text-sm text-forest-100">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
