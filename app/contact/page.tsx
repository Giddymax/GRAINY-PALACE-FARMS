import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Grainy Palace Farms — phone, WhatsApp, email, or visit us in Greater Accra Region, Ghana.",
};

export default function ContactPage() {
  const whatsappHref = buildWhatsAppLink(
    "Hello Grainy Palace Farms, I'd like to get in touch."
  );
  const mapQuery = encodeURIComponent(siteConfig.contact.address);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
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
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 text-forest-600" />
              <div>
                <p className="font-medium">Phone</p>
                <a href={`tel:${siteConfig.contact.phone}`} className="text-sm text-muted-foreground hover:underline">
                  {siteConfig.contact.phone}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-5 text-forest-600" />
              <div>
                <p className="font-medium">Email</p>
                <a href={`mailto:${siteConfig.contact.email}`} className="text-sm text-muted-foreground hover:underline">
                  {siteConfig.contact.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 text-forest-600" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{siteConfig.contact.address}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 size-5 text-forest-600" />
              <div>
                <p className="font-medium">Hours</p>
                <p className="text-sm text-muted-foreground">{siteConfig.contact.hours}</p>
              </div>
            </li>
          </ul>

          <Button asChild size="lg" className="w-fit bg-[#25D366] text-white hover:bg-[#1fb958]">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-1 size-4" /> Chat on WhatsApp
            </a>
          </Button>

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
