import type { Metadata } from "next";
import Link from "next/link";
import { Sprout, Beef, Fish, Package, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "Grainy Palace Farm's four pillars of sustainability: agriculture, livestock, aquaculture and packaging — plus our community commitment.",
};

const pillars = [
  {
    icon: Sprout,
    title: "Agricultural sustainability",
    body: "We practice crop rotation and cover cropping to protect soil health across our grain and vegetable plots, and are steadily increasing the share of our catalogue grown to organic standards. Crop residue that would otherwise be burned — maize stover, cassava peel, groundnut husks — is dried and blended into livestock feed instead.",
  },
  {
    icon: Beef,
    title: "Livestock sustainability",
    body: "Our poultry and small ruminants are raised with welfare-first stocking densities and an antibiotic stewardship policy: no routine use for growth promotion, treatment reserved for diagnosed illness under veterinary guidance. Manure is composted on-site into organic fertiliser rather than left to run off.",
  },
  {
    icon: Fish,
    title: "Aquaculture sustainability",
    body: "Our tilapia and catfish ponds are part of a closed-loop system: nutrient-rich pond water periodically irrigates adjacent crop plots instead of being discharged untreated, and we monitor water quality on a rolling schedule through our own Lab Services team.",
  },
  {
    icon: Package,
    title: "Packaging sustainability",
    body: "Ghana's 2021 Plastics Levy was a turning point for our packaging strategy. We pack dry goods in biodegradable or reusable woven bags wherever the product allows, and are phasing out single-use plastic sachets across our processed food lines.",
  },
];

export default function SustainabilityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">Sustainability</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          A circular, zero-waste model built around four pillars — and a
          standing commitment to the communities we farm alongside.
        </p>
      </div>

      <div className="mb-16 grid gap-6 sm:grid-cols-2">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="rounded-xl border border-border bg-card p-6">
            <pillar.icon className="mb-3 size-7 text-forest-600" />
            <h2 className="mb-2 font-heading text-lg font-semibold">{pillar.title}</h2>
            <p className="text-sm text-muted-foreground">{pillar.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-forest-50 p-8 text-center dark:bg-forest-950/40">
        <Heart className="mx-auto mb-3 size-8 text-gold-500" />
        <h2 className="mb-2 font-heading text-xl font-semibold">
          Our 2% community commitment
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
          We commit 2% of profits to the communities where we farm —
          supporting nutrition and food-safety outreach, and prioritising
          local and youth hiring for farmhand, logistics and lab roles. Read
          about a recent outreach day on our{" "}
          <Link href="/news" className="underline">
            News &amp; Events
          </Link>{" "}
          page.
        </p>
      </div>
    </div>
  );
}
