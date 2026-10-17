"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { WordMark } from "@/components/brand/logo-mark";
import { siteConfig } from "@/lib/site-config";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from "@/components/brand/social-icons";
import { getFooterCollections } from "@/lib/footer-content";
import type { PublicContactSettings } from "@/lib/data/site-content";

export function SiteFooter({
  content,
  contactSettings,
}: {
  content: Record<string, string>;
  contactSettings: PublicContactSettings;
}) {
  const year = new Date().getFullYear();
  const t = useTranslations("footer");
  const value = (key: string, fallback: string) => content[key] || fallback;
  const collections = getFooterCollections(content);
  const socialIcons = {
    facebook: FacebookIcon,
    instagram: InstagramIcon,
    linkedin: LinkedInIcon,
    x: XIcon,
  };

  return (
    <footer className="border-t border-border bg-forest-950 text-forest-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="[&_span]:text-forest-50">
            <WordMark />
          </div>
          <p className="max-w-sm text-sm text-forest-100">
            {value("brand_promise", siteConfig.brandPromise)}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {collections.social.map((social) => {
              const Icon = socialIcons[social.platform];
              return (
                <a
                  key={`${social.platform}:${social.href}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="inline-flex size-10 items-center justify-center rounded-full text-forest-100 transition-colors hover:bg-forest-900 hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
                >
                  <Icon className="size-5" />
                </a>
              );
            })}
          </div>
        </div>

        <FooterColumn title={value("shop_title", t("shop"))} links={collections.shop} />
        <FooterColumn title={value("company_title", t("company"))} links={collections.company} />

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-gold-300">
            {value("contact_title", t("getInTouch"))}
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-forest-100">
            <li>
              <span className="font-medium text-gold-300">{value("address_label", "Address")}: </span>{value("address", contactSettings.address)}
            </li>
            <li>
              <span className="font-medium text-gold-300">{value("phone_label", "Phone")}: </span>
              <a href={`tel:${value("phone", contactSettings.phone)}`} className="hover:underline">
                {value("phone", contactSettings.phone)}
              </a>
            </li>
            <li>
              <span className="font-medium text-gold-300">{value("email_label", "Email")}: </span>
              <a href={`mailto:${value("email", contactSettings.email)}`} className="hover:underline">
                {value("email", contactSettings.email)}
              </a>
            </li>
            <li>
              <span className="font-medium text-gold-300">{value("hours_label", "Hours")}: </span>{value("hours", contactSettings.hours)}
            </li>
          </ul>
          <div className="mt-2">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold-300">
              {value("business_title", t("forBusiness"))}
            </h4>
            <ul className="flex flex-col gap-1.5 text-sm text-forest-100">
              {collections.business.map((l) => (
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
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
            {collections.bottom.map((link) => (
              <Link
                key={`${link.href}:${link.label}`}
                href={link.href}
                className={link.href === "/admin" ? "text-gold-300 hover:text-gold-100" : "hover:underline"}
              >
                {link.label}
              </Link>
            ))}
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
