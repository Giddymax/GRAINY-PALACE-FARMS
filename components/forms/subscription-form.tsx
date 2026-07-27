"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitSubscriptionAction, type EnquiryActionState } from "@/lib/actions/enquiries";

export function SubscriptionForm() {
  const [state, formAction, pending] = useActionState<EnquiryActionState, FormData>(
    submitSubscriptionAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="customerName">Full name</Label>
          <Input id="customerName" name="customerName" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" name="email" type="email" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="item">Item</Label>
        <Select name="item" required>
          <SelectTrigger id="item" className="w-full">
            <SelectValue placeholder="Choose a subscription item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cage-free table eggs (crate of 30)">Cage-free eggs (crate of 30)</SelectItem>
            <SelectItem value="Mixed vegetable box">Mixed vegetable box</SelectItem>
            <SelectItem value="Fresh tilapia">Fresh tilapia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Plan</Label>
        <RadioGroup name="plan" defaultValue="weekly" className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="weekly" /> Weekly
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="monthly" /> Monthly
          </label>
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="quantity">Quantity per delivery</Label>
        <Input id="quantity" name="quantity" type="number" min={1} defaultValue={1} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes (delivery address, preferred day, etc.)</Label>
        <Textarea id="notes" name="notes" rows={2} />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Submitting…" : "Start subscription"}
      </Button>
    </form>
  );
}
