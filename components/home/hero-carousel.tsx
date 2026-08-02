/// <reference types="react/canary" />
"use client";

import * as React from "react";
import { ViewTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

const AUTOPLAY_MS = 6000;

export type HeroSlideData = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_href: string | null;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function HeroCarousel({ slides }: { slides: HeroSlideData[] }) {
  const [index, setIndex] = React.useState(0);
  const [, startTransition] = React.useTransition();
  const reducedMotion = usePrefersReducedMotion();
  const whatsappHref = buildWhatsAppLink(
    "Hello Grainy Palace Farms, I'd like to know more about your products."
  );

  React.useEffect(() => {
    if (slides.length <= 1 || reducedMotion) return;
    const timer = setInterval(() => {
      startTransition(() => setIndex((i) => (i + 1) % slides.length));
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [slides.length, reducedMotion]);

  function goTo(i: number) {
    startTransition(() => setIndex(i));
  }

  const active = slides[index];

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
      <ViewTransition key={active.id} enter="auto" default="none">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-forest-800 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gold-300">
            <ShieldCheck className="size-4" /> {siteConfig.region}
          </span>
          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
            {active.title}
          </h1>
          {active.subtitle && (
            <p className="max-w-xl text-lg text-forest-100">{active.subtitle}</p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-gold-500 text-charcoal hover:bg-gold-400">
              <Link href={active.cta_href ?? "/shop"}>
                {active.cta_label ?? "Shop Now"} <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-forest-100/30 bg-transparent text-forest-50 hover:bg-forest-800"
            >
              <Link href="/wholesale">Request Bulk Quote</Link>
            </Button>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-forest-100 hover:text-gold-300"
          >
            <MessageCircle className="size-4" /> Or order directly on WhatsApp
          </a>
        </div>
      </ViewTransition>

      <div className="flex flex-col gap-4">
        <ViewTransition key={active.id} enter="auto" default="none">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-forest-700 to-forest-800 shadow-2xl">
            {active.image_url && (
              <Image
                src={active.image_url}
                alt={active.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            )}
          </div>
        </ViewTransition>

        {slides.length > 1 && (
          <div className="flex justify-center gap-2 md:justify-start" role="tablist" aria-label="Hero slides">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show slide ${i + 1}: ${slide.title}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-gold-400" : "w-2 bg-forest-100/40 hover:bg-forest-100/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
