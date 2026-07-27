"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadCoaAction } from "@/lib/actions/admin/enquiries";
import { toast } from "sonner";

export function CoaUploadButton({ labSampleId, hasCoa }: { labSampleId: string; hasCoa: boolean }) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  async function handleFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    const result = await uploadCoaAction(labSampleId, file);
    setUploading(false);
    if ("error" in result && result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("CoA uploaded — sample marked complete");
    router.refresh();
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="mr-1 size-4 animate-spin" />
        ) : hasCoa ? (
          <FileCheck className="mr-1 size-4 text-forest-600" />
        ) : (
          <Upload className="mr-1 size-4" />
        )}
        {hasCoa ? "Replace CoA" : "Upload CoA"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </>
  );
}
