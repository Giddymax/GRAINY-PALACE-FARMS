"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import { savePageHeroAction } from "@/lib/actions/admin/content";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/database.types";

type PageHero = Database["public"]["Tables"]["page_heroes"]["Row"];

export function PageHeroFormDialog({
  slug,
  label,
  hero,
}: {
  slug: string;
  label: string;
  hero?: PageHero | null;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await savePageHeroAction(formData);
      toast.success(`${label} header saved`);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          {hero?.image_url ? <Pencil className="mr-1.5 size-4" /> : <ImageIcon className="mr-1.5 size-4" />}
          {hero?.image_url ? "Edit" : "Add image"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label} — page header</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="pageSlug" value={slug} />
          <ImageUpload
            name="imageUrl"
            folder="page-heroes"
            defaultValue={hero?.image_url}
            label="Banner image (leave empty to hide the banner)"
          />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`ph-title-${slug}`}>Internal label (not shown publicly yet)</Label>
            <Input
              id={`ph-title-${slug}`}
              name="title"
              defaultValue={hero?.title ?? label}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`ph-subtitle-${slug}`}>Note (optional)</Label>
            <Input id={`ph-subtitle-${slug}`} name="subtitle" defaultValue={hero?.subtitle ?? ""} />
          </div>
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
