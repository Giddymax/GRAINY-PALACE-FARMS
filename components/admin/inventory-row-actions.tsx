"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { adjustStockAction, deleteInventoryItemAction } from "@/lib/actions/admin/inventory";
import { toast } from "sonner";

export function InventoryRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function adjust(delta: number) {
    startTransition(async () => {
      await adjustStockAction(id, delta);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button size="icon-sm" variant="ghost" disabled={pending} onClick={() => adjust(-1)} aria-label="Decrease stock">
        <Minus className="size-4" />
      </Button>
      <Button size="icon-sm" variant="ghost" disabled={pending} onClick={() => adjust(1)} aria-label="Increase stock">
        <Plus className="size-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="icon-sm" variant="ghost" aria-label="Delete item">
            <Trash2 className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this inventory item?</AlertDialogTitle>
            <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                startTransition(async () => {
                  await deleteInventoryItemAction(id);
                  toast.success("Item deleted");
                  router.refresh();
                })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
