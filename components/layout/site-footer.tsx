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

export function SiteFooter() {
  const year = new Date().getFullYear();
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-forest-950 text-forest-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="[&_span]:text-forest-50">
            <WordMark />
          </div>
          <p className="max-w-sm text-sm text-forest-100">
            {siteConfig.brandPromise}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-100 underline-offset-4 hover:text-gold-300 hover:underline"
            >
              Facebook
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-100 underline-offset-4 hover:text-gold-300 hover:underline"
            >
              Instagram
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-100 underline-offset-4 hover:text-gold-300 hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <FooterColumn title={t("shop")} links={footerShopLinks} />
        <FooterColumn title={t("company")} links={footerCompanyLinks} />

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-gold-300">
            {t("getInTouch")}
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-forest-100">
            <li>
              <span className="font-medium text-gold-300">Address: </span>{siteConfig.contact.address}
            </li>
            <li>
              <span className="font-medium text-gold-300">Phone: </span>
              <a href={`tel:${siteConfig.contact.phone}`} className="hover:underline">
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <span className="font-medium text-gold-300">Email: </span>
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:underline">
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <span className="font-medium text-gold-300">Hours: </span>{siteConfig.contact.hours}
            </li>
          </ul>
          <div className="mt-2">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold-300">
              {t("forBusiness")}
            </h4>
            <ul className="flex flex-col gap-1.5 text-sm text-forest-100">
              {footerBusinessLinks.map((l) => (
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
            &copy; {year} {siteConfig.name}. {t("allRightsReserved")}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gold-300 hover:text-gold-100"
            >
              Staff login
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link href="/traceability" className="hover:underline">
              Traceability
            </Link>
            <Link href="/sustainability" className="hover:underline">
              Sustainability
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
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
