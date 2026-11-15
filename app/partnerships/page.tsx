import type { Metadata } from "next";
import Link from "next/link";
import { OutgrowerForm } from "@/components/forms/outgrower-form";
import { WholesaleQuoteForm } from "@/components/forms/wholesale-quote-form";
import { PageHeroImage } from "@/components/layout/page-hero-image";

export const metadata: Metadata = {
  title: "Join Our Farm Network",
  description:
    "Sign up as a Grainy Palace Farms outgrower, produce offtaker or farmer cooperative in Ghana.",
};

const options = [
  { id: "outgrowers", title: "Outgrowers", body: "Grow with our contract farming programme, with agronomy support and an agreed offtake plan." },
  { id: "offtakers", title: "Offtakers", body: "Register your interest in sourcing reliable volumes of farm produce from our network." },
  { id: "cooperatives", title: "Farmer cooperatives", body: "Connect your cooperative with our production, training and market opportunities." },
];

export default function PartnershipsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeroImage slug="partnerships" />
      <header className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">Join Our Farm Network</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Grainy Palace Farms works with farmers and buyers to grow dependable local food supply. Choose how you would like to work with us.
        </p>
      </header>

      <nav aria-label="Sign-up options" className="mb-12 grid gap-4 md:grid-cols-3">
        {options.map((option) => (
          <a key={option.id} href={`#${option.id}`} className="rounded-xl border border-border bg-card p-5 hover:border-forest-600">
            <h2 className="font-heading text-lg font-semibold">{option.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{option.body}</p>
            <span className="mt-4 inline-block text-sm font-medium text-forest-700">Sign up ↓</span>
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-8">
        <section id="outgrowers" className="scroll-mt-24 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-2 font-heading text-xl font-semibold">Outgrower sign-up</h2>
          <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
            Tell us about your farm, location and crops. You can also read about the <Link className="underline" href="/articles/contract-farming-explained-how-our-outgrower-scheme-works">outgrower scheme</Link>.
          </p>
          <OutgrowerForm />
        </section>

        <section id="offtakers" className="scroll-mt-24 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-2 font-heading text-xl font-semibold">Offtaker sign-up</h2>
          <p className="mb-6 max-w-2xl text-sm text-muted-foreground">Share what produce you are interested in buying and your expected volumes.</p>
          <WholesaleQuoteForm defaultRequestType="bulk" submitLabel="Register as an offtaker" />
        </section>

        <section id="cooperatives" className="scroll-mt-24 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-2 font-heading text-xl font-semibold">Farmer cooperative sign-up</h2>
          <p className="mb-6 max-w-2xl text-sm text-muted-foreground">Register your cooperative and tell us about your membership, location and crops.</p>
          <WholesaleQuoteForm defaultRequestType="general" submitLabel="Register your cooperative" />
        </section>
      </div>
    </div>
  );
}
