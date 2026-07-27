import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Sprout } from "lucide-react";
import { getOpenJobs } from "@/lib/data/misc";
import { JobApplicationForm } from "@/components/forms/job-application-form";
import { OutgrowerForm } from "@/components/forms/outgrower-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Careers & Outgrowers",
  description:
    "Open roles at Grainy Palace Farm and our outgrower scheme for contract farmers — certified seeds, training and a fair, fixed offtake price.",
};

export default async function CareersPage() {
  const jobs = await getOpenJobs();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
          Careers &amp; Outgrowers
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          We&apos;re an equal-opportunity employer committed to hiring from
          the youth and communities where we farm. We also grow alongside
          independent smallholders through our outgrower scheme.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="mb-6 flex items-center gap-2 font-heading text-xl font-semibold">
          <Briefcase className="size-5 text-forest-600" /> Open roles
        </h2>
        {jobs.length === 0 ? (
          <p className="text-muted-foreground">
            No open roles right now — check back soon, or apply to our
            outgrower scheme below.
          </p>
        ) : (
          <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-4">
            {jobs.map((job) => (
              <AccordionItem key={job.id} value={job.id}>
                <AccordionTrigger>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">{job.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {job.department} · {job.location}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4 text-sm text-muted-foreground">{job.description}</p>
                  <JobApplicationForm openingId={job.id} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-xl font-semibold">
          <Sprout className="size-5 text-forest-600" /> Outgrower scheme
        </h2>
        <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
          Grow maize, soybean or sorghum alongside us as a contract farmer.
          We provide certified seed on credit, agronomy training and a
          fixed offtake price agreed before planting — read more on our{" "}
          <Link href="/articles/contract-farming-explained-how-our-outgrower-scheme-works" className="underline">
            Knowledge Hub
          </Link>
          .
        </p>
        <OutgrowerForm />
      </section>
    </div>
  );
}
