import { requirePartner } from "@/lib/auth/require-role";

export const metadata = { title: "Partner Dashboard" };

export default async function PartnerDashboardPage() {
  const { partner } = await requirePartner();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">
        {partner.business_name}
      </h1>
      <p className="mt-1 text-muted-foreground">
        Tier: <span className="font-medium capitalize">{partner.tier}</span>.
        Bulk pricing, order history, and CoA downloads are built out in a
        later phase of this project.
      </p>
    </div>
  );
}
