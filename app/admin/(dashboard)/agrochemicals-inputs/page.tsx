import { requireStaff } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import { AgrochemicalsInputsForm } from "@/components/admin/agrochemicals-inputs-form";
import { agrochemicalsInputsDefaults } from "@/lib/agrochemicals-inputs-content";
import { PageHeroFormDialog } from "@/components/admin/page-hero-form-dialog";

export const metadata = { title: "Agrochemicals & Farm Inputs — Admin" };

export default async function AdminAgrochemicalsInputsPage() {
  await requireStaff();
  const supabase = await createClient();
  const [{ data }, { data: hero }] = await Promise.all([
    supabase.from("site_content").select("key, value").eq("section", "agrochemicals_inputs"),
    supabase.from("page_heroes").select("*").eq("page_slug", "agrochemicals-inputs").maybeSingle(),
  ]);
  const values = { ...agrochemicalsInputsDefaults };
  for (const row of data ?? []) {
    if (row.value !== null) values[row.key] = row.value;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-heading text-2xl font-semibold">Agrochemicals &amp; Farm Inputs</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Edit the public page copy, range cards, buttons, and SEO metadata.
      </p>
      <section className="mb-6 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold">Page banner image</h2>
            <p className="text-sm text-muted-foreground">Manage the image displayed above the page content.</p>
          </div>
          <PageHeroFormDialog slug="agrochemicals-inputs" label="Agrochemicals & Farm Inputs" hero={hero} />
        </div>
      </section>
      <div className="rounded-xl border border-border bg-card p-5">
        <AgrochemicalsInputsForm values={values} />
      </div>
    </div>
  );
}
