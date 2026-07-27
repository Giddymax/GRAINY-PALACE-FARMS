import { requireStaff } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import { PosTerminal } from "@/components/admin/pos-terminal";

export const metadata = { title: "Point of Sale — Admin" };

export default async function PosPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-heading text-2xl font-semibold">Point of Sale</h1>
      <PosTerminal items={items ?? []} />
    </div>
  );
}
