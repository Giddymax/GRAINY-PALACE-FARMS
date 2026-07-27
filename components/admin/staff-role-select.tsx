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
import { updateStaffRoleAction } from "@/lib/actions/admin/staff";
import type { ProfileRole } from "@/lib/supabase/database.types";
import { toast } from "sonner";

export function StaffRoleSelect({
  profileId,
  role,
  disabled,
}: {
  profileId: string;
  role: ProfileRole;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  return (
    <Select
      value={role}
      disabled={pending || disabled}
      onValueChange={(next) =>
        startTransition(async () => {
          await updateStaffRoleAction(profileId, next as ProfileRole);
          toast.success("Role updated");
          router.refresh();
        })
      }
    >
      <SelectTrigger className="h-8 w-32 text-xs capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="staff">Staff</SelectItem>
        <SelectItem value="partner">Partner</SelectItem>
        <SelectItem value="customer">Customer</SelectItem>
      </SelectContent>
    </Select>
  );
}
