"use client";

import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarCheck,
  ShieldCheck,
  Star,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

import { Card } from "@/components/ui/card";
import type { AppStats } from "@/types/stats";

type ApplicationStatsProps = {
  stats: AppStats;
};

type StatItem = {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  icon: typeof ShieldCheck;
};

function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
  startAnimation,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  startAnimation: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    const duration = 1200;
    const startTime = performance.now();

    let frameId: number;

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1,
      );

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(value * easedProgress);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [value, startAnimation]);

  return (
    <>
      {displayValue.toFixed(decimals)}
      {suffix}
    </>
  );
}

export function ApplicationStats({
  stats,
}: ApplicationStatsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.25,
  });

  const platformStats: StatItem[] = [
    {
      label: "Verified Technicians",
      value: stats.verifiedTechnicianCount,
      suffix: "+",
      icon: ShieldCheck,
    },
    {
      label: "Available Services",
      value: stats.servicesCount,
      suffix: "+",
      icon: BriefcaseBusiness,
    },
    {
      label: "Total Bookings",
      value: stats.bookingCount,
      suffix: "+",
      icon: CalendarCheck,
    },
    {
      label: "Average Rating",
      value: stats.averageRating,
      suffix: "/5",
      decimals: 1,
      icon: Star,
    },
  ];

  // Hexuplicate the array to ensure seamless infinite looping across ultra-wide 4K displays
  const duplicatedStats = [
    ...platformStats,
    ...platformStats,
    ...platformStats,
    ...platformStats,
    ...platformStats,
    ...platformStats,
  ];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="application-stats-title"
      className="w-full overflow-hidden py-16 lg:py-24"
    >
      {/* Expanded container to match ultra-wide 4K display widths (max-w-[1920px]) while preserving internal padding alignment */}
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mx-auto w-full max-w-2xl text-center"
        >
          <span className="text-sm font-medium text-primary">
            FixItNow at a glance
          </span>

          <h2
            id="application-stats-title"
            className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
          >
            A growing home service platform
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Real platform activity from FixItNow.
          </p>
        </motion.div>

        {/* Ultra-wide Marquee Container */}
        <div className="group mt-10 relative w-full overflow-hidden py-2">
          <div 
            className="flex gap-4 w-max hover:[animation-play-state:paused]"
            style={{
              animation: "marqueeRight 50s linear infinite",
              willChange: "transform",
            }}
          >
            {duplicatedStats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={`${stat.label}-${index}`}
                  className="w-[260px] sm:w-[280px] shrink-0"
                >
                  <Card className="flex h-full min-w-0 items-center gap-4 rounded-2xl border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
                    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-primary transition-transform duration-300 group-hover:scale-105">
                      <Icon
                        className="size-5"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                        <AnimatedNumber
                          value={stat.value}
                          suffix={stat.suffix}
                          decimals={stat.decimals}
                          startAnimation={isInView}
                        />
                      </p>

                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>

          <style jsx global>{`
            @keyframes marqueeRight {
              0% {
                transform: translateX(-50%);
              }
              100% {
                transform: translateX(0%);
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}