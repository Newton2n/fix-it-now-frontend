"use client";

import { useEffect, useState } from "react";
import { 
  ArrowRight, 
  BadgeCheck, 
  CalendarCheck, 
  ShieldCheck, 
  ChevronDown, 
  Wrench, 
  Sparkles, 
  Star, 
  Users, 
  Zap, 
  CreditCard 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const HERO_SLIDES = [
  {
    id: "technician",
    eyebrow: "Trusted Professionals",
    title: "Reliable help for every job around the house.",
    description: "Find skilled pros, check their experience, see when they are free, and book with total peace of mind.",
    image: "/assets/technician.png",
    badgeIcon: BadgeCheck,
    badgeText: "100% Verified Experts",
    accentColor: "from-primary/15 via-primary/5 to-transparent",
  },
  {
    id: "repairs",
    eyebrow: "Home Repairs",
    title: "Expert help for fixing things around the house.",
    description: "From leaky pipes and electrical fixes to general home upkeep, connect easily with trusted local pros.",
    image: "/assets/technician-repair.png",
    badgeIcon: Wrench,
    badgeText: "Reliable Repairs",
    accentColor: "from-blue-500/15 via-indigo-500/5 to-transparent",
  },
  {
    id: "booking",
    eyebrow: "Easy & Secure",
    title: "Simple scheduling with safe payments.",
    description: "Pick a time that fits your day, track your service live, and pay safely only when you're happy.",
    image: "/assets/booking.png",
    badgeIcon: CalendarCheck,
    badgeText: "Easy Booking",
    accentColor: "from-emerald-500/15 via-teal-500/5 to-transparent",
  },
  {
    id: "hero3",
    eyebrow: "Live Schedules",
    title: "See who is available right now.",
    description: "Check professional schedules instantly and choose the exact time slot that works best for your routine.",
    image: "/assets/hero3.png",
    badgeIcon: CalendarCheck,
    badgeText: "Live Availability",
    accentColor: "from-teal-500/15 via-cyan-500/5 to-transparent",
  },
  {
    id: "hero2",
    eyebrow: "Smooth & Fast",
    title: "A smooth experience built for you.",
    description: "Enjoy a fast, hassle-free booking platform that gets things done without any delays.",
    image: "/assets/hero2.png",
    badgeIcon: Zap,
    badgeText: "Super Fast & Easy",
    accentColor: "from-amber-500/15 via-orange-500/5 to-transparent",
  },
  {
    id: "review",
    eyebrow: "Real Feedback",
    title: "Read honest reviews from real homeowners.",
    description: "See what other neighbors have to say and read genuine feedback before booking your next service.",
    image: "/assets/review.png",
    badgeIcon: Star,
    badgeText: "Trusted by Homeowners",
    accentColor: "from-purple-500/15 via-pink-500/5 to-transparent",
  },
  {
    id: "technician-cta",
    eyebrow: "Join Our Team",
    title: "Grow your business as a service pro.",
    description: "Sign up to offer your skills, manage your calendar easily, and connect with local customers nearby.",
    image: "/assets/technician-cta.png",
    badgeIcon: Users,
    badgeText: "Become a Partner",
    accentColor: "from-cyan-500/15 via-blue-500/5 to-transparent",
  },
];

const PLATFORM_FEATURES = [
  {
    title: "Role-Based Access Control",
    description: "Secure separation of privileges for Customers, Technicians, and Platform Admins.",
    icon: ShieldCheck,
  },
  {
    title: "Stripe Escrow Integration",
    description: "Frictionless checkout pipelines backed by real-time webhook status synchronization.",
    icon: CreditCard,
  },
  {
    title: "Instant State Revalidation",
    description: "Next.js App Router caching architecture ensuring sub-second rendering with live data updates.",
    icon: Zap,
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [key, setKey] = useState(0); // Resets progress animation smoothly on slide change

  // Infinite looping auto-advance slider every 6 seconds unless hovered/paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      setKey((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleManualSlideChange = (index: number) => {
    setCurrentSlide(index);
    setKey((prev) => prev + 1);
  };

  const slide = HERO_SLIDES[currentSlide];
  const BadgeIcon = slide.badgeIcon;

  return (
    <div className="flex flex-col w-full bg-background selection:bg-primary/25 overflow-x-hidden">
      {/* ================= HERO MAIN SECTION ================= */}
      <section 
        id="top" 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative flex min-h-[75vh] lg:min-h-[90vh] w-full flex-col justify-between overflow-hidden border-b border-border bg-background py-6 sm:py-12 lg:py-20"
      >
        {/* Background Structural Radiance & Grid Pattern */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 0.8 }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] [background-size:24px_24px]"
        />
        
        {/* Dynamic Ambient Background Glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-[800px] rounded-full bg-primary/10 blur-[150px] transition-all duration-700" />

        {/* Main Content Area: Responsive padding & spacing optimized for small screens while preserving massive size on large screens */}
        <div className="relative mx-auto flex w-full max-w-[1920px] flex-1 items-center px-4 sm:px-8 lg:px-16 xl:px-24">
          <div className="grid w-full grid-cols-1 items-center gap-6 sm:gap-16 lg:grid-cols-12 lg:gap-20 xl:gap-28">
            
            {/* Top Column on Mobile / Right Column on Desktop: Visual Frame */}
            <div className="relative mx-auto w-full lg:col-span-6 xl:col-span-5 flex items-center justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-[280px] sm:max-w-xl xl:max-w-2xl aspect-[16/11] flex items-center justify-center">
                
                {/* Backlit Accent Glow matching active slide */}
                <div
                  aria-hidden="true"
                  className={cn("absolute -inset-4 sm:-inset-6 rounded-2xl sm:rounded-3xl bg-gradient-to-tr blur-2xl sm:blur-3xl transition-all duration-500 opacity-90", slide.accentColor)}
                />

                {/* Main Visual Card Container */}
                <div className="relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border/85 bg-card/75 p-3.5 sm:p-8 xl:p-10 shadow-lg sm:shadow-2xl backdrop-blur-2xl flex items-center justify-center">
                  
                  {/* Image Transition Effect */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slide.id + "-img"}
                      initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 1.03, filter: "blur(4px)" }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="w-full flex items-center justify-center"
                    >
                      <Image
                        src={slide.image}
                        width={1400}
                        height={1120}
                        priority
                        alt="Home service professional illustration"
                        className="h-auto w-full max-h-[160px] sm:max-h-[380px] xl:max-h-[480px] object-contain drop-shadow-md select-none pointer-events-none transition-transform duration-500 hover:scale-105"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Floating Feature Badge */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={slide.id + "-badge"}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="absolute bottom-2.5 left-2.5 sm:bottom-8 sm:left-8 flex items-center gap-1.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-border/85 bg-background/95 px-2.5 py-1.5 sm:px-6 sm:py-4 shadow-md sm:shadow-xl backdrop-blur-md"
                    >
                      <div className="grid size-5 sm:size-10 shrink-0 place-items-center rounded-lg sm:rounded-xl bg-primary/10 text-primary">
                        <BadgeIcon className="size-3 sm:size-6" />
                      </div>
                      <span className="text-[10px] sm:text-base font-semibold text-foreground tracking-tight whitespace-nowrap">{slide.badgeText}</span>
                    </motion.div>
                  </AnimatePresence>

                </div>
              </div>
            </div>

            {/* Bottom Column on Mobile / Left Column on Desktop: Content */}
            <div className="flex flex-col items-start w-full min-w-0 lg:col-span-6 xl:col-span-7 order-2 lg:order-1">
              
              {/* Animated Eyebrow Badge */}
              <div className="min-h-[28px] sm:min-h-[36px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={slide.id + "-eyebrow"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-2 rounded-full border border-border/85 bg-card/90 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-foreground shadow-xs backdrop-blur-md"
                  >
                    <span className="flex size-2 sm:size-2.5 rounded-full bg-primary animate-pulse shrink-0" />
                    <ShieldCheck className="size-3.5 sm:size-4 text-primary shrink-0" aria-hidden="true" />
                    <span className="truncate">{slide.eyebrow}</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Smooth Title Animation Container with Large Screen Scaling */}
              <div className="mt-2 sm:mt-5 w-full flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.h1 
                    key={slide.id + "-title"}
                    initial={{ opacity: 0, y: 16, filter: "blur(3px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(3px)" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="text-2xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-foreground text-balance leading-[1.15] sm:leading-[1.08]"
                  >
                    {slide.title}
                  </motion.h1>
                </AnimatePresence>
              </div>

              {/* Smooth Description Animation Container */}
              <div className="mt-2 sm:mt-4 w-full">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={slide.id + "-desc"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="text-xs sm:text-lg lg:text-xl xl:text-2xl text-muted-foreground leading-relaxed max-w-2xl xl:max-w-3xl text-pretty font-normal"
                  >
                    {slide.description}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Production-grade CTA Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="mt-5 sm:mt-10 flex w-full flex-col sm:flex-row gap-3 sm:gap-5 sm:items-center"
              >
                <Button asChild size="lg" className="w-full sm:w-auto gap-2.5 px-6 py-5 sm:px-9 sm:py-7 text-sm sm:text-lg font-semibold shadow-md transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]">
                  <Link href="/services">
                    Find a Service
                    <ArrowRight aria-hidden="true" className="size-4 sm:size-5 shrink-0" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-6 py-5 sm:px-9 sm:py-7 text-sm sm:text-lg font-semibold transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]">
                  <Link href="/technicians">
                    Browse Technicians
                  </Link>
                </Button>
              </motion.div>

              {/* Interactive Progress Indicators */}
              <div className="mt-5 sm:mt-10 flex items-center gap-2.5 sm:gap-3.5" role="tablist" aria-label="Hero slider controls">
                {HERO_SLIDES.map((s, index) => (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={currentSlide === index}
                    aria-label={`Go to slide ${index + 1}: ${s.title}`}
                    onClick={() => handleManualSlideChange(index)}
                    className={cn(
                      "relative h-1.5 sm:h-2 rounded-full transition-all duration-300 overflow-hidden",
                      currentSlide === index ? "w-8 sm:w-12 bg-primary shadow-xs" : "w-2 sm:w-3 bg-border hover:bg-muted-foreground/40"
                    )}
                  >
                    {currentSlide === index && !isPaused && (
                      <motion.span 
                        key={key}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 6, ease: "linear" }}
                        className="absolute inset-0 bg-primary-foreground/30 block"
                      />
                    )}
                  </button>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="w-full pb-3 justify-center bg-gradient-to-t from-background via-background/60 to-transparent pt-6 hidden sm:flex">
          <a 
            href="#categories" 
            aria-label="Scroll down to service categories section"
            className="group flex flex-col items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <span>Explore Categories</span>
            <ChevronDown className="size-5 transition-transform duration-300 group-hover:translate-y-1 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ================= PLATFORM ARCHITECTURE & TECH HIGHLIGHTS ================= */}
      <section className="w-full border-b border-border bg-background py-12 sm:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-8 lg:px-16 xl:px-24">
          
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-primary">
              <Sparkles className="size-3.5 sm:size-4 shrink-0" />
              <span>Full-Stack Architecture</span>
            </div>
            <h2 className="mt-3 sm:mt-5 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
              Engineered for absolute reliability & scale
            </h2>
            <p className="mt-2.5 sm:mt-4 text-xs sm:text-lg lg:text-xl text-muted-foreground text-pretty">
              FixItNow is built with modern full-stack workflows, ensuring secure authentication, automated webhooks, and streamlined booking mechanics.
            </p>
          </div>

          <div className="mt-10 sm:mt-20 grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-3">
            {PLATFORM_FEATURES.map((feature, idx) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-5 sm:p-10 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-lg backdrop-blur-md"
                >
                  <div className="flex flex-col gap-3 sm:gap-5">
                    <div className="grid size-11 sm:size-16 place-items-center rounded-xl sm:rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-inner">
                      <FeatureIcon className="size-5 sm:size-8" />
                    </div>
                    <h3 className="text-lg sm:text-2xl font-semibold tracking-tight text-foreground">{feature.title}</h3>
                    <p className="text-xs sm:text-lg leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>
    </div>
  );
}