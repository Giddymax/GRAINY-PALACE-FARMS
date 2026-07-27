"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { approvePartnerAction, rejectPartnerAction } from "@/lib/actions/admin/partners";
import { toast } from "sonner";

export function PartnerApprovalButtons({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function toggle() {
    startTransition(async () => {
      if (approved) {
        await rejectPartnerAction(id);
        toast.success("Partner access revoked");
      } else {
        await approvePartnerAction(id);
        toast.success("Partner approved");
      }
      router.refresh();
    });
  }

  return (
    <Button size="sm" variant={approved ? "outline" : "default"} disabled={pending} onClick={toggle}>
      {approved ? "Revoke" : "Approve"}
    </Button>
  );
}
