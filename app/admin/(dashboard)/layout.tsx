import { requireStaff } from "@/lib/auth/require-role";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { filterNavForRole } from "@/lib/admin-nav";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative role check (proxy.ts only did an optimistic auth-presence
  // check).
  const profile = await requireStaff();
  const groups = filterNavForRole(profile.role);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar groups={groups} userLabel={profile.full_name ?? profile.email} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
