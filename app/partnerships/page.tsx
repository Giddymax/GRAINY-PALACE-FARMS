import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Handshake, Leaf, PackageCheck, Sprout, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerApplicationForm } from "@/components/forms/partner-application-form";
import { PageHeroImage } from "@/components/layout/page-hero-image";

export const metadata: Metadata = {
  title: "Partner With Grainy Palace Farms",
  description: "Apply to work with Grainy Palace Farms as a farmer, buyer, offtaker, supplier, retailer or food business.",
};

const partnerGroups = [
  { icon: Sprout, title: "Farmers & cooperatives", body: "Grow with us, share your harvest plans and explore dependable market access." },
  { icon: Store, title: "Clients & offtakers", body: "Source traceable Ghanaian produce for your shop, kitchen, factory or organisation." },
  { icon: Truck, title: "Suppliers & distributors", body: "Bring useful inputs, services and distribution capacity into our food network." },
  { icon: PackageCheck, title: "Processors & institutions", body: "Build a reliable supply relationship around your products and requirements." },
];

const steps = [
  { number: "01", title: "Tell us about you", body: "Choose your partner type and share your contact, location and supply or buying needs." },
  { number: "02", title: "Our team reviews it", body: "We’ll contact you to clarify details and understand whether there’s a good fit." },
  { number: "03", title: "Plan the next step", body: "Together, we can discuss a farm visit, sample, supply plan or commercial terms." },
];

export default function PartnershipsPage() {
  return (
    <div className="pb-20">
      <section className="relative isolate overflow-hidden bg-forest-950 text-forest-50">
        <div className="absolute inset-0 -z-10 opacity-35 [&>div]:!mb-0 [&>div]:!h-full [&>div]:!w-full [&>div]:!aspect-auto [&>div]:!rounded-none [&>div]:!shadow-none [&>div]:!ring-0"><PageHeroImage slug="partnerships" /></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950 via-forest-950/95 to-forest-950/65" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-300/40 bg-gold-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-200"><Handshake className="size-4" /> Grainy Palace Farm Network</span>
            <h1 className="mt-6 max-w-3xl font-heading text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Good food grows through <span className="text-gold-300">good partnerships.</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-forest-100 sm:text-lg">We connect farmers, buyers and suppliers to build a dependable, traceable food supply across Ghana. Tell us what you do and what you’re looking for.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2"><a href="#apply">Start your application <ArrowRight className="size-4" /></a></Button>
              <Button asChild size="lg" variant="outline" className="border-forest-100/40 bg-transparent text-forest-50 hover:bg-forest-50/10 hover:text-white"><Link href="/partners">Partner portal sign in</Link></Button>
            </div>
          </div>
          <div className="rounded-2xl border border-forest-100/15 bg-forest-900/70 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">A network built on trust</p>
            <div className="mt-5 space-y-5">
              <div className="flex gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold-300/10 text-gold-300"><Leaf className="size-5" /></span><div><h2 className="font-semibold">Rooted in local agriculture</h2><p className="mt-1 text-sm leading-6 text-forest-100">Work with Ghanaian farmers and locally grown food.</p></div></div>
              <div className="flex gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold-300/10 text-gold-300"><PackageCheck className="size-5" /></span><div><h2 className="font-semibold">Traceable supply</h2><p className="mt-1 text-sm leading-6 text-forest-100">Build on product quality, food safety and clear sourcing.</p></div></div>
              <div className="flex gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold-300/10 text-gold-300"><Handshake className="size-5" /></span><div><h2 className="font-semibold">Relationships that grow</h2><p className="mt-1 text-sm leading-6 text-forest-100">Start a conversation shaped around what your business or farm needs.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-700">Who we work with</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold">A place for every part of the food chain</h2>
          <p className="mt-3 leading-7 text-muted-foreground">Whether you grow, buy, process or supply, there’s a simple way to introduce your work and explore a fit.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {partnerGroups.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-forest-700/40 hover:bg-forest-50/30">
              <span className="flex size-11 items-center justify-center rounded-xl bg-forest-100 text-forest-800"><Icon className="size-5" /></span>
              <h3 className="mt-4 font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-forest-50 p-6 dark:bg-forest-950/40 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-700">What happens next</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {steps.map((step) => <div key={step.number} className="border-t border-forest-700/20 pt-4"><span className="font-mono text-sm font-semibold text-gold-700">{step.number}</span><h3 className="mt-2 font-heading text-lg font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p></div>)}
          </div>
        </div>
      </section>

      <section id="apply" className="mx-auto grid max-w-7xl scroll-mt-24 gap-10 px-4 pt-16 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-700">Start here</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold">Let’s find a way to work together.</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Complete the short application. Required fields are marked. If you’re an individual farmer, you can leave the business name and registration blank.</p>
          <div className="mt-6 rounded-xl border border-border bg-card p-4 text-sm leading-6">
            <p className="font-semibold">Already approved as a portal partner?</p>
            <p className="mt-1 text-muted-foreground">Sign in to manage your orders and account.</p>
            <Link href="/partners" className="mt-3 inline-flex items-center gap-1 font-medium text-forest-800 underline underline-offset-4">Go to partner sign in <ArrowRight className="size-4" /></Link>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
          <PartnerApplicationForm />
        </div>
      </section>
    </div>
  );
}
