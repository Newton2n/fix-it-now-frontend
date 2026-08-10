"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import Image from "next/image";

export function FinalCTA() {
  return (
    <section id="final-cta" className="w-full border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid items-center gap-10 rounded-3xl border border-border bg-card p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:p-14 shadow-sm">
            <div className="min-w-0">
              <h2 className="text-pretty text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                Ready to get your next home job sorted?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Find a service, choose a professional, and book with confidence.
              </p>
              <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  Find a Service
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Technicians
                </Button>
              </div>
            </div>
            <Image
              src="/assets/hero-illustration.png"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={1280}
              height={1024}
              className="mx-auto w-full max-w-sm object-contain lg:max-w-md"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}