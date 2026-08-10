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
      const progress = Math.min((currentTime - startTime) / duration, 1);
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

export function ApplicationStats({ stats }: ApplicationStatsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag and smooth momentum states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

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

  // Large dataset clone for infinite scrolling buffer
  const duplicatedStats = [
    ...platformStats,
    ...platformStats,
    ...platformStats,
    ...platformStats,
    ...platformStats,
    ...platformStats,
    ...platformStats,
    ...platformStats,
  ];

  // Center the scroll position on mount
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollLeft = el.scrollWidth / 3;
    }
  }, []);

  // Seamless infinite loop handling with boundary protection
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || isDragging) return;

    const thirdWidth = el.scrollWidth / 3;

    if (el.scrollLeft < thirdWidth * 0.4) {
      el.scrollLeft += thirdWidth;
    } else if (el.scrollLeft > thirdWidth * 2.2) {
      el.scrollLeft -= thirdWidth;
    }
  };

  // Momentum Glide Animation after release
  const applyMomentum = () => {
    const el = scrollRef.current;
    if (!el) return;

    if (Math.abs(velocityRef.current) > 0.5) {
      el.scrollLeft -= velocityRef.current;
      velocityRef.current *= 0.92; // Friction factor for smooth glide decay
      rafIdRef.current = requestAnimationFrame(applyMomentum);
    } else {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    }
  };

  // Mouse Drag Start
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  // Mouse Drag Move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;

    const x = e.pageX - el.offsetLeft;
    const walk = x - startX;
    
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = (e.pageX - lastXRef.current) / (dt / 16); // Normalize velocity
    }

    lastXRef.current = e.pageX;
    lastTimeRef.current = now;

    el.scrollLeft = scrollLeftState - walk;

    // Maintain infinite bounds while dragging
    const thirdWidth = el.scrollWidth / 3;
    if (el.scrollLeft < thirdWidth * 0.4) {
      el.scrollLeft += thirdWidth;
      setScrollLeftState(el.scrollLeft);
    } else if (el.scrollLeft > thirdWidth * 2.2) {
      el.scrollLeft -= thirdWidth;
      setScrollLeftState(el.scrollLeft);
    }
  };

  // Mouse Drag End / Release with momentum kick-off
  const handleMouseUpOrLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
    rafIdRef.current = requestAnimationFrame(applyMomentum);
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="application-stats-title"
      className="w-full overflow-hidden py-12 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
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

        {/* Scrollable Container with Smooth Momentum and Auto-Spin */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`group mt-8 sm:mt-10 relative w-full overflow-x-auto overflow-y-hidden py-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <div
            className="flex gap-3 sm:gap-4 w-max group-hover:[animation-play-state:paused]"
            style={{
              animation: isDragging ? "none" : "marqueeRight 60s linear infinite",
              willChange: "transform",
            }}
          >
            {duplicatedStats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={`${stat.label}-${index}`}
                  className="w-[210px] sm:w-[280px] shrink-0 pointer-events-none sm:pointer-events-auto"
                >
                  <Card className="flex h-full min-w-0 items-center gap-3 sm:gap-4 rounded-2xl border-border bg-card p-3.5 sm:p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
                    <div className="grid size-10 sm:size-12 shrink-0 place-items-center rounded-xl bg-secondary text-primary transition-transform duration-300 group-hover:scale-105">
                      <Icon
                        className="size-4 sm:size-5"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xl font-bold tracking-tight sm:text-3xl">
                        <AnimatedNumber
                          value={stat.value}
                          suffix={stat.suffix}
                          decimals={stat.decimals}
                          startAnimation={isInView}
                        />
                      </p>

                      <p className="mt-0.5 sm:mt-1 truncate text-xs sm:text-sm text-muted-foreground">
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
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-33.333%);
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}