"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateOrderStatusAction } from "@/lib/actions/admin/orders";
import { toast } from "sonner";
import type { OrderStatus } from "@/lib/supabase/database.types";

const flow: Record<OrderStatus, OrderStatus | null> = {
  new: "confirmed",
  confirmed: "dispatched",
  dispatched: "delivered",
  delivered: null,
  cancelled: null,
};

const labels: Record<string, string> = {
  confirmed: "Confirm order",
  dispatched: "Mark dispatched",
  delivered: "Mark delivered",
};

export function OrderStatusActions({ id, status }: { id: string; status: OrderStatus }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const next = flow[status];

  function updateStatus(newStatus: OrderStatus) {
    startTransition(async () => {
      await updateOrderStatusAction(id, newStatus);
      toast.success(`Order marked ${newStatus}`);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      {next && (
        <Button disabled={pending} onClick={() => updateStatus(next)}>
          {labels[next] ?? `Mark ${next}`}
        </Button>
      )}
      {status !== "cancelled" && status !== "delivered" && (
        <Button variant="outline" disabled={pending} onClick={() => updateStatus("cancelled")}>
          Cancel order
        </Button>
      )}
      <Button variant="outline" onClick={() => window.print()}>
        <Printer className="mr-1 size-4" /> Print
      </Button>
    </div>
  );
}
