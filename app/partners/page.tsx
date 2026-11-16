import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText, PackageCheck, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { PageHeroImage } from "@/components/layout/page-hero-image";

export const metadata: Metadata = {
  title: "Partner Portal",
  description: "Sign in to your Grainy Palace Farms partner account or apply to join our farmer, buyer and supplier network.",
};

const portalBenefits = [
  { icon: BadgeCheck, title: "Partner pricing", body: "Access your assigned tier and eligible bulk pricing." },
  { icon: PackageCheck, title: "Order tracking", body: "Review order history and follow delivery status." },
  { icon: FileText, title: "Invoices on hand", body: "Find and download invoices for your orders." },
  { icon: ShieldCheck, title: "Product assurance", body: "Access available Certificates of Analysis for ordered products." },
];

export default async function PartnersPage({ searchParams }: { searchParams: Promise<{ pending?: string }> }) {
  const { pending } = await searchParams;

  return (
    <div className="pb-16">
      <section className="bg-forest-950 text-forest-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <PageHeroImage slug="partners" className="mb-8" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">Grainy Palace Farms</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">Partner Portal</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-forest-100">One place for approved partners to manage purchasing, orders and product documentation.</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-14">
        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-700">Your business, in view</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold">A clearer way to buy from the farm</h2>
            <p className="mt-3 max-w-xl leading-7 text-muted-foreground">Approved wholesale partners get tools to make repeat orders and manage their relationship with Grainy Palace Farms.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {portalBenefits.map(({ icon: Icon, title, body }) => <div key={title} className="rounded-xl border border-border bg-card p-5"><span className="flex size-10 items-center justify-center rounded-lg bg-forest-100 text-forest-800"><Icon className="size-5" /></span><h3 className="mt-3 font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p></div>)}
          </div>
          <div className="rounded-xl border border-forest-800/15 bg-forest-50 p-5 dark:bg-forest-950/40">
            <h3 className="font-heading text-lg font-semibold">Not a portal partner yet?</h3>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">Farmers, buyers, offtakers, suppliers and food businesses can apply to join the network.</p>
            <Button asChild className="mt-4 gap-2"><Link href="/partnerships#apply">Explore partnership options <ArrowRight className="size-4" /></Link></Button>
          </div>
        </div>

        <div className="lg:pt-2">
          {pending && <p role="status" className="mb-4 rounded-md bg-gold-100 px-3 py-2 text-sm text-charcoal dark:bg-gold-900/40 dark:text-gold-100">Your application is awaiting review. Our team will contact you with next steps.</p>}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-700">Welcome back</span>
            <h2 className="mb-5 mt-2 font-heading text-2xl font-semibold">Partner sign in</h2>
            <LoginForm next="/partners/dashboard" signupHref="/signup" />
            <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">Portal access is available to approved Grainy Palace Farms partners.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
