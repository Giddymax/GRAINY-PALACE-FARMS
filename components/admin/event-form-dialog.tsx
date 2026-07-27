"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { saveEventAction } from "@/lib/actions/admin/events";
import { slugify } from "@/lib/validations/article";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase/database.types";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

export function EventFormDialog({ event }: { event?: EventRow }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [title, setTitle] = React.useState(event?.title ?? "");
  const [slug, setSlug] = React.useState(event?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(Boolean(event));

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await saveEventAction(formData);
      toast.success(event ? "Event updated" : "Event created");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {event ? (
          <Button size="icon-sm" variant="ghost" aria-label="Edit event">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-1 size-4" /> New event
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{event ? "Edit event" : "New event"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          {event && <input type="hidden" name="id" value={event.id} />}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ev-title">Title</Label>
            <Input
              id="ev-title"
              name="title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ev-slug">Slug</Label>
            <Input
              id="ev-slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ev-body">Description</Label>
            <Textarea id="ev-body" name="body" rows={4} defaultValue={event?.body} />
          </div>
          <ImageUpload name="cover" folder="events" defaultValue={event?.cover} label="Cover image (optional)" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-date">Event date</Label>
              <Input id="ev-date" name="eventDate" type="date" defaultValue={event?.event_date ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-location">Location</Label>
              <Input id="ev-location" name="location" defaultValue={event?.location ?? ""} />
            </div>
          </div>
          <label className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Published</span>
            <Switch name="isPublished" defaultChecked={event?.is_published ?? true} />
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
