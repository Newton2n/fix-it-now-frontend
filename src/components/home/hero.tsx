import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Hero() {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 lg:flex-row lg:items-center lg:py-8">
        <div className="max-w-2xl space-y-6">
          <p className="inline-flex rounded-full border bg-background px-4 py-1 text-sm font-medium text-muted-foreground">
            Trusted Home Services
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Welcome to FixItNow
            <span className="block text-primary">When You Need Them</span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            Find trusted professionals for your home. Book qualified technicians
            quickly and easily with a smooth, reliable service experience.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Search services, technicians, or location..."
              className="h-12 max-w-xl"
            />
            <Button size="lg" className="h-12 px-6">
              Search Now
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" >
              <Link href="/services">Browse Services</Link>
            </Button>
            <Button variant="secondary" size="sm">
              Top Rated Technicians
            </Button>
          </div>
        </div>

        <div className="grid w-full max-w-xl grid-cols-2 gap-4">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Available Services</p>
            <h3 className="mt-2 text-3xl font-bold text-foreground">120+</h3>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Verified Technicians</p>
            <h3 className="mt-2 text-3xl font-bold text-foreground">80+</h3>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Happy Customers</p>
            <h3 className="mt-2 text-3xl font-bold text-foreground">1k+</h3>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Average Rating</p>
            <h3 className="mt-2 text-3xl font-bold text-foreground">4.9/5</h3>
          </div>
        </div>
      </div>
    </section>
  );
}