import type { Metadata } from "next";
import { FlaskConical, CheckCircle2, Clock, Search, FileDown } from "lucide-react";
import { LabSampleForm } from "@/components/forms/lab-sample-form";
import { Button } from "@/components/ui/button";
import { lookupLabSample } from "@/lib/data/misc";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Lab Services",
  description:
    "Food-safety testing for chemical residue, microbiological safety, nutrition, water quality and shelf-life — submit a sample and track results online.",
};

const testingMenu = [
  { name: "Chemical residue analysis", price: "From ₵350", turnaround: "5–7 working days" },
  { name: "Microbiological testing", price: "From ₵250", turnaround: "3–5 working days" },
  { name: "Nutritional analysis", price: "From ₵400", turnaround: "7–10 working days" },
  { name: "Water quality testing", price: "From ₵200", turnaround: "3–5 working days" },
  { name: "Shelf-life assessment", price: "From ₵500", turnaround: "Varies by product" },
];

export default async function LabServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const result = ref ? await lookupLabSample(ref) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <FlaskConical className="mx-auto mb-3 size-10 text-forest-600" />
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">Lab Services</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Independent food-safety testing for producers, processors and
          exporters — the same lab that certifies our own produce.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="mb-4 font-heading text-xl font-semibold">Testing menu</h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Test</th>
                <th className="px-4 py-3 font-medium">Indicative price</th>
                <th className="px-4 py-3 font-medium">Turnaround</th>
              </tr>
            </thead>
            <tbody>
              {testingMenu.map((t) => (
                <tr key={t.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3">{t.price}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <Clock className="mr-1 inline size-3.5" /> {t.turnaround}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Final pricing depends on sample volume and test combination —
          submit a sample below for an exact quote.
        </p>
      </section>

      <div className="grid gap-10 md:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">Submit a sample</h2>
          <LabSampleForm />
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
            <Search className="size-5" /> Results tracker
          </h2>
          <form className="flex gap-2" method="get">
            <input
              type="text"
              name="ref"
              defaultValue={ref}
              placeholder="e.g. LAB260727-A1B2"
              className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm"
            />
            <Button type="submit">Look up</Button>
          </form>

          {ref && !result && (
            <p className="mt-4 text-sm text-muted-foreground">
              No sample found for reference &quot;{ref}&quot;. Please check
              and try again.
            </p>
          )}

          {result && (
            <div className="mt-4 flex flex-col gap-2 rounded-lg border border-border p-4 text-sm">
              <p><span className="font-medium">Reference:</span> {result.reference}</p>
              <p><span className="font-medium">Sample type:</span> {result.sample_type}</p>
              <p className="flex items-center gap-1.5">
                <span className="font-medium">Status:</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-2 py-0.5 text-xs font-medium capitalize text-forest-800 dark:bg-forest-900/50 dark:text-forest-200">
                  <CheckCircle2 className="size-3" /> {result.status}
                </span>
              </p>
              <p><span className="font-medium">Submitted:</span> {formatDate(result.submitted_at)}</p>
              {result.completed_at && (
                <p><span className="font-medium">Completed:</span> {formatDate(result.completed_at)}</p>
              )}
              {result.status === "complete" && result.coa_url && (
                <Button asChild size="sm" className="mt-2 w-fit">
                  <a href={result.coa_url} target="_blank" rel="noopener noreferrer">
                    <FileDown className="mr-1 size-4" /> Download CoA
                  </a>
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
