"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSiteContentAction } from "@/lib/actions/admin/content";
import { agrochemicalsInputsDefaults, agrochemicalsInputsFields } from "@/lib/agrochemicals-inputs-content";
import { toast } from "sonner";

export function AgrochemicalsInputsForm({ values }: { values: Record<string, string> }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      await saveSiteContentAction(formData);
      toast.success("Agrochemicals page saved");
      router.refresh();
    });
  }

  return (
    <form action={submit} className="grid gap-4 sm:grid-cols-2">
      {agrochemicalsInputsFields.map((field) => {
        const multiline = "multiline" in field && field.multiline;
        return (
          <div key={field.key} className={`flex flex-col gap-1.5 ${multiline ? "sm:col-span-2" : ""}`}>
            <Label htmlFor={field.key}>{field.label}</Label>
            {multiline ? (
              <textarea
                id={field.key}
                name={`agrochemicals_inputs:${field.key}`}
                defaultValue={values[field.key] ?? agrochemicalsInputsDefaults[field.key] ?? ""}
                rows={3}
                className="min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            ) : (
              <Input
                id={field.key}
                name={`agrochemicals_inputs:${field.key}`}
                defaultValue={values[field.key] ?? agrochemicalsInputsDefaults[field.key] ?? ""}
              />
            )}
          </div>
        );
      })}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save page content"}
        </Button>
      </div>
    </form>
  );
}
