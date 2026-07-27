"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitOutgrowerApplicationAction, type EnquiryActionState } from "@/lib/actions/enquiries";

export function OutgrowerForm() {
  const [state, formAction, pending] = useActionState<EnquiryActionState, FormData>(
    submitOutgrowerApplicationAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="farmerName">Full name</Label>
          <Input id="farmerName" name="farmerName" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" name="email" type="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Farm location</Label>
          <Input id="location" name="location" required placeholder="e.g. Nsawam, Eastern Region" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="crop">Crop you grow</Label>
          <Input id="crop" name="crop" required placeholder="e.g. Maize, Soybean" />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="landSize">Land size (optional)</Label>
          <Input id="landSize" name="landSize" placeholder="e.g. 3 acres" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Tell us about your farm</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Submitting…" : "Apply to the outgrower scheme"}
      </Button>
    </form>
  );
}
