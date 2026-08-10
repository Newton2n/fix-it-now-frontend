"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import Image from "next/image";

/** Redesigned FinalCTA section optimized for ultra-wide 4K viewports (max-w-[1920px]) matching previous layout width and structure. */
export function FinalCTA() {
  return (
    <section id="final-cta" className="w-full border-b border-border bg-background py-20 lg:py-28 overflow-hidden">
      {/* Expanded container matching ultra-wide 4K display widths (max-w-[1920px]) while preserving responsive padding alignment */}
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-8 sm:p-12 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-16 lg:p-16 shadow-sm backdrop-blur-md">
            
            {/* Background ambient light effects matching theme primary tint */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -bottom-24 size-96 rounded-full bg-primary/5 blur-3xl"
            />

            <div className="relative min-w-0 flex flex-col items-start">
              <h2 className="text-pretty text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-foreground">
                Ready to get your next home job sorted?
              </h2>
              <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground font-normal">
                Find a service, choose a professional, and book with confidence.
              </p>
              <div className="mt-8 flex w-full flex-wrap items-center gap-4">
                <Button size="lg" className="gap-2 px-8 py-6 text-base font-semibold shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                  Find a Service
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                  Explore Technicians
                </Button>
              </div>
            </div>

            <div className="relative min-w-0 flex items-center justify-center mt-10 lg:mt-0">
              <div className="relative w-full max-w-md lg:max-w-lg rounded-2xl bg-muted/40 p-6 border border-border backdrop-blur-md shadow-xs">
                <Image
                  src="/assets/hero2.png"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width={1280}
                  height={1024}
                  className="mx-auto w-full h-auto object-contain drop-shadow-md transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}