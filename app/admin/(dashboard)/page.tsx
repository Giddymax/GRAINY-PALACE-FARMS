import { requireStaff } from "@/lib/auth/require-role";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const profile = await requireStaff();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-semibold">
        Welcome back, {profile.full_name ?? profile.email}
      </h1>
      <p className="mt-1 text-muted-foreground">
        The full dashboard (revenue, orders, low-stock alerts, enquiries) is
        built out in a later phase of this project.
      </p>
    </div>
  );
}
