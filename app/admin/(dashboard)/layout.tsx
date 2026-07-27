import { requireStaff } from "@/lib/auth/require-role";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative role check (proxy.ts only did an optimistic auth-presence
  // check). The admin shell/sidebar (nav by role) lands in Phase 6.
  await requireStaff();

  return <div className="min-h-screen bg-muted/30">{children}</div>;
}
