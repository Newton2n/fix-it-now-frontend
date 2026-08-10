import {
  BadgeCheck,
  CalendarCheck,
  CreditCard,
  FileText,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal, SectionHeading } from "./Reveal";
import Image from "next/image";

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Verified technician profiles",
    body: "Skills, experience and service areas are presented on every profile.",
  },
  {
    icon: FileText,
    title: "Clear service information",
    body: "Know what a job includes before you book it.",
  },
  {
    icon: CalendarCheck,
    title: "Availability-aware booking",
    body: "Book only the slots a technician has actually opened.",
  },
  {
    icon: CreditCard,
    title: "Convenient online payments",
    body: "Pay for your booking securely from your account.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent booking process",
    body: "Track status from request to completion, with no hidden steps.",
  },
  {
    icon: Star,
    title: "Reviews and ratings",
    body: "Feedback from completed bookings appears on technician profiles.",
  },
];

/** Redesigned WhyFixItNow section optimized for ultra-wide 4K viewports (max-w-[1920px]) with theme alignment and complete device responsiveness. */
export function WhyFixItNow() {
  return (
    <section className="w-full border-b border-border bg-background py-20 lg:py-28 overflow-hidden">
      
      {/* Expanded container matching ultra-wide 4K display widths (max-w-[1920px]) while preserving responsive padding alignment */}
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          
          {/* Left Column: Heading and Illustration */}
          <Reveal className="min-w-0 flex flex-col justify-center">
            <SectionHeading
              eyebrow="Why FixItNow"
              title="Built so you can hire without second-guessing."
              description="Every part of the platform exists to answer one question: is this the right professional for my home?"
            />
            
            <div className="relative mt-8 hidden overflow-hidden rounded-3xl border border-border bg-card/60 lg:block shadow-sm backdrop-blur-md">
              <Image
                src="/assets/hero2.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={1280}
                height={1024}
                className="w-full object-contain p-6 transition-transform duration-500 hover:scale-105"
              />
            </div>
          </Reveal>

          {/* Right Column: Benefits Grid */}
          <ul className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
            {BENEFITS.map((b, i) => (
              <Reveal as="li" key={b.title} delay={Math.min(i, 5) * 60} className="min-w-0 h-full flex">
                <Card className="flex h-full w-full min-w-0 flex-col gap-3 rounded-2xl border border-border bg-card/80 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg backdrop-blur-md">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary shadow-inner">
                    <b.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground">
                    {b.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {b.body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </ul>

        </div>

      </div>
    </section>
  );
}