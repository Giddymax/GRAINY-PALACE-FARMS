"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
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
import { saveFarmLocationAction } from "@/lib/actions/admin/farm-locations";
import type { Database } from "@/lib/supabase/database.types";

type FarmLocation = Database["public"]["Tables"]["farm_locations"]["Row"];

export function FarmLocationFormDialog({ location }: { location?: FarmLocation }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const fieldPrefix = React.useId();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await saveFarmLocationAction(formData);
        toast.success(location ? "Farm location updated" : "Farm location added");
        setOpen(false);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not save this farm location.");
      }
    });
  }

  const idFor = (name: string) => `${fieldPrefix}-${name}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {location ? (
          <Button size="icon-sm" variant="ghost" aria-label={`Edit ${location.name}`}>
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-1 size-4" /> Add farm location
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{location ? "Edit farm location" : "Add farm location"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          {location && <input type="hidden" name="id" value={location.id} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={idFor("name")}>Farm name</Label>
              <Input id={idFor("name")} name="name" required defaultValue={location?.name} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={idFor("region")}>Region</Label>
              <Input id={idFor("region")} name="region" required placeholder="e.g. Ashanti Region" defaultValue={location?.region} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={idFor("locality")}>Town or locality</Label>
              <Input id={idFor("locality")} name="locality" required placeholder="e.g. Ejisu" defaultValue={location?.locality} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={idFor("address")}>Street address or landmark</Label>
              <Input id={idFor("address")} name="address" defaultValue={location?.address ?? ""} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={idFor("description")}>About this farm</Label>
            <Textarea id={idFor("description")} name="description" rows={2} defaultValue={location?.description ?? ""} />
          </div>

          <fieldset className="rounded-lg border border-border p-4">
            <legend className="px-1 text-sm font-medium">GPS coordinates</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={idFor("latitude")}>Latitude</Label>
                <Input id={idFor("latitude")} name="latitude" type="number" step="any" min="-90" max="90" required defaultValue={location?.latitude} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={idFor("longitude")}>Longitude</Label>
                <Input id={idFor("longitude")} name="longitude" type="number" step="any" min="-180" max="180" required defaultValue={location?.longitude} />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Coordinates are used to place the map marker and calculate directions.</p>
          </fieldset>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={idFor("map-url")}>Google Maps place link (optional)</Label>
            <Input id={idFor("map-url")} name="mapUrl" type="url" placeholder="https://maps.google.com/..." defaultValue={location?.map_url ?? ""} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={idFor("route-notes")}>Route notes (optional)</Label>
            <Textarea id={idFor("route-notes")} name="routeNotes" rows={3} placeholder="Landmarks, access roads, or visitor instructions" defaultValue={location?.route_notes ?? ""} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={idFor("sort-order")}>Display order</Label>
              <Input id={idFor("sort-order")} name="sortOrder" type="number" min="0" step="1" defaultValue={location?.sort_order ?? 0} />
            </div>
            <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
              <span className="text-sm font-medium">Published on public site</span>
              <Switch name="isPublished" defaultChecked={location?.is_published ?? false} />
            </label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save location"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
