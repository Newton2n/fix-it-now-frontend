import Link from "next/link";
import { ArrowRight, CheckCircle2, Home, Search, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-accent/20">
      <div className="mx-auto grid w-full grid-cols-1 gap-12 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-center lg:gap-16 lg:px-[clamp(2rem,6vw,7rem)] lg:py-[clamp(4rem,9vw,8rem)]">
        <div className="reveal-up min-w-0 max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
            <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
            Trusted home help, made simple
          </div>
          <h1 className="max-w-3xl text-balance text-[clamp(2.7rem,7vw,5.8rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-foreground">
            Get your home back in shape.
            <span className="mt-3 block text-primary">FixItNow.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Book reliable technicians for the jobs that keep life moving—from quick repairs to the projects you have been putting off.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="group h-12 px-6 shadow-lg shadow-primary/15" asChild>
              <Link href="/services">
                Find a service <ArrowRight className="transition-transform group-hover:translate-x-1" data-icon="inline-end" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 bg-card/70 px-6" asChild>
              <Link href="/technicians">Meet our technicians</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
            {['Verified professionals', 'Clear booking flow', 'Support when needed'].map((item) => (
              <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="text-primary" data-icon="inline-start" />{item}</span>
            ))}
          </div>
        </div>

        <div className="reveal-up relative min-w-0 lg:justify-self-end" style={{ animationDelay: '120ms' }}>
          <div className="relative mx-auto aspect-[0.94] w-full max-w-[38rem] overflow-hidden rounded-[2rem] border bg-card p-5 shadow-2xl shadow-primary/10 sm:p-7">
            <div className="absolute inset-x-5 top-5 flex items-center justify-between text-xs font-medium text-muted-foreground sm:inset-x-7 sm:top-7">
              <span className="inline-flex items-center gap-2"><Home data-icon="inline-start" />Your home, handled</span>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">Today</span>
            </div>
            <div className="flex h-full flex-col justify-center gap-5 pt-8">
              <div className="relative mx-auto flex aspect-square w-[62%] items-center justify-center rounded-full bg-accent/70 text-primary">
                <div className="absolute -right-3 top-8 rounded-xl border bg-card p-3 shadow-lg sm:-right-7"><Wrench data-icon="inline-start" /></div>
                <div className="flex size-24 items-center justify-center rounded-[2rem] bg-primary text-primary-foreground shadow-xl sm:size-32"><Home className="size-12 sm:size-16" /></div>
                <div className="absolute -bottom-2 -left-6 rounded-xl border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-lg">Ready when you are</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/services" className="group rounded-2xl border bg-background p-4 transition-transform hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring">
                  <Search className="mb-3 text-primary" /><p className="font-semibold">Browse jobs</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Find the right service</p>
                </Link>
                <Link href="/categories" className="group rounded-2xl border bg-background p-4 transition-transform hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring">
                  <Wrench className="mb-3 text-accent-foreground" /><p className="font-semibold">Explore skills</p><p className="mt-1 text-xs leading-5 text-muted-foreground">See what is possible</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
