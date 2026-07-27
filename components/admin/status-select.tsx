"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function StatusSelect({
  id,
  value,
  options,
  onUpdate,
}: {
  id: string;
  value: string;
  options: string[];
  onUpdate: (id: string, status: string) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  return (
    <Select
      value={value}
      disabled={pending}
      onValueChange={(next) =>
        startTransition(async () => {
          await onUpdate(id, next);
          toast.success("Status updated");
          router.refresh();
        })
      }
    >
      <SelectTrigger className="h-8 w-36 capitalize text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt} className="capitalize">
            {opt.replace("_", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
