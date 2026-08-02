import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { PageHeroImage } from "@/components/layout/page-hero-image";
import { getCertifications, getGalleryItems } from "@/lib/data/misc";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Grainy Palace Farms Limited's story, mission, vision, core values and certifications — a Ghanaian integrated agribusiness across crops, livestock, aquaculture and processing.",
};

const coreValues = [
  { title: "Integrity", body: "We sell what we say it is — traceable, tested, and honestly priced." },
  { title: "Excellence", body: "From field to fork, we hold every stage of production to a certified standard." },
  { title: "Sustainability", body: "A circular farm model that protects the land we depend on." },
  { title: "Community", body: "We hire locally, train outgrowers, and reinvest in the communities we farm alongside." },
];

export default async function AboutPage() {
  const [certifications, gallery] = await Promise.all([
    getCertifications(),
    getGalleryItems(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeroImage slug="about" />
      <div className="mb-12 text-center">
        <Image
          src="/brand/grainy-palace-farms-seal.png"
          alt="Grainy Palace Farms heritage seal"
          width={96}
          height={96}
          className="mx-auto mb-4 rounded-full"
        />
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
          About Grainy Palace Farms
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          {siteConfig.tagline}
        </p>
      </div>

      <section className="mb-12">
        <h2 className="mb-3 font-heading text-xl font-semibold">Our story</h2>
        <p className="text-muted-foreground">
          Grainy Palace Farms Limited was built as an integrated agribusiness
          spanning the full value chain — grains and vegetables, poultry and
          livestock, fish and aquaculture, tree seedlings, and processed
          foods — based in Greater Accra with operations extending into
          Ashanti Region. Rather than specialising in one product line, we
          deliberately built a circular system where each part of the farm
          feeds another: pond water irrigates our fields, crop residue
          feeds our livestock, and manure returns to the soil as compost.
        </p>
      </section>

      <section className="mb-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-2 font-heading text-lg font-semibold">Mission</h2>
          <p className="text-sm text-muted-foreground">
            To supply Ghanaian households and businesses with certified,
            traceable food from field to fork — grown, raised and processed
            to the highest safety standard we can hold ourselves to.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-2 font-heading text-lg font-semibold">Vision</h2>
          <p className="text-sm text-muted-foreground">
            To be West Africa&apos;s most trusted integrated agribusiness —
            proving that scale, sustainability and food safety can grow
            together.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-heading text-xl font-semibold">Core values</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {coreValues.map((v) => (
            <div key={v.title} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-3 font-heading text-xl font-semibold">Ownership &amp; governance</h2>
        <p className="text-muted-foreground">
          Grainy Palace Farms Limited is a privately-held Ghanaian limited
          liability company, registered and operating under Ghanaian
          agribusiness regulation. Our operations are overseen by a small
          management team across crop production, livestock, aquaculture,
          processing and quality assurance, each accountable to our
          food-safety and environmental compliance standards.
        </p>
      </section>

      {certifications.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 font-heading text-xl font-semibold">Certifications</h2>
          <div className="flex flex-wrap gap-3">
            {certifications.map((cert) => (
              <span
                key={cert.id}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm"
              >
                <ShieldCheck className="size-4 text-forest-600" />
                {cert.name}
                {cert.status === "pending" && (
                  <span className="text-xs text-muted-foreground">(in progress)</span>
                )}
              </span>
            ))}
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold">Farm gallery</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((item) => (
              <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image src={item.image_url} alt={item.title ?? ""} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
