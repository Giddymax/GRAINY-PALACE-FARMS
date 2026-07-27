import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { getPublishedEvents } from "@/lib/data/misc";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "News & Events",
  description:
    "Press releases, trade-fair appearances and community events from Grainy Palace Farm.",
};

export default async function NewsPage() {
  const events = await getPublishedEvents();
  const now = new Date();
  const upcoming = events.filter((e) => e.event_date && new Date(e.event_date) >= now);
  const past = events.filter((e) => !e.event_date || new Date(e.event_date) < now);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">News &amp; Events</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Press releases, trade fairs and community events from across the farm.
        </p>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 font-heading text-lg font-semibold">Upcoming</h2>
          <div className="flex flex-col gap-4">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 font-heading text-lg font-semibold">
          {upcoming.length > 0 ? "Past events" : "Latest"}
        </h2>
        <div className="flex flex-col gap-4">
          {past.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          {events.length === 0 && (
            <p className="text-muted-foreground">No events published yet — check back soon.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function EventCard({
  event,
}: {
  event: Awaited<ReturnType<typeof getPublishedEvents>>[number];
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-heading text-lg font-semibold">{event.title}</h3>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {event.event_date && (
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" /> {formatDate(event.event_date)}
          </span>
        )}
        {event.location && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" /> {event.location}
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{event.body}</p>
    </article>
  );
}
