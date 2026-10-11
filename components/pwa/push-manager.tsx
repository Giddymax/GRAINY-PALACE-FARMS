"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { subscribeToPushAction, unsubscribeFromPushAction } from "@/lib/actions/push";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

/** Opt-in toggle for order-update / restock / new-article push notifications. */
export function PushManager({ label = "Get order & restock alerts" }: { label?: string }) {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return;
    setSupported(true);

    navigator.serviceWorker.ready.then(async (registration) => {
      const sub = await registration.pushManager.getSubscription();
      setSubscribed(Boolean(sub));
    });
  }, []);

  if (!supported) return null;

  async function toggle() {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;

      if (subscribed) {
        const sub = await registration.pushManager.getSubscription();
        if (sub) {
          await unsubscribeFromPushAction(sub.endpoint);
          await sub.unsubscribe();
        }
        setSubscribed(false);
        toast.success("Notifications turned off.");
      } else {
        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
        });
        const json = sub.toJSON();
        const result = await subscribeToPushAction({
          endpoint: sub.endpoint,
          keys: { p256dh: json.keys!.p256dh, auth: json.keys!.auth },
        });
        if (result.error) throw new Error(result.error);
        setSubscribed(true);
        toast.success("You'll now get order & restock alerts.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update your notification preference.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={toggle} disabled={busy}>
      {subscribed ? (
        <>
          <BellOff className="mr-1.5 size-4" /> Notifications on
        </>
      ) : (
        <>
          <Bell className="mr-1.5 size-4" /> {label}
        </>
      )}
    </Button>
  );
}
