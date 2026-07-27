import { requireStaff } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusSelect } from "@/components/admin/status-select";
import { CoaUploadButton } from "@/components/admin/coa-upload-button";
import { CvDownloadLink } from "@/components/admin/cv-download-link";
import { formatDate } from "@/lib/format";
import {
  updateQuoteStatusAction,
  updateSubscriptionStatusAction,
  updateOutgrowerStatusAction,
  updateJobApplicationStatusAction,
  updateLabSampleStatusAction,
} from "@/lib/actions/admin/enquiries";

export const metadata = { title: "Enquiries — Admin" };

export default async function AdminEnquiriesPage() {
  await requireStaff();
  const supabase = await createClient();

  const [quotes, subscriptions, outgrowers, jobs, labSamples] = await Promise.all([
    supabase.from("quote_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("subscriptions").select("*").order("created_at", { ascending: false }),
    supabase.from("outgrower_applications").select("*").order("created_at", { ascending: false }),
    supabase.from("job_applications").select("*").order("created_at", { ascending: false }),
    supabase.from("lab_samples").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-heading text-2xl font-semibold">Enquiries</h1>

      <Tabs defaultValue="quotes">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="quotes">Quotes ({quotes.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions ({subscriptions.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="outgrowers">Outgrowers ({outgrowers.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="jobs">Jobs ({jobs.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="lab">Lab samples ({labSamples.data?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product/Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(quotes.data ?? []).map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.name}{q.company && ` (${q.company})`}</TableCell>
                    <TableCell className="text-muted-foreground">{q.phone}{q.email && ` · ${q.email}`}</TableCell>
                    <TableCell className="capitalize">{q.request_type.replace("_", " ")}</TableCell>
                    <TableCell className="max-w-xs truncate">{q.product_or_service ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(q.created_at)}</TableCell>
                    <TableCell>
                      <StatusSelect
                        id={q.id}
                        value={q.status}
                        options={["new", "contacted", "quoted", "closed"]}
                        onUpdate={(id, status) => updateQuoteStatusAction(id, status as never)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {(quotes.data ?? []).length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No quote requests yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(subscriptions.data ?? []).map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.customer_name}</TableCell>
                    <TableCell>{s.item}</TableCell>
                    <TableCell className="capitalize">{s.plan}</TableCell>
                    <TableCell>{s.quantity}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(s.created_at)}</TableCell>
                    <TableCell>
                      <StatusSelect
                        id={s.id}
                        value={s.status}
                        options={["new", "active", "paused", "cancelled"]}
                        onUpdate={(id, status) => updateSubscriptionStatusAction(id, status as never)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {(subscriptions.data ?? []).length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No subscriptions yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="outgrowers">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Crop</TableHead>
                  <TableHead>Land size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(outgrowers.data ?? []).map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.farmer_name}</TableCell>
                    <TableCell>{o.location}</TableCell>
                    <TableCell>{o.crop}</TableCell>
                    <TableCell>{o.land_size ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(o.created_at)}</TableCell>
                    <TableCell>
                      <StatusSelect
                        id={o.id}
                        value={o.status}
                        options={["new", "reviewing", "approved", "rejected"]}
                        onUpdate={(id, status) => updateOutgrowerStatusAction(id, status as never)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {(outgrowers.data ?? []).length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No outgrower applications yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>CV</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(jobs.data ?? []).map((j) => (
                  <TableRow key={j.id}>
                    <TableCell className="font-medium">{j.applicant_name}</TableCell>
                    <TableCell className="text-muted-foreground">{j.phone}{j.email && ` · ${j.email}`}</TableCell>
                    <TableCell>{j.cv_url ? <CvDownloadLink path={j.cv_url} /> : "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(j.created_at)}</TableCell>
                    <TableCell>
                      <StatusSelect
                        id={j.id}
                        value={j.status}
                        options={["new", "reviewing", "shortlisted", "rejected", "hired"]}
                        onUpdate={(id, status) => updateJobApplicationStatusAction(id, status as never)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {(jobs.data ?? []).length === 0 && (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No job applications yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="lab">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Sample type</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>CoA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(labSamples.data ?? []).map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono text-xs">{l.reference}</TableCell>
                    <TableCell>{l.client_name}</TableCell>
                    <TableCell>{l.sample_type}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{l.tests.join(", ")}</TableCell>
                    <TableCell>
                      <StatusSelect
                        id={l.id}
                        value={l.status}
                        options={["received", "testing", "complete"]}
                        onUpdate={(id, status) => updateLabSampleStatusAction(id, status as never)}
                      />
                    </TableCell>
                    <TableCell>
                      <CoaUploadButton labSampleId={l.id} hasCoa={Boolean(l.coa_url)} />
                    </TableCell>
                  </TableRow>
                ))}
                {(labSamples.data ?? []).length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No lab samples yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
