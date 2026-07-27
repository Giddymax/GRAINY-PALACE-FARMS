"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import { saveHeroSlideAction } from "@/lib/actions/admin/content";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/database.types";

type HeroSlide = Database["public"]["Tables"]["hero_slides"]["Row"];

export function HeroSlideFormDialog({ slide }: { slide?: HeroSlide }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await saveHeroSlideAction(formData);
      toast.success(slide ? "Slide updated" : "Slide created");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {slide ? (
          <Button size="icon-sm" variant="ghost" aria-label="Edit slide">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-1 size-4" /> New slide
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{slide ? "Edit hero slide" : "New hero slide"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          {slide && <input type="hidden" name="id" value={slide.id} />}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hs-title">Title</Label>
            <Input id="hs-title" name="title" required defaultValue={slide?.title} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hs-subtitle">Subtitle</Label>
            <Input id="hs-subtitle" name="subtitle" defaultValue={slide?.subtitle ?? ""} />
          </div>
          <ImageUpload name="imageUrl" folder="hero" defaultValue={slide?.image_url} label="Image (optional)" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hs-cta-label">CTA label</Label>
              <Input id="hs-cta-label" name="ctaLabel" defaultValue={slide?.cta_label ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hs-cta-href">CTA link</Label>
              <Input id="hs-cta-href" name="ctaHref" defaultValue={slide?.cta_href ?? ""} placeholder="/shop" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hs-sort">Sort order</Label>
            <Input id="hs-sort" name="sortOrder" type="number" defaultValue={slide?.sort_order ?? 0} />
          </div>
          <label className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Active</span>
            <Switch name="isActive" defaultChecked={slide?.is_active ?? true} />
          </label>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
