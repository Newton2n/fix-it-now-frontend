import { CalendarCheck, Search, UserCheck, Clock } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const STEPS = [
  {
    n: "01",
    icon: Search,
    title: "Choose a service",
    body: "Start from a category or search for the exact job you need done at home.",
  },
  {
    n: "02",
    icon: UserCheck,
    title: "Find the right professional",
    body: "Compare skills, experience and service areas on each technician profile.",
  },
  {
    n: "03",
    icon: Clock,
    title: "Check availability",
    body: "See the slots a technician has opened before you commit to a time.",
  },
  {
    n: "04",
    icon: CalendarCheck,
    title: "Book your service",
    body: "Confirm the booking, pay securely online, and manage everything in one place.",
  },
];

export function HowItWorks() {
  return (
    <section className="w-full border-b border-border bg-background py-16 lg:py-24">
      <div className="section-x mx-auto max-w-[110rem] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="How FixItNow works"
            title="Four steps from problem to solved."
            description="A booking flow built around real availability, not guesswork."
          />
        </Reveal>

        <ol className="relative mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4">
          {/* Connecting line for ultra-wide desktop displays */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-6 hidden h-px bg-border xl:block"
          />

          {STEPS.map((step, i) => (
            <Reveal 
              as="li" 
              key={step.n} 
              delay={i * 90} 
              className="relative min-w-0 rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm transition-all duration-300 hover:border-border hover:bg-card hover:shadow-md sm:p-7 xl:border-none xl:bg-transparent xl:p-0 xl:shadow-none"
            >
              <div className="flex items-center justify-between xl:justify-start xl:gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-border bg-card text-primary shadow-sm xl:bg-background">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-display text-2xl font-semibold text-muted-foreground/40 xl:text-muted-foreground/50">
                  {step.n}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}