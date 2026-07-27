import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy & Data Practices",
  description: "How Grainy Palace Farm collects, uses and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-heading text-3xl font-semibold">Privacy &amp; Data Practices</h1>

      <div className="flex flex-col gap-6 text-sm text-muted-foreground">
        <section>
          <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">
            What we collect
          </h2>
          <p>
            When you place an order, submit a quote, subscription, job,
            outgrower or lab-sample form, or contact us, we collect the
            details you provide (name, phone, email, address, and the
            content of your request) to fulfil that request. Guest checkout
            does not require creating an account.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">
            Payments
          </h2>
          <p>
            Card and Mobile Money payments are processed by Paystack; we do
            not store your card or MoMo PIN details ourselves. Cash and
            bank-transfer orders are recorded with the details you provide
            for delivery and reconciliation.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">
            Analytics
          </h2>
          <p>
            We only load analytics after you accept the cookie banner.
            Analytics data is aggregated and used to understand which pages
            are useful, not to identify individuals.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">
            Your data
          </h2>
          <p>
            We keep order, quote and application records only as long as
            needed for fulfilment, accounting and legal record-keeping. To
            ask about, correct, or request deletion of your data, contact
            us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="underline">
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
