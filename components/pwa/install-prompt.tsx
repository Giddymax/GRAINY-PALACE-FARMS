"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "gpf.install-prompt.dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function InstallPrompt() {
  const pathname = usePathname();
  const [deferredEvent, setDeferredEvent] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(true);

  React.useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISS_KEY) === "1") return;
    setDismissed(false);

    if (isIos()) {
      setShowIosHint(true);
      return;
    }

    function handler(e: Event) {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  async function handleInstall() {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    const choice = await deferredEvent.userChoice;
    if (choice.outcome === "accepted") setDismissed(true);
    setDeferredEvent(null);
  }

  if (pathname?.startsWith("/admin")) return null;
  if (dismissed || (!deferredEvent && !showIosHint)) return null;

  return (
    <div className="fixed inset-x-4 bottom-24 z-40 mx-auto flex max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lg sm:left-auto sm:right-5">
      {showIosHint ? (
        <Share className="mt-0.5 size-5 shrink-0 text-forest-600" />
      ) : (
        <Download className="mt-0.5 size-5 shrink-0 text-forest-600" />
      )}
      <div className="flex-1 text-sm">
        <p className="font-medium">Install Grainy Palace Farm</p>
        <p className="mt-0.5 text-muted-foreground">
          {showIosHint
            ? 'Tap the Share icon, then "Add to Home Screen" for quick, offline-friendly access.'
            : "Add the app to your home screen for faster, offline-friendly access."}
        </p>
        {!showIosHint && (
          <Button size="sm" className="mt-2" onClick={handleInstall}>
            Install
          </Button>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss install prompt"
        onClick={dismiss}
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
