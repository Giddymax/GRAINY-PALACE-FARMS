import { requireStaff } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import { FooterContentForm } from "@/components/admin/footer-content-form";
import { footerDefaultValues, getFooterCollections } from "@/lib/footer-content";

export const metadata = { title: "Footer Content — Admin" };

export default async function AdminFooterPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("key, value")
    .eq("section", "footer");
  const values = { ...footerDefaultValues };
  for (const row of data ?? []) {
    if (row.value !== null) values[row.key] = row.value;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-heading text-2xl font-semibold">Footer content</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Edit the footer description, contact details, headings, and every displayed link label and destination.
      </p>
      <FooterContentForm values={values} initialCollections={getFooterCollections(values)} />
    </div>
  );
}
