"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitPartnerApplicationAction, type EnquiryActionState } from "@/lib/actions/enquiries";

const partnerTypes = [
  "Farmer / Outgrower",
  "Farmer Cooperative",
  "Client / Buyer",
  "Offtaker / Bulk Buyer",
  "Supplier",
  "Processor / Manufacturer",
  "Distributor / Exporter",
  "Retailer / Supermarket",
  "Hospitality / Food Service",
  "Institutional Buyer",
  "Other",
];

export function PartnerApplicationForm() {
  const [state, formAction, pending] = useActionState<EnquiryActionState, FormData>(
    submitPartnerApplicationAction,
    null
  );

  return (
    <form action={formAction} className="space-y-7">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-700">Your application</p>
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Tell us how you want to work together</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Share the essentials and our partnership team will follow up to discuss the right next step.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="partnerType">I am a… <span className="text-destructive">*</span></Label>
          <Select name="partnerType" required>
            <SelectTrigger id="partnerType" className="h-11 w-full rounded-md">
              <SelectValue placeholder="Choose your partner type" />
            </SelectTrigger>
            <SelectContent>
              {partnerTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Choose the closest fit. You can explain more below.</p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Contact person <span className="text-destructive">*</span></Label>
          <Input id="name" name="name" required autoComplete="name" placeholder="Full name" className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone / WhatsApp <span className="text-destructive">*</span></Label>
          <Input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="e.g. +233 24 000 0000" className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email address <span className="text-destructive">*</span></Label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@business.com" className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="organization">Farm, business or organisation</Label>
          <Input id="organization" name="organization" autoComplete="organization" placeholder="Name (if applicable)" className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="location">Town and region <span className="text-destructive">*</span></Label>
          <Input id="location" name="location" required autoComplete="address-level2" placeholder="e.g. Dodowa, Greater Accra" className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="registrationNumber">Business registration (if applicable)</Label>
          <Input id="registrationNumber" name="registrationNumber" placeholder="Registration number" className="h-11" />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="interest">What do you grow, buy, or supply? <span className="text-destructive">*</span></Label>
          <Input id="interest" name="interest" required placeholder="e.g. maize and soybeans; poultry feed; fresh produce for hotels" className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="capacity">Typical acreage, volume or supply capacity</Label>
          <Input id="capacity" name="capacity" placeholder="e.g. 5 acres or 2 tonnes per month" className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="timeline">When would you like to begin?</Label>
          <select id="timeline" name="timeline" defaultValue="" className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Choose a timeframe</option>
            <option value="As soon as possible">As soon as possible</option>
            <option value="Within 1 month">Within 1 month</option>
            <option value="Within 3 months">Within 3 months</option>
            <option value="Planning ahead">Planning ahead</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="details">Anything else we should know?</Label>
          <Textarea id="details" name="details" rows={4} maxLength={2000} placeholder="Tell us about your farm, organisation, requirements or the partnership you have in mind." />
        </div>
      </div>

      {state?.error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{state.error}</p>}
      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-5 text-muted-foreground">Your details will be used to review and respond to this partnership enquiry.</p>
        <Button type="submit" size="lg" disabled={pending} className="gap-2">
          {pending ? "Sending application…" : "Send partnership application"}
          {!pending && <ArrowRight className="size-4" />}
        </Button>
      </div>
    </form>
  );
}
