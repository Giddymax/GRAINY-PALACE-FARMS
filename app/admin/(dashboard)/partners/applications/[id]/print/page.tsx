import { notFound } from "next/navigation";
import { LogoMark } from "@/components/brand/logo-mark";
import { PrintApplicationButton } from "@/components/admin/print-application-button";
import { requireStaff } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Partner Application — Print" };

export default async function PrintPartnerApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const supabase = await createClient();
  const { data: application } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("id", id)
    .like("notes", "Partner type:%")
    .maybeSingle();

  if (!application) notFound();

  const partnerType = application.notes?.match(/^Partner type: (.+)$/m)?.[1] ?? "Partner";
  const location = application.notes?.match(/^Location: (.+)$/m)?.[1];
  const registration = application.notes?.match(/^Business \/ cooperative registration: (.+)$/m)?.[1];
  const details = application.notes?.match(/^Partnership details: ([\s\S]*)$/m)?.[1];
  const fields = [
    { label: "Applicant type", value: partnerType },
    { label: "Contact person", value: application.name },
    { label: "Farm, business or organisation", value: application.company },
    { label: "Phone / WhatsApp", value: application.phone },
    { label: "Email address", value: application.email },
    { label: "Town and region", value: location },
    { label: "Business / cooperative registration", value: registration },
    { label: "Products, produce or services", value: application.product_or_service },
    { label: "Typical acreage, volume or capacity", value: application.quantity },
    { label: "Preferred start", value: application.timeline },
  ].filter((field): field is { label: string; value: string } => typeof field.value === "string" && field.value.length > 0);

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8 sm:px-6 print:bg-white print:p-0">
      <style>{`@media print { @page { size: A4; margin: 14mm; } body { background: #fff !important; } .application-sheet { width: 100% !important; max-width: none !important; min-height: auto !important; margin: 0 !important; padding: 0 !important; border: 0 !important; box-shadow: none !important; } .no-print { display: none !important; } }`}</style>
      <div className="no-print mx-auto mb-4 flex max-w-4xl items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Use your browser&apos;s print dialog to print or save this application as a PDF.</p>
        <PrintApplicationButton />
      </div>
      <article className="application-sheet relative mx-auto min-h-[1000px] max-w-4xl overflow-hidden rounded-2xl border border-border bg-white p-8 text-slate-900 shadow-sm sm:p-12 print:min-h-0 print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.055]">
          <LogoMark className="!size-[25rem] max-w-none" />
        </div>
        <div className="relative z-10">
          <header className="flex items-center justify-between gap-6 border-b-2 border-forest-900 pb-6">
            <div className="flex items-center gap-4">
              <LogoMark className="!size-20 sm:!size-24" />
              <div>
                <p className="font-heading text-xl font-bold uppercase tracking-wide text-forest-950 sm:text-2xl">Grainy Palace Farms</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-forest-800">Partner network application</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p className="font-semibold uppercase tracking-wider">Staff review copy</p>
              <p className="mt-1">Submitted {formatDate(application.created_at)}</p>
            </div>
          </header>

          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-800">Application summary</p>
              <h1 className="mt-2 font-heading text-3xl font-bold">{application.name}</h1>
              <p className="mt-2 inline-flex rounded-full border border-forest-800/20 bg-forest-50 px-3 py-1 text-sm font-semibold text-forest-900">{partnerType}</p>
            </div>
            <div className="rounded-lg border border-slate-200 px-4 py-3 text-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500">Application status</p>
              <p className="mt-1 font-semibold capitalize">{application.status}</p>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-[0.16em] text-forest-900">Applicant information</h2>
            <dl className="mt-2 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {fields.map(({ label, value }) => (
                <div key={label} className="border-b border-slate-100 py-3">
                  <dt className="text-xs font-medium text-slate-500">{label}</dt>
                  <dd className="mt-1 whitespace-pre-wrap break-words text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {details && (
            <section className="mt-8">
              <h2 className="border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-[0.16em] text-forest-900">Partnership details</h2>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{details}</p>
            </section>
          )}

          <footer className="mt-12 border-t border-slate-200 pt-4 text-xs text-slate-500">
            <div className="flex flex-wrap justify-between gap-3">
              <span>Grainy Palace Farms · Partner Network</span>
              <span>Application ID: {application.id}</span>
            </div>
          </footer>
        </div>
      </article>
    </main>
  );
}
