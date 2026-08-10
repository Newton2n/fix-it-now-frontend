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
  CheckCircle2, 
  Star, 
  Users, 
  Zap, 
  Lock, 
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
    eyebrow: "Verified Professional Network",
    title: "Trusted help for every job at home.",
    description: "Find skilled professionals, browse verified categories, check real experience, and view live availability — book with absolute confidence.",
    image: "/assets/technician.png",
    badgeIcon: BadgeCheck,
    badgeText: "100% Verified Experts",
    accentColor: "from-primary/15 via-primary/5 to-transparent",
  },
  {
    id: "repairs",
    eyebrow: "On-Demand Specialists",
    title: "Expert home repairs on demand.",
    description: "From plumbing leaks and electrical troubleshooting to precision carpentry, connect instantly with vetted specialists nearby.",
    image: "/assets/technician-repair.png",
    badgeIcon: Wrench,
    badgeText: "Instant Dispatch",
    accentColor: "from-blue-500/15 via-indigo-500/5 to-transparent",
  },
  {
    id: "booking",
    eyebrow: "Guaranteed Satisfaction",
    title: "Seamless scheduling & secure pay.",
    description: "Pick your exact time slot, track job progress live from your dashboard, and pay safely through encrypted escrow protection.",
    image: "/assets/booking.png",
    badgeIcon: CalendarCheck,
    badgeText: "Instant Booking",
    accentColor: "from-emerald-500/15 via-teal-500/5 to-transparent",
  },
  {
    id: "hero3",
    eyebrow: "Availability-Aware",
    title: "Live calendar updates in real time.",
    description: "View technician schedules instantly and book time slots that work best for your home routine.",
    image: "/assets/hero3.png",
    badgeIcon: CalendarCheck,
    badgeText: "Real-Time Sync",
    accentColor: "from-teal-500/15 via-cyan-500/5 to-transparent",
  },
  {
    id: "hero2",
    eyebrow: "Advanced Infrastructure",
    title: "Built for speed and reliability.",
    description: "Experience lightning-fast performance powered by Next.js and secure real-time backend synchronization.",
    image: "/assets/hero2.png",
    badgeIcon: Zap,
    badgeText: "Sub-Second Routing",
    accentColor: "from-amber-500/15 via-orange-500/5 to-transparent",
  },
  {
    id: "review",
    eyebrow: "Trusted Feedback",
    title: "Read honest reviews from real homeowners.",
    description: "Browse verified ratings and detailed feedback from customers before confirming your next service booking.",
    image: "/assets/review.png",
    badgeIcon: Star,
    badgeText: "4.9/5 Average Rating",
    accentColor: "from-purple-500/15 via-pink-500/5 to-transparent",
  },
  {
    id: "technician-cta",
    eyebrow: "Join Our Network",
    title: "Grow your business as a professional.",
    description: "Sign up as a vetted technician, manage your active schedule, and connect with local customers instantly.",
    image: "/assets/technician-cta.png",
    badgeIcon: Users,
    badgeText: "Partner Portal",
    accentColor: "from-cyan-500/15 via-blue-500/5 to-transparent",
  },
];

