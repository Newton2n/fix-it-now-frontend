"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck,
  UserPlus,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import Image from "next/image";

const POINTS = [
  { icon: FileCheck, text: "Create your professional profile" },
  { icon: Wrench, text: "Add your skills, experience, and service areas" },
  { icon: Clock, text: "Submit your profile for admin verification" },
];

/** Technician CTA section reflecting the official onboarding and admin verification workflow. */
export function TechnicianCTA() {
  return (
    <section className="w-full border-b border-border bg-background py-20 lg:py-28">
      {/* Expanded container matching ultra-wide 4K display widths (max-w-[1920px]) while preserving responsive padding alignment */}
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-xl dark:border-primary/30 dark:from-card dark:via-card dark:to-background dark:text-foreground">
            {/* Background ambient light styling adhering strictly to theme palette */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary-foreground/10 blur-3xl dark:bg-primary/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -bottom-24 size-96 rounded-full bg-primary-foreground/10 blur-3xl dark:bg-primary/5"
            />

            <div className="relative grid items-center gap-12 p-8 sm:p-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:p-16">
              <div className="min-w-0 flex flex-col items-start">
                {/* Eyebrow Badge */}
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md dark:bg-primary/10 dark:text-primary border border-primary-foreground/10 dark:border-primary/20">
                  <Wrench
                    className="size-3.5 text-primary-foreground dark:text-primary"
                    aria-hidden="true"
                  />
                  For professionals & experts
                </span>

                {/* Heading */}
                <h2 className="mt-6 max-w-2xl text-pretty text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Become a verified FixItNow technician.
                </h2>

                {/* Description */}
                <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-primary-foreground/85 dark:text-muted-foreground font-normal">
                  Register as a technician, create your professional profile
                  with your skills and experience, then submit it for
                  verification. Once approved, you can offer your services
                  through FixItNow.
                </p>

                {/* Feature Points Grid */}
                <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 w-full">
                  {POINTS.map((p) => (
                    <li
                      key={p.text}
                      className="flex min-w-0 items-start gap-3 text-sm font-medium"
                    >
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 dark:bg-primary/10 text-primary-foreground dark:text-primary">
                        <p.icon className="size-3.5" aria-hidden="true" />
                      </span>
                      <span className="text-primary-foreground/90 dark:text-foreground/90">
                        {p.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Illustration / Image Container */}
              <div className="min-w-0 flex items-center justify-center">
                <div className="relative w-full max-w-md lg:max-w-lg rounded-2xl bg-gradient-to-tr from-primary-foreground/5 to-primary-foreground/10 dark:from-card dark:to-muted/50 p-6 border border-primary-foreground/10 dark:border-border/80 backdrop-blur-md shadow-2xl">
                  <Image
                    src="/assets/technician-cta.png"
                    alt="Illustration of two home service professionals with tool belts reviewing bookings on a tablet"
                    loading="lazy"
                    width={1024}
                    height={896}
                    className="mx-auto w-full h-auto object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
