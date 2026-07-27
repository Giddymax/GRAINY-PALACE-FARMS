"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2, Send, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  deleteArticleAction,
  toggleArticleStatusAction,
} from "@/lib/actions/admin/articles";

export function ArticleRowActions({
  id,
  slug,
  status,
}: {
  id: string;
  slug: string;
  status: "draft" | "published";
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleArticleStatusAction(id, status === "published" ? "draft" : "published");
      toast.success(status === "published" ? "Moved back to draft" : "Published");
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteArticleAction(id, slug);
      toast.success("Article deleted");
      setConfirmOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" variant="ghost" aria-label="More actions" disabled={pending}>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleToggle}>
            {status === "published" ? (
              <>
                <Undo2 className="mr-2 size-4" /> Move to draft
              </>
            ) : (
              <>
                <Send className="mr-2 size-4" /> Publish
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              This can&apos;t be undone. The article will be removed from the
              Knowledge Hub immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={pending}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
