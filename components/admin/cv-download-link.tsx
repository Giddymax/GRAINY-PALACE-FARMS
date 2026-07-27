"use client";

import * as React from "react";
import { FileText, Loader2 } from "lucide-react";
import { getSignedCvUrl } from "@/lib/actions/admin/enquiries";
import { toast } from "sonner";

export function CvDownloadLink({ path }: { path: string }) {
  const [loading, setLoading] = React.useState(false);

  async function handleClick() {
    setLoading(true);
    const url = await getSignedCvUrl(path);
    setLoading(false);
    if (!url) {
      toast.error("Could not open this file.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1 text-sm text-forest-700 hover:underline dark:text-forest-300"
    >
      {loading ? <Loader2 className="size-3.5 animate-spin" /> : <FileText className="size-3.5" />}
      View CV
    </button>
  );
}
