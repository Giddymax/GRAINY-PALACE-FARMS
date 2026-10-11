import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { PageHeroImage } from "@/components/layout/page-hero-image";

export const metadata: Metadata = {
  title: "Partner Portal",
  description:
    "B2B partner login for supermarkets, hotels, processors and exporters — tiered bulk pricing, order history and Certificates of Analysis.",
};

export default async function PartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ pending?: string }>;
}) {
  const { pending } = await searchParams;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeroImage slug="partners" />
      <div className="grid gap-10 md:grid-cols-2">
      <div>
        <h1 className="font-heading text-3xl font-semibold">
          Partner Portal
        </h1>
        <p className="mt-3 text-muted-foreground">
          For supermarkets, hotels, restaurants, processors and exporters
          buying from Grainy Palace Farms at volume. Approved partners get:
        </p>
        <ul className="mt-4 flex flex-col gap-2 text-sm">
          <li>• Tiered bulk pricing on our full catalogue</li>
          <li>• Full order history and delivery status</li>
          <li>• Downloadable invoices</li>
          <li>• Certificates of Analysis (CoA) for products you&apos;ve ordered</li>
        </ul>
        <div className="mt-6">
          <p className="text-sm font-medium">New to wholesale with us?</p>
          <Button asChild variant="outline" className="mt-2">
            <Link href="/wholesale">Submit a wholesale enquiry</Link>
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Once approved, our team creates your partner account and you can
            sign in here.
          </p>
        </div>
      </div>
      <div>
        {pending && (
          <p role="status" className="mb-4 rounded-md bg-gold-100 px-3 py-2 text-sm text-charcoal dark:bg-gold-900/40 dark:text-gold-100">
            Your account is registered but awaiting approval from our team.
            We&apos;ll notify you once it&apos;s active.
          </p>
        )}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">
            Partner sign in
          </h2>
          <LoginForm next="/partners/dashboard" signupHref="/signup" />
        </div>
      </div>
      </div>
    </div>
  );
}
