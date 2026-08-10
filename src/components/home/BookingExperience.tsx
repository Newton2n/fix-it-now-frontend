import { CalendarCheck, CheckCircle2, Clock, UserCheck, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Reveal, SectionHeading } from "./Reveal";

const PIECES = [
  { icon: Wrench, label: "Service", value: "The job you need done" },
  { icon: UserCheck, label: "Technician", value: "The professional you picked" },
  { icon: CalendarCheck, label: "Date", value: "A day they work your area" },
  { icon: Clock, label: "Time", value: "A slot they left open" },
];

export function BookingExperience() {
  return (
    <section className="w-full border-b border-border bg-surface py-16 lg:py-24">
      <div className="section-x mx-auto grid max-w-[110rem] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <Reveal className="min-w-0">
          <SectionHeading
            eyebrow="Booking experience"
            title="Booking that respects real availability."
            description="FixItNow assembles a booking from four pieces, so a confirmed job is one the technician can actually take."
          />
          <ul className="mt-8 space-y-3">
            {[
              "Pick the service and see exactly what it covers",
              "Choose a technician whose area includes your address",
              "Select from the slots that technician has opened",
              "Confirm, pay online, and manage the booking from your account",
            ].map((item) => (
              <li key={item} className="flex min-w-0 items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="min-w-0">
          <Card className="min-w-0 rounded-3xl border-border bg-card p-5 shadow-sm sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Booking summary
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PIECES.map((piece) => (
                <li
                  key={piece.label}
                  className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-border bg-surface p-4"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-primary">
                    <piece.icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">{piece.label}</span>
                    <span className="block truncate text-sm font-medium">{piece.value}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Separator className="my-6" />
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <p className="min-w-0 text-sm text-muted-foreground">
                Everything is confirmed in one step — the technician gets the request instantly.
              </p>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground">
                <CalendarCheck className="size-3.5" aria-hidden="true" />
                Booking ready
              </span>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}