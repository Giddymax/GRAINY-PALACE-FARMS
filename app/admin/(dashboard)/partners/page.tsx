import { requireStaff } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreatePartnerDialog } from "@/components/admin/create-partner-dialog";
import { PartnerTierSelect } from "@/components/admin/partner-tier-select";
import { PartnerApprovalButtons } from "@/components/admin/partner-approval-buttons";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Partners — Admin" };

export default async function AdminPartnersPage() {
  await requireStaff();
  const supabase = await createClient();

  const { data: partners } = await supabase
    .from("partners")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: applications } = await supabase
    .from("quote_requests")
    .select("*")
    .like("notes", "Partner type:%")
    .order("created_at", { ascending: false });

  const profileIds = (partners ?? []).map((p) => p.profile_id);
  const { data: profiles } =
    profileIds.length > 0
      ? await supabase.from("profiles").select("id, email, full_name").in("id", profileIds)
      : { data: [] };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Partners</h1>
          <p className="text-sm text-muted-foreground">
            B2B accounts for supermarkets, hotels, processors and exporters.
          </p>
        </div>
        <CreatePartnerDialog />
      </div>

      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-semibold">Partner applications</h2>
            <p className="text-sm text-muted-foreground">New applications from farmers, buyers, offtakers, suppliers and other partners.</p>
          </div>
          <Badge variant="outline">{applications?.length ?? 0} total</Badge>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Partner type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Interest / capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Printable form</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(applications ?? []).map((application) => {
                const partnerType = application.notes?.match(/^Partner type: (.+)$/m)?.[1] ?? "Partner";
                return (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {application.name}
                      {application.company && <span className="block text-xs font-normal text-muted-foreground">{application.company}</span>}
                    </TableCell>
                    <TableCell><Badge variant="outline">{partnerType}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <span className="block">{application.phone}</span>
                      {application.email && <span className="block">{application.email}</span>}
                    </TableCell>
                    <TableCell className="max-w-xs text-sm">
                      <span className="block">{application.product_or_service ?? "—"}</span>
                      {application.quantity && <span className="mt-1 block text-xs text-muted-foreground">{application.quantity}</span>}
                    </TableCell>
                    <TableCell><Badge variant={application.status === "new" ? "default" : "outline"} className="capitalize">{application.status}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(application.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <a href={`/admin/partners/applications/${application.id}/print`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-forest-800 underline underline-offset-4">
                        View / print PDF
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
              {(!applications || applications.length === 0) && (
                <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No partner applications yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Since</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(partners ?? []).map((partner) => {
              const profile = (profiles ?? []).find((p) => p.id === partner.profile_id);
              return (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">
                    {partner.business_name}
                    {partner.business_type && (
                      <span className="ml-1 text-xs text-muted-foreground">({partner.business_type})</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {profile?.full_name ?? profile?.email ?? "—"}
                  </TableCell>
                  <TableCell>
                    <PartnerTierSelect id={partner.id} tier={partner.tier} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={partner.approved ? "default" : "outline"}>
                      {partner.approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(partner.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <PartnerApprovalButtons id={partner.id} approved={partner.approved} />
                  </TableCell>
                </TableRow>
              );
            })}
            {(!partners || partners.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No partner accounts yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
