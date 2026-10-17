import Image from "next/image";
import { getPageHero } from "@/lib/data/misc";
import { cn } from "@/lib/utils";

/**
 * Staff-editable sub-page banner with a consistent, cinematic brand treatment.
 * Renders nothing until an image is set in Admin → Content → Page headers.
 */
export async function PageHeroImage({ slug, className }: { slug: string; className?: string }) {
  const hero = await getPageHero(slug);
  if (!hero?.image_url) return null;

  return (
    <div
      className={cn(
        "group relative mb-8 aspect-[2/1] w-full overflow-hidden rounded-3xl bg-forest-950 shadow-lg shadow-forest-950/10 ring-1 ring-forest-900/10 sm:aspect-[21/8]",
        className
      )}
    >
      <Image
        src={hero.image_url}
        alt=""
        fill
        sizes="(min-width: 1024px) 1024px, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        priority
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-forest-950/45 via-forest-950/10 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-950/35 via-transparent to-white/5" />
      <div aria-hidden="true" className="absolute -right-16 -top-28 size-[55%] rounded-full border border-white/25 shadow-[0_0_0_24px_rgba(255,255,255,0.06),0_0_0_48px_rgba(255,255,255,0.04)] sm:-right-8 sm:-top-40" />
      <div aria-hidden="true" className="absolute bottom-5 left-5 h-1 w-16 rounded-full bg-gold-400 shadow-[0_0_18px_rgba(251,191,36,0.45)] sm:bottom-7 sm:left-7 sm:w-20" />
    </div>
  );
}
