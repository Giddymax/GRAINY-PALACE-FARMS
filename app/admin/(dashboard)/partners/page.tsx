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
