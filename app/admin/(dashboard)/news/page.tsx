import { requireStaff } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EventFormDialog } from "@/components/admin/event-form-dialog";
import { EntityDeleteButton } from "@/components/admin/entity-delete-button";
import { deleteEventAction } from "@/lib/actions/admin/events";
import { formatDate } from "@/lib/format";

export const metadata = { title: "News & Events — Admin" };

export default async function AdminNewsPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">News &amp; Events</h1>
        <EventFormDialog />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(events ?? []).map((event) => (
              <TableRow key={event.id}>
                <TableCell className="max-w-xs truncate font-medium">{event.title}</TableCell>
                <TableCell>{event.event_date ? formatDate(event.event_date) : "—"}</TableCell>
                <TableCell className="text-muted-foreground">{event.location ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={event.is_published ? "default" : "outline"}>
                    {event.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <EventFormDialog event={event} />
                    <EntityDeleteButton onDelete={deleteEventAction.bind(null, event.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!events || events.length === 0) && (
              <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No events yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
