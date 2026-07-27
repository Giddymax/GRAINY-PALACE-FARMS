"use client";

import * as React from "react";
import { useActionState } from "react";
import { Loader2, Upload, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitJobApplicationAction, type EnquiryActionState } from "@/lib/actions/enquiries";
import { uploadDocumentAction } from "@/lib/actions/uploads";
import { toast } from "sonner";

export function JobApplicationForm({ openingId }: { openingId?: string }) {
  const [state, formAction, pending] = useActionState<EnquiryActionState, FormData>(
    submitJobApplicationAction,
    null
  );
  const [cvPath, setCvPath] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  async function handleFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    const result = await uploadDocumentAction("job-applications", file);
    setUploading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    if (result.path) {
      setCvPath(result.path);
      toast.success("CV uploaded");
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {openingId && <input type="hidden" name="openingId" value={openingId} />}
      <input type="hidden" name="cvUrl" value={cvPath} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="applicantName">Full name</Label>
          <Input id="applicantName" name="applicantName" required />
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
        <Label htmlFor="coverNote">Why do you want to join us?</Label>
        <Textarea id="coverNote" name="coverNote" rows={3} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cv-upload">CV / Resume (PDF, JPG or PNG, max 8MB)</Label>
        <label
          htmlFor="cv-upload"
          className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-2 text-sm hover:border-forest-400"
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : cvPath ? (
            <FileCheck className="size-4 text-forest-600" />
          ) : (
            <Upload className="size-4" />
          )}
          {cvPath ? "CV uploaded — click to replace" : "Upload your CV"}
        </label>
        <input
          id="cv-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending || uploading}>
        {pending ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
