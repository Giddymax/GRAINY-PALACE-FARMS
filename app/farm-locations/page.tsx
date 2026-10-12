import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeroImage } from "@/components/layout/page-hero-image";
import { getPublishedFarmLocations } from "@/lib/data/misc";

export const metadata: Metadata = {
  title: "Farm Locations & Directions",
  description:
    "Find Grainy Palace Farms locations across Ghana, view GPS positions on a map, and get directions to each farm.",
};

export default async function FarmLocationsPage() {
  const locations = await getPublishedFarmLocations();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeroImage slug="farm-locations" />
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-forest-700 dark:text-forest-300">Across Ghana</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">Our Farms &amp; Locations</h1>
        <p className="mt-3 text-muted-foreground">
          Explore our regional farm locations, view their GPS positions, and open a route from your current location.
        </p>
      </header>

      {locations.length === 0 ? (
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="font-heading text-xl font-semibold">Farm locations are being added</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Contact our team for current farm access and directions.
          </p>
          <Button asChild className="mt-5">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {locations.map((location) => {
            const coordinates = `${location.latitude},${location.longitude}`;
            const mapHref = location.map_url ??
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`;
            const directionsHref =
              `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coordinates)}`;
            const embedHref =
              `https://maps.google.com/maps?q=${encodeURIComponent(coordinates)}&z=14&output=embed`;

            return (
              <article key={location.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-[16/9] w-full bg-muted">
                  <iframe
                    title={`Map of ${location.name}, ${location.region}`}
                    src={embedHref}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-sm font-medium text-forest-700 dark:text-forest-300">
                    {location.region} · {location.locality}
                  </p>
                  <h2 className="mt-1 font-heading text-xl font-semibold">{location.name}</h2>
                  {location.description && <p className="mt-2 text-sm text-muted-foreground">{location.description}</p>}
                  {location.address && (
                    <p className="mt-3 text-sm">
                      <span className="font-medium">Address: </span>{location.address}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">
                    GPS: {location.latitude}, {location.longitude}
                  </p>
                  {location.route_notes && (
                    <div className="mt-4 rounded-lg bg-muted/60 p-3">
                      <h3 className="text-sm font-semibold">Route notes</h3>
                      <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{location.route_notes}</p>
                    </div>
                  )}
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button asChild>
                      <a href={directionsHref} target="_blank" rel="noopener noreferrer">Get directions</a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href={mapHref} target="_blank" rel="noopener noreferrer">Open map</a>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
