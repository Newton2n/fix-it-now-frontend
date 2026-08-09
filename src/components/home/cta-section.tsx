import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="w-full px-4 py-12 md:px-6">
      <div className="mx-auto flex w-full flex-col gap-6 rounded-2xl border bg-primary px-6 py-12 text-primary-foreground md:px-10 lg:max-w-6xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">Ready to book your service?</h2>
            <p className="mt-3 text-sm opacity-90">
              Join FixItNow today and connect with trusted professionals in your
              area.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" asChild>
              <Link href="/services">Explore Services</Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
