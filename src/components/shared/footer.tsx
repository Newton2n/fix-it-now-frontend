import Link from "next/link";
import {
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { Mail, MapPin, Phone } from "lucide-react";

import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy & Terms", href: "/privacy" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/Newton2n",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/newton2n",
    icon: FaLinkedinIn,
  },
  {
    label: "X",
    href: "https://x.com/newtonbepari",
    icon: FaXTwitter,
  },
  {
    label: "Email",
    href: "mailto:newton.bepari.dev@gmail.com",
    icon: Mail,
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-12">
        {/* Main Footer */}
        <div className="py-10 sm:py-12 lg:py-14 2xl:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 2xl:gap-16">
            {/* Brand */}
            <div className="min-w-0 space-y-4 sm:col-span-2 lg:col-span-1">
              <Link
                href="/"
                className="inline-flex text-2xl font-bold tracking-tight text-primary transition-opacity hover:opacity-80 sm:text-3xl"
              >
                FixItNow
              </Link>

              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                A home service platform that connects customers with
                technicians for reliable repair and maintenance services.
              </p>
            </div>

            {/* Quick Links */}
            <div className="min-w-0">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                Quick Links
              </h3>

              <nav aria-label="Quick links">
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Company */}
            <div className="min-w-0">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                Company
              </h3>

              <nav aria-label="Company links">
                <ul className="space-y-3">
                  {companyLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Contact */}
            <div className="min-w-0">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                Contact
              </h3>

              <ul className="space-y-3">
                {/* Email */}
                <li>
                  <Link
                    href="mailto:newton.bepari.dev@gmail.com"
                    className="group flex min-w-0 items-start gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail className="mt-0.5 size-4 shrink-0" />

                    <span className="min-w-0 break-all sm:break-normal">
                      newton.bepari.dev@gmail.com
                    </span>
                  </Link>
                </li>

                {/* WhatsApp */}
                <li>
                  <Link
                    href="https://wa.me/8801612676969"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Phone className="mt-0.5 size-4 shrink-0" />

                    <span>+880 1612-676969</span>
                  </Link>
                </li>

                {/* Location */}
                <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" />

                  <span>Barishal, Bangladesh</span>
                </li>
              </ul>

              {/* Social Links */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Follow me
                </p>

                <div className="flex items-center gap-2">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;

                    return (
                      <Link
                        key={social.label}
                        href={social.href}
                        target={
                          social.href.startsWith("mailto:")
                            ? undefined
                            : "_blank"
                        }
                        rel={
                          social.href.startsWith("mailto:")
                            ? undefined
                            : "noopener noreferrer"
                        }
                        aria-label={social.label}
                        className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <Icon className="size-4" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="flex flex-col gap-3 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© 2026 FixItNow. All rights reserved.</p>

          <p>Home services made simple.</p>
        </div>
      </div>
    </footer>
  );
}