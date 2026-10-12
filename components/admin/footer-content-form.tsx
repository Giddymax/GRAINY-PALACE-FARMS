"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { footerFieldGroups } from "@/lib/footer-content";
import { saveSiteContentAction } from "@/lib/actions/admin/content";
import { toast } from "sonner";

export function FooterContentForm({ values }: { values: Record<string, string> }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      await saveSiteContentAction(formData);
      toast.success("Footer content saved");
      router.refresh();
    });
  }

  return (
    <form action={submit} className="flex flex-col gap-6">
      {footerFieldGroups.map((group) => (
        <section key={group.title} className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-heading text-lg font-semibold">{group.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => (
              <div key={field.key} className={`flex flex-col gap-1.5 ${field.multiline ? "sm:col-span-2" : ""}`}>
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.multiline ? (
                  <textarea
                    id={field.key}
                    name={`footer:${field.key}`}
                    defaultValue={values[field.key] ?? field.fallback}
                    rows={3}
                    className="min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                ) : (
                  <Input
                    id={field.key}
                    name={`footer:${field.key}`}
                    defaultValue={values[field.key] ?? field.fallback}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
      <Button type="submit" className="w-fit" disabled={pending}>
        {pending ? "Saving…" : "Save footer"}
      </Button>
    </form>
  );
}
