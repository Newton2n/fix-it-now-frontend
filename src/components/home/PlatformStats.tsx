"use client"
import { useEffect, useRef, useState } from "react";
import { CalendarCheck, Users, Wrench, LayoutGrid } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import type { PlatformStats as Stats } from "./types";

function useCountUp(value: number | undefined) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === undefined) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 900);
        setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return { ref, display };
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value?: number | undefined;
}) {
  const { ref, display } = useCountUp(value);
  return (
    <li className="min-w-0 rounded-2xl border border-border bg-card p-5">
      <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <p ref={ref} className="font-display mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
        {value === undefined ? (
          <span className="text-xl text-muted-foreground sm:text-2xl">Growing every day</span>
        ) : (
          display.toLocaleString()
        )}
      </p>
      <p className="mt-1 truncate text-sm text-muted-foreground">{label}</p>
    </li>
  );
}

/** Values are optional on purpose — no numbers are invented when data is missing. */
export function PlatformStats({ stats = {} }: { stats?: Stats }) {
  return (
    <section className="w-full border-b border-border bg-surface py-14 lg:py-20">
      <div className="section-x mx-auto max-w-[110rem]">
        <Reveal>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatItem icon={Users} label="Registered customers" value={stats.customers} />
            <StatItem icon={Wrench} label="Verified technicians" value={stats.technicians} />
            <StatItem icon={CalendarCheck} label="Completed bookings" value={stats.bookings} />
            <StatItem icon={LayoutGrid} label="Available services" value={stats.services} />
          </ul>
        </Reveal>
      </div>
    </section>
  );
}