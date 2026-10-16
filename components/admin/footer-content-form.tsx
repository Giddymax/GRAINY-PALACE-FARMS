"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  footerFieldGroups,
  footerLinkCollectionLabels,
  type FooterCollections,
  type FooterLink,
  type FooterSocialLink,
} from "@/lib/footer-content";
import { saveSiteContentAction } from "@/lib/actions/admin/content";
import { toast } from "sonner";

export function FooterContentForm({
  values,
  initialCollections,
}: {
  values: Record<string, string>;
  initialCollections: FooterCollections;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [collections, setCollections] = React.useState(initialCollections);

  function submit(formData: FormData) {
    for (const key of Object.keys(footerLinkCollectionLabels) as (keyof FooterCollections)[]) {
      const links = collections[key].filter((link) => link.label.trim() && link.href.trim());
      formData.set(`footer:${key}_links`, JSON.stringify(links));
    }
    startTransition(async () => {
      await saveSiteContentAction(formData);
      toast.success("Footer content saved");
      router.refresh();
    });
  }

  function updateLink(
    group: keyof FooterCollections,
    index: number,
    field: "label" | "href" | "platform",
    value: string
  ) {
    setCollections((current) => {
      const updated = [...current[group]];
      updated[index] = { ...updated[index], [field]: value } as FooterLink & Partial<FooterSocialLink>;
      return { ...current, [group]: updated } as FooterCollections;
    });
  }

  function addLink(group: keyof FooterCollections) {
    setCollections((current) => ({
      ...current,
      [group]: group === "social"
        ? [...current.social, { platform: "facebook", label: "", href: "" }]
        : [...current[group], { label: "", href: "" }],
    } as FooterCollections));
  }

  function removeLink(group: keyof FooterCollections, index: number) {
    setCollections((current) => ({
      ...current,
      [group]: current[group].filter((_, itemIndex) => itemIndex !== index),
    } as FooterCollections));
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
      {(Object.keys(footerLinkCollectionLabels) as (keyof FooterCollections)[]).map((group) => (
        <section key={group} className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-semibold">{footerLinkCollectionLabels[group]}</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => addLink(group)}>
              Add link
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {collections[group].map((link, index) => (
              <div key={`${group}-${index}`} className={`grid gap-3 rounded-lg border border-border p-3 sm:items-end ${group === "social" ? "sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.3fr)_auto]" : "sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto]"}`}>
                {group === "social" && (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`${group}-${index}-platform`}>Logo</Label>
                    <select
                      id={`${group}-${index}-platform`}
                      value={"platform" in link ? link.platform : "facebook"}
                      onChange={(event) => updateLink(group, index, "platform", event.target.value)}
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="x">X</option>
                    </select>
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${group}-${index}-label`}>Link text</Label>
                  <Input
                    id={`${group}-${index}-label`}
                    value={link.label}
                    onChange={(event) => updateLink(group, index, "label", event.target.value)}
                    placeholder="Link label"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${group}-${index}-href`}>Destination</Label>
                  <Input
                    id={`${group}-${index}-href`}
                    value={link.href}
                    onChange={(event) => updateLink(group, index, "href", event.target.value)}
                    placeholder="/page or https://example.com"
                  />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => removeLink(group, index)}>
                  Remove
                </Button>
              </div>
            ))}
            {collections[group].length === 0 && (
              <p className="text-sm text-muted-foreground">No links in this group yet.</p>
            )}
          </div>
        </section>
      ))}
      <Button type="submit" className="w-fit" disabled={pending}>
        {pending ? "Saving…" : "Save footer"}
      </Button>
    </form>
  );
}
