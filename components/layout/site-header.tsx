"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, ChevronDown, Search, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WordMark } from "@/components/brand/logo-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MiniCart } from "@/components/layout/mini-cart";
import { primaryNav, secondaryNav, type NavLink as NavLinkType } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const t = useTranslations("nav");
  const navLabel = (link: NavLinkType) => (link.i18nKey ? t(link.i18nKey) : link.label);

  return (
    <header
      className="sticky top-0 z-40 border-b border-forest-900 bg-forest-950 text-forest-50 [&_[data-slot=button]]:text-forest-50 [&_[data-slot=button]:hover]:bg-forest-900 [&_[data-slot=button]:hover]:text-white backdrop-blur supports-backdrop-filter:bg-forest-950/95"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mr-2 flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <WordMark />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center gap-1 xl:flex"
        >
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-forest-50/85 hover:bg-forest-900 hover:text-white",
                pathname === link.href && "bg-forest-900 text-white"
              )}
            >
              {navLabel(link)}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-1 text-sm font-medium text-forest-50/85 hover:bg-forest-900 hover:text-white"
              >
                {t("more")} <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {secondaryNav.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="flex flex-col items-start gap-0.5 py-2">
                    <span className="font-medium">{navLabel(link)}</span>
                    {link.description && (
                      <span className="text-xs text-muted-foreground">
                        {link.description}
                      </span>
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-0.5 sm:gap-1 xl:flex-none">
          <Button variant="ghost" size="icon" className="size-11 shrink-0" asChild>
            <Link href="/shop?focus=search" aria-label={t("search")}>
              <Search className="size-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden size-11 shrink-0 sm:inline-flex"
            asChild
          >
            <Link href="/partners" aria-label={t("partnerLogin")}>
              <Handshake className="size-5" />
            </Link>
          </Button>
          <LanguageSwitcher />
          <ThemeToggle />
          <MiniCart />
          <Button
            variant="ghost"
            size="icon"
            className="size-11 shrink-0 xl:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-full sm:max-w-xs">
          <SheetHeader>
            <SheetTitle>
              <WordMark />
            </SheetTitle>
          </SheetHeader>
          <nav
            aria-label="Mobile"
            className="flex flex-col gap-1 overflow-y-auto px-4 pb-6"
          >
            {[...primaryNav, ...secondaryNav].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium hover:bg-muted"
              >
                {navLabel(link)}
              </Link>
            ))}
            <Link
              href="/partners"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-3 text-base font-medium hover:bg-muted"
            >
              {t("partnerLogin")}
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
