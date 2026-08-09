import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto grid w-full max-w-none gap-10 px-4 py-10 md:px-6 md:py-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,520px)] lg:items-center lg:py-20">
        {/* Left Content */}
        <div className="max-w-2xl space-y-6">
          <p className="inline-flex rounded-full border bg-background px-4 py-1 text-sm font-medium text-muted-foreground">
            Trusted Home Services
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Welcome to FixItNow
            <span className="block text-primary">When You Need Them</span>
          </h1>

          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Find trusted professionals for your home. Browse available services,
            explore categories, and book the right technician for your needs.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/services">Explore Services</Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="/categories">View Categories</Link>
            </Button>
          </div>
        </div>

        {/* Right Content */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/services"
            className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-medium text-muted-foreground">
              Find a Service
            </p>

            <h2 className="mt-2 text-xl font-semibold text-foreground">
              Browse Services
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Explore available home services and find what you need.
            </p>

            <span className="mt-4 inline-block text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
              View services →
            </span>
          </Link>

          <Link
            href="/categories"
            className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-medium text-muted-foreground">
              Explore Categories
            </p>

            <h2 className="mt-2 text-xl font-semibold text-foreground">
              View Categories
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Find the right type of service for your home.
            </p>

            <span className="mt-4 inline-block text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
              View categories →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
