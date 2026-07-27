"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { setProfileActiveAction } from "@/lib/actions/admin/staff";
import { toast } from "sonner";

export function StaffActiveToggle({
  profileId,
  isActive,
  disabled,
}: {
  profileId: string;
  isActive: boolean;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  return (
    <Switch
      checked={isActive}
      disabled={pending || disabled}
      onCheckedChange={(checked) =>
        startTransition(async () => {
          await setProfileActiveAction(profileId, checked);
          toast.success(checked ? "Account activated" : "Account deactivated");
          router.refresh();
        })
      }
    />
  );
}
