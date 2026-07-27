import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { WordMark } from "@/components/brand/logo-mark";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/brand/social-icons";
import { siteConfig } from "@/lib/site-config";
import {
  footerShopLinks,
  footerCompanyLinks,
  footerBusinessLinks,
} from "@/lib/nav";

export function SiteFooter() {
  const year = new Date().getFullYear();

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
          <Image
            src="/brand/grainy-palace-farms-seal.png"
            alt="Grainy Palace Farm heritage seal"
            width={72}
            height={72}
            className="rounded-full opacity-90"
          />
          <div className="flex gap-3">
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Grainy Palace Farm on Facebook"
              className="flex size-9 items-center justify-center rounded-full bg-forest-800 hover:bg-gold-500 hover:text-charcoal"
            >
              <FacebookIcon className="size-4" />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Grainy Palace Farm on Instagram"
              className="flex size-9 items-center justify-center rounded-full bg-forest-800 hover:bg-gold-500 hover:text-charcoal"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Grainy Palace Farm on LinkedIn"
              className="flex size-9 items-center justify-center rounded-full bg-forest-800 hover:bg-gold-500 hover:text-charcoal"
            >
              <LinkedInIcon className="size-4" />
            </a>
          </div>
        </div>

        <FooterColumn title="Shop" links={footerShopLinks} />
        <FooterColumn title="Company" links={footerCompanyLinks} />

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-gold-300">
            Get in touch
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-forest-100">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-300" />
              <span>{siteConfig.contact.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-gold-300" />
              <a href={`tel:${siteConfig.contact.phone}`} className="hover:underline">
                {siteConfig.contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-gold-300" />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:underline">
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold-300" />
              <span>{siteConfig.contact.hours}</span>
            </li>
          </ul>
          <div className="mt-2">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold-300">
              For business
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
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link href="/traceability" className="hover:underline">
              Traceability
            </Link>
            <Link href="/sustainability" className="hover:underline">
              Sustainability
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
