"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitQuoteRequestAction, type EnquiryActionState } from "@/lib/actions/enquiries";

export function WholesaleQuoteForm({
  defaultRequestType = "wholesale",
  defaultProduct,
}: {
  defaultRequestType?: "wholesale" | "bulk";
  defaultProduct?: string;
}) {
  const [state, formAction, pending] = useActionState<EnquiryActionState, FormData>(
    submitQuoteRequestAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="requestType" value={defaultRequestType} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">Company / Organisation</Label>
          <Input id="company" name="company" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="productOrService">Product(s) of interest</Label>
        <Input id="productOrService" name="productOrService" defaultValue={defaultProduct} placeholder="e.g. Maize, Table eggs, Live goats" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="quantity">Estimated quantity</Label>
          <Input id="quantity" name="quantity" placeholder="e.g. 20 bags / month" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="timeline">Timeline</Label>
          <Select name="timeline">
            <SelectTrigger id="timeline" className="w-full">
              <SelectValue placeholder="When do you need this?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediately</SelectItem>
              <SelectItem value="this_month">Within a month</SelectItem>
              <SelectItem value="ongoing">Ongoing / recurring supply</SelectItem>
              <SelectItem value="planning">Just planning ahead</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Additional details</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Submitting…" : "Request a quote"}
      </Button>
    </form>
  );
}
