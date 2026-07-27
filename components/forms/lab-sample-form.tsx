"use client";

import * as React from "react";
import { useActionState } from "react";
import { Loader2, Upload, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitLabSampleAction, type EnquiryActionState } from "@/lib/actions/enquiries";
import { uploadDocumentAction } from "@/lib/actions/uploads";
import { toast } from "sonner";

const testOptions = [
  "Chemical residue",
  "Microbiological",
  "Nutritional analysis",
  "Water quality",
  "Shelf-life",
];

export function LabSampleForm() {
  const [state, formAction, pending] = useActionState<EnquiryActionState, FormData>(
    submitLabSampleAction,
    null
  );
  const [selectedTests, setSelectedTests] = React.useState<Set<string>>(new Set());
  const [attachmentPath, setAttachmentPath] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  async function handleFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    const result = await uploadDocumentAction("lab-samples", file);
    setUploading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    if (result.path) {
      setAttachmentPath(result.path);
      toast.success("Attachment uploaded");
    }
  }

  function toggleTest(test: string) {
    setSelectedTests((prev) => {
      const next = new Set(prev);
      if (next.has(test)) next.delete(test);
      else next.add(test);
      return next;
    });
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="tests" value={Array.from(selectedTests).join(",")} />
      <input type="hidden" name="attachmentUrl" value={attachmentPath} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="clientName">Full name</Label>
          <Input id="clientName" name="clientName" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="clientPhone">Phone</Label>
          <Input id="clientPhone" name="clientPhone" required />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="clientEmail">Email (optional)</Label>
          <Input id="clientEmail" name="clientEmail" type="email" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sampleType">Sample type</Label>
        <Select name="sampleType" required>
          <SelectTrigger id="sampleType" className="w-full">
            <SelectValue placeholder="Select sample type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Grain">Grain</SelectItem>
            <SelectItem value="Fresh produce">Fresh produce</SelectItem>
            <SelectItem value="Meat">Meat</SelectItem>
            <SelectItem value="Fish">Fish</SelectItem>
            <SelectItem value="Water">Water</SelectItem>
            <SelectItem value="Processed food">Processed food</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block">Tests required</Label>
        <div className="flex flex-col gap-2">
          {testOptions.map((test) => (
            <label key={test} className="flex items-center gap-2 text-sm">
              <Checkbox checked={selectedTests.has(test)} onCheckedChange={() => toggleTest(test)} />
              {test}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Additional notes</Label>
        <Textarea id="notes" name="notes" rows={2} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="attachment-upload">Attachment (optional — photo of sample/label)</Label>
        <label
          htmlFor="attachment-upload"
          className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-2 text-sm hover:border-forest-400"
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : attachmentPath ? (
            <FileCheck className="size-4 text-forest-600" />
          ) : (
            <Upload className="size-4" />
          )}
          {attachmentPath ? "Uploaded — click to replace" : "Upload a file"}
        </label>
        <input
          id="attachment-upload"
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
        {pending ? "Submitting…" : "Submit sample"}
      </Button>
    </form>
  );
}
