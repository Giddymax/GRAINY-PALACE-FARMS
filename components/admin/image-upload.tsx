"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadMediaAction } from "@/lib/actions/admin/media";
import { toast } from "sonner";

export function ImageUpload({
  name,
  folder,
  defaultValue,
  label = "Image",
}: {
  name: string;
  folder: string;
  defaultValue?: string | null;
  label?: string;
}) {
  const [url, setUrl] = React.useState(defaultValue ?? "");
  const [pending, setPending] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File | null) {
    if (!file) return;
    setPending(true);
    const result = await uploadMediaAction(folder, file);
    setPending(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    if (result.url) setUrl(result.url);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-border bg-muted">
          <Image src={url} alt="" fill className="object-cover" />
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Remove image"
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className="flex aspect-video w-full max-w-sm flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/50 text-sm text-muted-foreground hover:border-forest-400"
        >
          {pending ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
          {pending ? "Uploading…" : "Click to upload an image"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
