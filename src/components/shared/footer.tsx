import Link from "next/link";

import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block text-2xl font-bold text-primary transition-colors hover:opacity-90"
            >
              FixItNow
            </Link>

            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              A home service platform that connects customers with technicians
              for reliable repair and maintenance services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>

            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-1">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  href="/technicians"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Technicians
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Platform
            </h3>

            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Find services, discover technicians, manage bookings, make
              payments, and share your experience through reviews.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 text-center text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© 2026 FixItNow. All rights reserved.</p>

          <p>Home services made simple.</p>
        </div>
      </div>
    </footer>
  );
}
