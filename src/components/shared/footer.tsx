import Link from "next/link";
import { Globe, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              FixItNow
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Your trusted home service platform for fast booking, qualified technicians, and reliable service management.
            </p>

            <div className="flex items-center gap-3">
  <Link href="mailto:support@fixitnow.com" aria-label="Email">
    <Mail className="h-5 w-5 text-muted-foreground hover:text-foreground" />
  </Link>
  <Link href="#" aria-label="Website">
    <Globe className="h-5 w-5 text-muted-foreground hover:text-foreground" />
  </Link>
  <Link href="tel:+1234567890" aria-label="Phone">
    <Phone className="h-5 w-5 text-muted-foreground hover:text-foreground" />
  </Link>
</div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-foreground">Services</Link></li>
              <li><Link href="/auth/login" className="text-muted-foreground hover:text-foreground">Login</Link></li>
              <li><Link href="/auth/register" className="text-muted-foreground hover:text-foreground">Register</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Customer
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/dashboard/customer" className="text-muted-foreground hover:text-foreground">My Dashboard</Link></li>
              <li><Link href="/dashboard/customer/bookings" className="text-muted-foreground hover:text-foreground">Bookings</Link></li>
              <li><Link href="/dashboard/customer/payments" className="text-muted-foreground hover:text-foreground">Payments</Link></li>
              <li><Link href="/dashboard/customer/reviews" className="text-muted-foreground hover:text-foreground">Leave Reviews</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Newsletter
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Get updates about new services and special offers.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Enter your email" className="bg-background" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FixItNow. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/support" className="hover:text-foreground">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}