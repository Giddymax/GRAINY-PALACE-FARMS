"use client";

import * as React from "react";
import { useActionState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPartnerAction, type CreatePartnerResult } from "@/lib/actions/admin/partners";

export function CreatePartnerDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, formAction, pending] = useActionState<CreatePartnerResult, FormData>(
    createPartnerAction,
    null
  );
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (submitted && !pending && !state?.error) setOpen(false);
  }, [submitted, pending, state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 size-4" /> New partner account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create partner account</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            setSubmitted(true);
            await formAction(formData);
            router.refresh();
          }}
          className="flex flex-col gap-4"
        >
          <p className="text-sm text-muted-foreground">
            The customer must already have an account (via Sign up) using
            this email.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="partner-email">Customer email</Label>
            <Input id="partner-email" name="email" type="email" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="partner-business">Business name</Label>
            <Input id="partner-business" name="businessName" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="partner-type">Business type</Label>
            <Input id="partner-type" name="businessType" placeholder="e.g. Supermarket, Hotel, Processor" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="partner-tier">Pricing tier</Label>
            <Select name="tier" defaultValue="standard">
              <SelectTrigger id="partner-tier" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {state?.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create partner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
