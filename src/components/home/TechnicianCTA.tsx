"use client";

import { ArrowRight, CalendarClock, MapPin, Sparkles, UserCog, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import Image from "next/image";

const POINTS = [
  { icon: UserCog, text: "Create a professional profile customers can trust" },
  { icon: Sparkles, text: "Showcase your skills and years of experience" },
  { icon: MapPin, text: "Define the service areas you actually cover" },
  { icon: CalendarClock, text: "Set your availability and manage bookings" },
];

export function TechnicianCTA() {
  return (
    <section className="w-full border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-primary text-primary-foreground shadow-sm">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-amber-400/25 blur-2xl"
            />
            <div className="relative grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:p-14">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold">
                  <Wrench className="size-3.5" aria-hidden="true" />
                  For professionals
                </span>
                <h2 className="mt-5 max-w-xl text-pretty text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                  Turn your skills into new opportunities.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                  Join FixItNow as a technician and get discovered by customers looking for exactly
                  what you do.
                </p>
                <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {POINTS.map((p) => (
                    <li key={p.text} className="flex min-w-0 items-start gap-2.5 text-sm">
                      <p.icon
                        className="mt-0.5 size-4 shrink-0 text-amber-400"
                        aria-hidden="true"
                      />
                      <span className="text-primary-foreground/85">{p.text}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" size="lg" className="mt-8 w-full gap-2 sm:w-auto">
                  Join as a Technician
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              </div>
              <div className="min-w-0">
                <Image
                  src="/assets/technician-cta.png"
                  alt="Illustration of two home service professionals with tool belts reviewing bookings on a tablet"
                  loading="lazy"
                  width={1024}
                  height={896}
                  className="mx-auto w-full max-w-sm object-contain lg:max-w-md"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}