"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";
import { saveCertificationAction } from "@/lib/actions/admin/certifications";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/database.types";

type Certification = Database["public"]["Tables"]["certifications"]["Row"];

export function CertificationFormDialog({ certification }: { certification?: Certification }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await saveCertificationAction(formData);
      toast.success(certification ? "Certification updated" : "Certification added");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {certification ? (
          <Button size="icon-sm" variant="ghost" aria-label="Edit certification">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-1 size-4" /> New certification
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{certification ? "Edit certification" : "New certification"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          {certification && <input type="hidden" name="id" value={certification.id} />}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cert-name">Name</Label>
            <Input id="cert-name" name="name" required defaultValue={certification?.name} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cert-issuer">Issuing body</Label>
            <Input id="cert-issuer" name="issuingBody" defaultValue={certification?.issuing_body ?? ""} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cert-status">Status</Label>
            <Select name="status" defaultValue={certification?.status ?? "active"}>
              <SelectTrigger id="cert-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ImageUpload name="badgeImage" folder="certifications" defaultValue={certification?.badge_image} label="Badge image (optional)" />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cert-sort">Sort order</Label>
            <Input id="cert-sort" name="sortOrder" type="number" defaultValue={certification?.sort_order ?? 0} />
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
