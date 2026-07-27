"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveSiteContentAction } from "@/lib/actions/admin/content";
import { toast } from "sonner";

type ContentRow = { section: string; key: string; value: string | null };

function titleCase(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function SiteContentForm({ rows }: { rows: ContentRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const sections = rows.reduce<Record<string, ContentRow[]>>((acc, row) => {
    (acc[row.section] ??= []).push(row);
    return acc;
  }, {});

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await saveSiteContentAction(formData);
      toast.success("Site content saved");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-8">
      {Object.entries(sections).map(([section, items]) => (
        <div key={section} className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-heading text-lg font-semibold capitalize">{section}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((row) => (
              <div key={`${row.section}:${row.key}`} className="flex flex-col gap-1.5">
                <Label htmlFor={`${row.section}:${row.key}`}>{titleCase(row.key)}</Label>
                <Input
                  id={`${row.section}:${row.key}`}
                  name={`${row.section}:${row.key}`}
                  defaultValue={row.value ?? ""}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button type="submit" className="w-fit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
