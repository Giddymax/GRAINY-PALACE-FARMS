import Image from "next/image";
import { getPageHero } from "@/lib/data/misc";
import { cn } from "@/lib/utils";

/**
 * Optional banner image for a marketing sub-page, staff-editable from
 * Admin → Content → Page headers. Renders nothing until an image is set,
 * so every page looks exactly as it does today until staff opts in.
 */
export async function PageHeroImage({ slug, className }: { slug: string; className?: string }) {
  const hero = await getPageHero(slug);
  if (!hero?.image_url) return null;

  return (
    <div
      className={cn(
        "relative mb-8 aspect-[21/9] w-full overflow-hidden rounded-3xl bg-muted sm:aspect-[3/1]",
        className
      )}
    >
      <Image
        src={hero.image_url}
        alt=""
        fill
        sizes="(min-width: 1024px) 1024px, 100vw"
        className="object-cover"
        priority
      />
    </div>
  );
}
