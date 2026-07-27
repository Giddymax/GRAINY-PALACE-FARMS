"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { WordMark } from "@/components/brand/logo-mark";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/actions/auth";
import type { AdminNavGroup } from "@/lib/admin-nav";

function NavLinks({ groups, onNavigate }: { groups: AdminNavGroup[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-6 px-3">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                    active && "bg-forest-600 text-white hover:bg-forest-600"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminSidebar({
  groups,
  userLabel,
}: {
  groups: AdminNavGroup[];
  userLabel: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card py-6 lg:flex">
        <div className="mb-6 px-4">
          <WordMark />
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavLinks groups={groups} />
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-border px-4 pt-4">
          <p className="truncate text-xs text-muted-foreground">{userLabel}</p>
          <form action={signOutAction}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start px-0">
              <LogOut className="mr-2 size-4" /> Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <WordMark />
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open admin menu">
          <Menu className="size-5" />
        </Button>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>
              <WordMark />
            </SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto pb-6">
            <NavLinks groups={groups} onNavigate={() => setOpen(false)} />
          </div>
          <div className="border-t border-border px-4 py-4">
            <p className="mb-2 truncate text-xs text-muted-foreground">{userLabel}</p>
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm" className="w-full justify-start px-0">
                <LogOut className="mr-2 size-4" /> Sign out
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
