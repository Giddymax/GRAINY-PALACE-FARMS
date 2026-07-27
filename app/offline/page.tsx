import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "You're offline" };

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <WifiOff className="size-14 text-muted-foreground" />
      <h1 className="font-heading text-2xl font-semibold">You&apos;re offline</h1>
      <p className="text-muted-foreground">
        It looks like you&apos;ve lost your connection. Pages you&apos;ve
        already visited may still be available — try going back, or
        reconnect and refresh.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
