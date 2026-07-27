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
import { setPartnerTierAction } from "@/lib/actions/admin/partners";
import type { PartnerTier } from "@/lib/supabase/database.types";
import { toast } from "sonner";

export function PartnerTierSelect({ id, tier }: { id: string; tier: PartnerTier }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  return (
    <Select
      value={tier}
      disabled={pending}
      onValueChange={(next) =>
        startTransition(async () => {
          await setPartnerTierAction(id, next as PartnerTier);
          toast.success("Tier updated");
          router.refresh();
        })
      }
    >
      <SelectTrigger className="h-8 w-28 text-xs capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="standard">Standard</SelectItem>
        <SelectItem value="silver">Silver</SelectItem>
        <SelectItem value="gold">Gold</SelectItem>
      </SelectContent>
    </Select>
  );
}
