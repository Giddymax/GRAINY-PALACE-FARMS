import { requireAdmin } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StaffRoleSelect } from "@/components/admin/staff-role-select";
import { StaffActiveToggle } from "@/components/admin/staff-active-toggle";
import { InviteStaffDialog } from "@/components/admin/invite-staff-dialog";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Staff — Admin" };

export default async function AdminStaffPage() {
  const currentAdmin = await requireAdmin();
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Staff &amp; roles</h1>
          <p className="text-sm text-muted-foreground">Admin-only. Manage who can access /admin.</p>
        </div>
        <InviteStaffDialog />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(profiles ?? []).map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">{profile.full_name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{profile.email}</TableCell>
                <TableCell>
                  <StaffRoleSelect
                    profileId={profile.id}
                    role={profile.role}
                    disabled={profile.id === currentAdmin.id}
                  />
                </TableCell>
                <TableCell>
                  <StaffActiveToggle
                    profileId={profile.id}
                    isActive={profile.is_active}
                    disabled={profile.id === currentAdmin.id}
                  />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(profile.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Signed in as {currentAdmin.email}. You cannot deactivate your own account from here.
      </p>
    </div>
  );
}
