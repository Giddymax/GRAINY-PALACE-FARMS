import type { Metadata } from "next";
import Link from "next/link";
import { QrCode, ShieldCheck, MapPin, Calendar, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lookupTraceabilityBatch } from "@/lib/data/misc";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Traceability Lookup",
  description:
    "Scan the QR code on your Grainy Palace Farm pack or enter the batch code to see its origin, certifications and Certificate of Analysis.",
};

export default async function TraceabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const batch = code ? await lookupTraceabilityBatch(code) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <QrCode className="mx-auto mb-3 size-10 text-forest-600" />
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
          Traceability Lookup
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Scan the QR code printed on your pack, or enter the batch code
          below, to see exactly where your food came from.
        </p>
      </div>

      <form className="mb-8 flex gap-2" method="get">
        <input
          type="text"
          name="code"
          defaultValue={code}
          placeholder="e.g. GPF-TL-2607"
          className="h-11 flex-1 rounded-md border border-border bg-background px-3 text-sm"
        />
        <Button type="submit" size="lg">Look up</Button>
      </form>

      {code && !batch && (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
          No batch found for code &quot;{code}&quot;. Double-check the code
          printed on your pack.
        </p>
      )}

      {batch && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-xl font-semibold">
            {batch.product?.name ?? "Product"}
          </h2>
          <p className="mt-1 font-mono text-sm text-muted-foreground">{batch.batch_code}</p>

          <dl className="mt-4 flex flex-col gap-3 text-sm">
            {batch.origin && (
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-forest-600" />
                <div>
                  <dt className="font-medium">Origin</dt>
                  <dd className="text-muted-foreground">{batch.origin}</dd>
                </div>
              </div>
            )}
            {batch.harvest_date && (
              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 size-4 shrink-0 text-forest-600" />
                <div>
                  <dt className="font-medium">Harvest / production date</dt>
                  <dd className="text-muted-foreground">{formatDate(batch.harvest_date)}</dd>
                </div>
              </div>
            )}
            {batch.certifications.length > 0 && (
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-forest-600" />
                <div>
                  <dt className="font-medium">Certifications</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {batch.certifications.map((c) => (
                      <span key={c} className="rounded-full bg-forest-100 px-2 py-0.5 text-xs text-forest-800 dark:bg-forest-900/50 dark:text-forest-200">
                        {c}
                      </span>
                    ))}
                  </dd>
                </div>
              </div>
            )}
            {batch.notes && (
              <div>
                <dt className="font-medium">Notes</dt>
                <dd className="text-muted-foreground">{batch.notes}</dd>
              </div>
            )}
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            {batch.product && (
              <Button asChild variant="outline">
                <Link href={`/product/${batch.product.slug}`}>View product</Link>
              </Button>
            )}
            {batch.coa_url && (
              <Button asChild>
                <a href={batch.coa_url} target="_blank" rel="noopener noreferrer">
                  <FileDown className="mr-1 size-4" /> Download CoA
                </a>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
