import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Service-role client. Bypasses RLS entirely — only use inside Server
 * Actions/Route Handlers that have already verified the caller is an admin,
 * and only for operations the anon/authenticated roles genuinely cannot do
 * (e.g. the Supabase Auth Admin API for staff management). Never import
 * this from a Client Component.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
