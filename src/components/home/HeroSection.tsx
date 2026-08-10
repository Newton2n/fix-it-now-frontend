"use client";

import { ArrowRight, BadgeCheck, CalendarCheck, CreditCard, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const TRUST = [
  { icon: Users, label: "Trusted professionals" },
  { icon: BadgeCheck, label: "Verified profiles" },
  { icon: CalendarCheck, label: "Flexible booking" },
  { icon: CreditCard, label: "Secure payments" },
];

export function HeroSection() {
  return (
    <section id="top" className="relative w-full overflow-hidden border-b border-border bg-background">
      {/* Background Grid Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] [background-size:24px_24px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          
          {/* Left Column: Content */}
          <div className="flex flex-col items-start min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <ShieldCheck className="size-3.5 text-primary shrink-0" aria-hidden="true" />
              Home services, handled properly
            </span>

            <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground text-balance">
              Trusted help for every job at home.
            </h1>

            <p className="mt-4 text-base text-muted-foreground sm:text-lg text-pretty leading-relaxed">
              Find skilled professionals, browse services by category, check experience, service areas
              and availability — then book with confidence and get the job done.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" className="w-full gap-2 sm:w-auto shadow-sm">
                Find a Service
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Browse Technicians
              </Button>
            </div>

            <ul className="mt-10 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-center sm:gap-6">
              {TRUST.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium"
                >
                  <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Visual / Illustration */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none min-w-0">
            <div
              aria-hidden="true"
              className="absolute inset-4 sm:inset-6 rounded-3xl bg-card/60 ring-1 ring-border shadow-inner"
            />
            
            <Image
              src="/assets/hero-illustration.png"
              width={1280}
              height={1024}
              priority
              alt="Illustration of a home service technician with a toolbox beside a house, tools and a service van"
              className="relative mx-auto w-full h-auto object-contain max-h-[380px] sm:max-h-[440px] lg:max-h-[500px]"
            />

            {/* Floating Badge 1 */}
            <div
              aria-hidden="true"
              className="absolute left-2 top-4 sm:left-4 sm:top-8 flex items-center gap-2 rounded-xl border border-border bg-card/95 px-3 py-2 text-xs font-medium shadow-md backdrop-blur-sm"
            >
              <CalendarCheck className="size-4 text-primary shrink-0" />
              <span>Availability-aware booking</span>
            </div>

            {/* Floating Badge 2 */}
            <div
              aria-hidden="true"
              className="absolute right-2 bottom-4 sm:right-4 sm:bottom-8 flex items-center gap-2 rounded-xl border border-border bg-card/95 px-3 py-2 text-xs font-medium shadow-md backdrop-blur-sm"
            >
              <BadgeCheck className="size-4 text-amber-500 shrink-0" />
              <span>Verified technician profiles</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}