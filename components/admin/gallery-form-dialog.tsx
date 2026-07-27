"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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
import { saveGalleryItemAction } from "@/lib/actions/admin/content";
import { toast } from "sonner";

export function GalleryFormDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await saveGalleryItemAction(formData);
      toast.success("Gallery item added");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 size-4" /> Add photo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add gallery photo</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <ImageUpload name="imageUrl" folder="gallery" label="Photo" />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gal-title">Caption (optional)</Label>
            <Input id="gal-title" name="title" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gal-category">Category (optional)</Label>
            <Input id="gal-category" name="category" placeholder="e.g. livestock, crops, fish" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding…" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
