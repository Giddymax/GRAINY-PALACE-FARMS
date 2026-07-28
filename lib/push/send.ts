import "server-only";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";

export type PushPayload = { title: string; body: string; url?: string; icon?: string };

function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

function configureWebPush() {
  webpush.setVapidDetails(
    `mailto:${siteConfig.contact.email}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

type Subscription = { endpoint: string; p256dh: string; auth: string };

/** Sends to a list of subscriptions and prunes any the push service reports as gone. */
async function deliver(subscriptions: Subscription[], payload: PushPayload) {
  if (!isConfigured() || subscriptions.length === 0) return;
  configureWebPush();

  const supabase = await createClient();
  const body = JSON.stringify(payload);

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          body
        );
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        } else {
          console.error("Push send failed:", err);
        }
      }
    })
  );
}

/** Broadcast to every opted-in subscriber (used for new-article / restock alerts). */
export async function broadcastPush(payload: PushPayload) {
  if (!isConfigured()) return;
  const supabase = await createClient();
  const { data } = await supabase.from("push_subscriptions").select("endpoint, p256dh, auth");
  await deliver(data ?? [], payload);
}

/** Notify only the subscriptions belonging to one signed-in user (order updates). */
export async function sendPushToUser(userId: string, payload: PushPayload) {
  if (!isConfigured()) return;
  const supabase = await createClient();
  const { data } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", userId);
  await deliver(data ?? [], payload);
}
