import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PageHeroImage } from "@/components/layout/page-hero-image";
import { WholesaleQuoteForm } from "@/components/forms/wholesale-quote-form";

export const metadata: Metadata = {
  title: "Wholesale & B2B Supply",
  description:
    "Bulk supply of grains, livestock, fish and processed foods for supermarkets, hotels, restaurants, processors and exporters in Ghana.",
};

const benefits = [
  "Tiered volume pricing across our full catalogue",
  "Consistent, forecastable supply backed by our own farms and outgrower network",
  "Full farm-to-fork traceability and CoAs on request",
  "Dedicated account support once approved as a partner",
];

export default function WholesalePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeroImage slug="wholesale" />
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
          Wholesale &amp; B2B Supply
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          We supply supermarkets, hotels, restaurants, food processors and
          exporters across Ghana with certified grains, livestock, fish,
          seedlings and processed foods at volume.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold">
            Why buy wholesale from us
          </h2>
          <ul className="flex flex-col gap-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-forest-600" />
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Once your enquiry is approved, we create you a{" "}
            <Link href="/partners" className="underline">
              Partner Portal
            </Link>{" "}
            account with tiered pricing, order history, invoices and CoA downloads.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">
            Request a bulk quote
          </h2>
          <WholesaleQuoteForm defaultRequestType="wholesale" />
        </div>
      </div>
    </div>
  );
}
