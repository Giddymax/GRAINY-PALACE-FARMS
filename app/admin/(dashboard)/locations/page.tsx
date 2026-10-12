import { requireStaff } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FarmLocationFormDialog } from "@/components/admin/farm-location-form-dialog";
import { EntityDeleteButton } from "@/components/admin/entity-delete-button";
import { deleteFarmLocationAction } from "@/lib/actions/admin/farm-locations";
import type { Database } from "@/lib/supabase/database.types";

export const metadata = { title: "Farm Locations — Admin" };

type FarmLocation = Database["public"]["Tables"]["farm_locations"]["Row"];

export default async function AdminFarmLocationsPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("farm_locations")
    .select("*")
    .order("region", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  const locations = (data ?? []) as FarmLocation[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Farm Locations</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage regional farm addresses, GPS points, maps, and visitor routes.</p>
        </div>
        <FarmLocationFormDialog />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Farm</TableHead>
              <TableHead>Region / locality</TableHead>
              <TableHead>GPS</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.region}<br /><span className="text-sm text-muted-foreground">{location.locality}</span></TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{location.latitude}, {location.longitude}</TableCell>
                <TableCell>
                  <Badge variant={location.is_published ? "default" : "outline"}>
                    {location.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <FarmLocationFormDialog location={location} />
                    <EntityDeleteButton onDelete={deleteFarmLocationAction.bind(null, location.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {locations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No farm locations yet. Add a farm to publish its GPS position and directions.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
