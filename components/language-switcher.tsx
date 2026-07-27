"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLocaleAction } from "@/lib/actions/locale";
import { useSetLocale } from "@/components/intl-client-root";
import { locales, localeNames, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const setClientLocale = useSetLocale();
  const [pending, startTransition] = React.useTransition();

  function handleSelect(next: Locale) {
    if (next === locale) return;
    startTransition(async () => {
      // Instant client-side switch, then persist the choice for next visit.
      setClientLocale(next);
      await setLocaleAction(next);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Change language"
          disabled={pending}
          className="size-11 shrink-0"
        >
          <Languages className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleSelect(code)}
            className={code === locale ? "font-semibold" : undefined}
          >
            {localeNames[code]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