const PLATFORM_STATS = [
  { label: "Verified Technicians", value: "500+", icon: Users },
  { label: "Completed Bookings", value: "10k+", icon: CheckCircle2 },
  { label: "Customer Satisfaction", value: "4.9/5", icon: Star },
  { label: "Secured Payments", value: "100%", icon: Lock },
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

  // Auto-advance slider every 6 seconds unless hovered/paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];
  const BadgeIcon = slide.badgeIcon;

  return (
    <div className="flex flex-col w-full bg-background selection:bg-primary/25 overflow-x-hidden">
      {/* ================= HERO MAIN SECTION ================= */}
      <section 
        id="top" 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative flex min-h-[70vh] lg:h-[78vh] w-full flex-col justify-between overflow-hidden border-b border-border bg-background py-6 lg:py-0"
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
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-primary/8 blur-[130px] transition-all duration-700" />

        {/* Main Content Area */}
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            
            {/* Left Column: Interactive Slider Content */}
            <div className="flex flex-col items-start w-full min-w-0 lg:col-span-7">
              
              {/* Animated Eyebrow Badge */}
              <div className="min-h-[30px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={slide.id + "-eyebrow"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-2 rounded-full border border-border/85 bg-card/90 px-3 py-1 text-xs font-medium text-foreground shadow-xs backdrop-blur-md"
                  >
                    <span className="flex size-2 rounded-full bg-primary animate-pulse shrink-0" />
                    <ShieldCheck className="size-3.5 text-primary shrink-0" aria-hidden="true" />
                    <span className="truncate">{slide.eyebrow}</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Smooth Title Animation Container with Responsive Text Scaling */}
              <div className="mt-3 w-full flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.h1 
                    key={slide.id + "-title"}
                    initial={{ opacity: 0, y: 16, filter: "blur(3px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(3px)" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground text-balance leading-tight sm:leading-[1.1]"
                  >
                    {slide.title}
                  </motion.h1>
                </AnimatePresence>
              </div>

              {/* Smooth Description Animation Container */}
              <div className="mt-2 w-full">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={slide.id + "-desc"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed max-w-xl text-pretty"
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
                className="mt-6 flex w-full flex-col sm:flex-row gap-3 sm:items-center"
              >
                <Button asChild size="default" className="w-full sm:w-auto gap-2 shadow-sm transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]">
                  <Link href="/categories">
                    Find a Service
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="default" className="w-full sm:w-auto transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]">
                  <Link href="/technicians">
                    Browse Technicians
                  </Link>
                </Button>
              </motion.div>

              {/* Interactive Progress Indicators */}
              <div className="mt-6 flex items-center gap-3" role="tablist" aria-label="Hero slider controls">
                {HERO_SLIDES.map((s, index) => (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={currentSlide === index}
                    aria-label={`Go to slide ${index + 1}: ${s.title}`}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      "relative h-1.5 rounded-full transition-all duration-300 overflow-hidden",
                      currentSlide === index ? "w-8 bg-primary shadow-xs" : "w-2 bg-border hover:bg-muted-foreground/40"
                    )}
                  >
                    {currentSlide === index && !isPaused && (
                      <motion.span 
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

            {/* Right Column: Production Visual Frame & Dynamic Badge */}
            <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:block lg:max-w-none">
              <div className="relative mx-auto aspect-[16/10] w-full max-w-[480px] flex items-center justify-center">
                
                {/* Backlit Accent Glow matching active slide */}
                <div
                  aria-hidden="true"
                  className={cn("absolute -inset-2 rounded-3xl bg-gradient-to-tr blur-xl transition-all duration-500", slide.accentColor)}
                />

                {/* Main Visual Card Container */}
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/85 bg-card/60 p-4 sm:p-5 shadow-xl backdrop-blur-2xl flex items-center justify-center">
                  
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
                        width={1000}
                        height={800}
                        priority
                        alt="Home service professional illustration"
                        className="h-auto w-full max-h-[200px] sm:max-h-[220px] object-contain drop-shadow-sm select-none pointer-events-none"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Floating Feature Badge with Spring Animation */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={slide.id + "-badge"}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-2 rounded-xl border border-border/85 bg-background/95 px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-lg backdrop-blur-md"
                    >
                      <div className="grid size-6 sm:size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <BadgeIcon className="size-3.5 sm:size-4" />
                      </div>
                      <span className="text-[11px] sm:text-xs font-semibold text-foreground tracking-tight whitespace-nowrap">{slide.badgeText}</span>
                    </motion.div>
                  </AnimatePresence>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="w-full pb-2 flex justify-center bg-gradient-to-t from-background via-background/60 to-transparent pt-2 hidden sm:flex">
          <Link 
            href="#categories" 
            aria-label="Scroll down to service categories section"
            className="group flex flex-col items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <span>Explore Categories</span>
            <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5 animate-bounce" />
          </Link>
        </div>
      </section>

      {/* ================= PLATFORM METRICS BAR (Derived from README) ================= */}
      <section className="w-full border-b border-border bg-card/40 py-6 sm:py-8 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {PLATFORM_STATS.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex items-center gap-3 sm:gap-4 rounded-xl border border-border/60 bg-background/60 p-3.5 sm:p-4 shadow-xs"
                >
                  <div className="grid size-9 sm:size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <StatIcon className="size-4 sm:size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">{stat.value}</div>
                    <div className="text-[11px] sm:text-xs text-muted-foreground truncate">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= PLATFORM ARCHITECTURE & TECH HIGHLIGHTS ================= */}
      <section className="w-full border-b border-border bg-background py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5 shrink-0" />
              <span>Full-Stack Architecture</span>
            </div>
            <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground text-balance">
              Engineered for absolute reliability & scale
            </h2>
            <p className="mt-2 text-xs sm:text-sm lg:text-base text-muted-foreground text-pretty">
              FixItNow is built with modern full-stack workflows, ensuring secure authentication, automated webhooks, and streamlined booking mechanics.
            </p>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PLATFORM_FEATURES.map((feature, idx) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4">
                    <div className="grid size-11 sm:size-12 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <FeatureIcon className="size-5 sm:size-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">{feature.title}</h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
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