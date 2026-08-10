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
// import heroIllustration from "@/assets/hero-illustration.png";

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

export function WhyFixItNow() {
  return (
    <section className="w-full border-b border-border bg-surface py-16 lg:py-24">
      <div className="section-x mx-auto grid max-w-[110rem] items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <Reveal className="min-w-0">
          <SectionHeading
            eyebrow="Why FixItNow"
            title="Built so you can hire without second-guessing."
            description="Every part of the platform exists to answer one question: is this the right professional for my home?"
          />
          <div className="relative mt-8 hidden overflow-hidden rounded-3xl border border-border bg-card lg:block">
            <Image
              src="/assets/hero-illustration.png"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={1280}
              height={1024}
              className="w-full object-contain p-6"
            />
          </div>
        </Reveal>

        <ul className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <Reveal as="li" key={b.title} delay={Math.min(i, 5) * 60} className="min-w-0">
              <Card className="flex h-full min-w-0 flex-col gap-2 rounded-2xl border-border bg-card p-5 shadow-none transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-sm">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <b.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-1 text-sm font-semibold tracking-tight sm:text-base">
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}