import { requirePartner } from "@/lib/auth/require-role";

export default async function PartnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative check: signed in, role='partner', and partners.approved.
  await requirePartner();

  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</div>;
}
