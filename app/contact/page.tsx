import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeroImage } from "@/components/layout/page-hero-image";
import { ContactForm } from "@/components/forms/contact-form";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getPublicContactSettings } from "@/lib/data/site-content";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Grainy Palace Farms — phone, WhatsApp, email, or visit our farms in Ghana.",
};

export default async function ContactPage() {
  const contact = await getPublicContactSettings();
  const whatsappHref = buildWhatsAppLink(
    "Hello Grainy Palace Farms, I'd like to get in touch.",
    contact.whatsapp
  );
  const mapQuery = encodeURIComponent(contact.address);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeroImage slug="contact" />
      <div className="mb-12 text-center">
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">Contact Us</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Questions about an order, a bulk enquiry, or just want to say
          hello? We&apos;re here.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-4">
            <li>
              <div>
                <p className="font-medium">Phone</p>
                <a href={`tel:${contact.phone}`} className="text-sm text-muted-foreground hover:underline">
                  {contact.phone}
                </a>
              </div>
            </li>
            <li>
              <div>
                <p className="font-medium">Email</p>
                <a href={`mailto:${contact.email}`} className="text-sm text-muted-foreground hover:underline">
                  {contact.email}
                </a>
              </div>
            </li>
            <li>
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{contact.address}</p>
              </div>
            </li>
            <li>
              <div>
                <p className="font-medium">Hours</p>
                <p className="text-sm text-muted-foreground">{contact.hours}</p>
              </div>
            </li>
          </ul>

          <Button asChild size="lg" className="w-fit bg-[#25D366] text-white hover:bg-[#1fb958]">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
          </Button>

          <Link href="/farm-locations" className="w-fit text-sm font-medium text-forest-700 underline-offset-4 hover:underline dark:text-forest-300">
            View regional farms and directions
          </Link>

          <div className="overflow-hidden rounded-xl border border-border">
            <iframe
              title="Grainy Palace Farms location map"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">Send a message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
