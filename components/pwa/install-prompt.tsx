"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISSED_KEY = "gpf-install-prompt-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // default true so it never flashes before we know
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window));
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    setDismissed(localStorage.getItem(DISMISSED_KEY) === "1");

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  if (isStandalone || dismissed) return null;
  if (!deferredPrompt && !isIOS) return null;

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
    dismiss();
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lg sm:left-4 sm:right-auto">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-forest-100 dark:bg-forest-900/40">
        <Download className="size-4 text-forest-600 dark:text-forest-300" />
      </span>
      <div className="flex-1 text-sm">
        <p className="font-medium">Install Grainy Palace Farm</p>
        {isIOS ? (
          <p className="mt-1 text-muted-foreground">
            Tap <Share className="inline size-3.5 align-text-bottom" aria-hidden /> then &quot;Add to
            Home Screen&quot; to install this app.
          </p>
        ) : (
          <p className="mt-1 text-muted-foreground">
            Add the app to your home screen for faster, offline-friendly access.
          </p>
        )}
        {!isIOS && (
          <Button size="sm" className="mt-3" onClick={install}>
            Install
          </Button>
        )}
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss install prompt"
        className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
