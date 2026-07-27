import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/require-role";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const profile = await getCurrentUser();
  if (!profile) redirect("/login?next=/account");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold">
        Hello, {profile.full_name ?? profile.email}
      </h1>
      <p className="mt-1 text-muted-foreground">
        Order history and reorder shortcuts are added once the shop goes
        live later in this build.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/shop">Continue shopping</Link>
        </Button>
        {profile.role === "partner" && (
          <Button asChild variant="outline">
            <Link href="/partners/dashboard">Partner dashboard</Link>
          </Button>
        )}
        <form action={signOutAction}>
          <Button type="submit" variant="ghost">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
