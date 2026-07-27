import Image from "next/image";
import { requireStaff } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import { SiteContentForm } from "@/components/admin/site-content-form";
import { HeroSlideFormDialog } from "@/components/admin/hero-slide-form-dialog";
import { GalleryFormDialog } from "@/components/admin/gallery-form-dialog";
import { EntityDeleteButton } from "@/components/admin/entity-delete-button";
import { deleteHeroSlideAction, deleteGalleryItemAction } from "@/lib/actions/admin/content";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Site Content — Admin" };

export default async function AdminContentPage() {
  await requireStaff();
  const supabase = await createClient();

  const [contentRes, slidesRes, galleryRes] = await Promise.all([
    supabase.from("site_content").select("*").order("section"),
    supabase.from("hero_slides").select("*").order("sort_order"),
    supabase.from("gallery_items").select("*").order("sort_order"),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-heading text-2xl font-semibold">Site content</h1>

      <section className="mb-10">
        <SiteContentForm rows={contentRes.data ?? []} />
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Hero slides</h2>
          <HeroSlideFormDialog />
        </div>
        <div className="flex flex-col gap-3">
          {(slidesRes.data ?? []).map((slide) => (
            <div key={slide.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
              <div>
                <p className="font-medium">{slide.title}</p>
                <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                {!slide.is_active && <Badge variant="outline" className="mt-1">Inactive</Badge>}
              </div>
              <div className="flex gap-1">
                <HeroSlideFormDialog slide={slide} />
                <EntityDeleteButton onDelete={() => deleteHeroSlideAction(slide.id)} />
              </div>
            </div>
          ))}
          {(slidesRes.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No hero slides yet.</p>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Farm gallery</h2>
          <GalleryFormDialog />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(galleryRes.data ?? []).map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image src={item.image_url} alt={item.title ?? ""} fill className="object-cover" />
              <div className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100">
                <EntityDeleteButton onDelete={() => deleteGalleryItemAction(item.id)} />
              </div>
            </div>
          ))}
          {(galleryRes.data ?? []).length === 0 && (
            <p className="col-span-full text-sm text-muted-foreground">No gallery photos yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
