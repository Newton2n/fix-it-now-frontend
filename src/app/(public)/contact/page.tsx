"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { useForm, ValidationError } from "@formspree/react";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const pathname = usePathname();

  const [state, handleSubmit] = useForm("mbgrygqo");
  const [showSuccess, setShowSuccess] = useState(false);

  /*
   * Reset the success screen whenever the user navigates
   * to another route and then comes back.
   */
  useEffect(() => {
    setShowSuccess(false);
  }, [pathname]);

  /*
   * Show success screen after Formspree successfully
   * processes the submission.
   */
  useEffect(() => {
    if (state.succeeded) {
      setShowSuccess(true);
    }
  }, [state.succeeded]);

  if (showSuccess) {
    return (
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 2xl:px-12 2xl:py-12">
        <DashboardPageHeader
          title="Contact Us"
          description="Reach out for support, questions, or feedback."
        />

        <div className="mt-6 sm:mt-8">
          <SectionCard
            title="Message Sent"
            description="Thank you for contacting us."
          >
            <div className="space-y-4">
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Your message has been sent successfully. We will get back to
                you as soon as possible.
              </p>

              <Button
                asChild
                className="w-full cursor-pointer sm:w-auto"
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 2xl:px-12 2xl:py-12">
      <div className="space-y-6 sm:space-y-8">
        <DashboardPageHeader
          title="Contact Us"
          description="Reach out for support, questions, or feedback."
        />

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] 2xl:gap-8">
          {/* Contact Form */}
          <SectionCard
            title="Send a Message"
            description="Fill out the form and we will get back to you."
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name + Email */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div className="min-w-0 space-y-3">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Name
                  </label>

                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    className="h-10 w-full"
                  />

                  <ValidationError
                    field="name"
                    prefix="Name"
                    errors={state.errors}
                    className="text-sm text-destructive"
                  />
                </div>

                {/* Email */}
                <div className="min-w-0 space-y-3">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </label>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="h-10 w-full"
                  />

                  <ValidationError
                    field="email"
                    prefix="Email"
                    errors={state.errors}
                    className="text-sm text-destructive"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="min-w-0 space-y-3">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-foreground"
                >
                  Message
                </label>

                <Textarea
                  id="message"
                  name="message"
                  rows={7}
                  placeholder="Describe your question or feedback"
                  required
                  className="min-h-40 w-full resize-y"
                />

                <ValidationError
                  field="message"
                  prefix="Message"
                  errors={state.errors}
                  className="text-sm text-destructive"
                />
              </div>

              {/* General Error */}
              <ValidationError
                errors={state.errors}
                className="text-sm text-destructive"
              />

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <Button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full cursor-pointer sm:flex-1"
                >
                  <Send className="mr-2 size-4" />

                  {state.submitting ? "Sending..." : "Send Message"}
                </Button>

                <Button
                  type="reset"
                  variant="outline"
                  disabled={state.submitting}
                  className="w-full cursor-pointer sm:w-auto sm:px-8"
                >
                  Clear All
                </Button>
              </div>
            </form>
          </SectionCard>

          {/* Contact Information */}
          <div className="min-w-0 space-y-6 2xl:space-y-8">
            <SectionCard
              title="Contact Information"
              description="Get in touch directly"
            >
              <div className="space-y-5">
                {/* Email */}
                <div className="flex min-w-0 items-start gap-3">
                  <Mail className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

                  <div className="min-w-0">
                    <p className="font-medium">Email</p>

                    <Link
                      href="mailto:newton.bepari.dev@gmail.com"
                      className="block break-all text-sm text-muted-foreground transition-colors hover:text-foreground sm:break-normal"
                    >
                      newton.bepari.dev@gmail.com
                    </Link>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex min-w-0 items-start gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

                  <div className="min-w-0">
                    <p className="font-medium">WhatsApp</p>

                    <Link
                      href="https://wa.me/8801612676969"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      +880 1612-676969
                    </Link>
                  </div>
                </div>

                {/* GitHub */}
                <div className="flex min-w-0 items-start gap-3">
                  <FaGithub className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

                  <div className="min-w-0">
                    <p className="font-medium">GitHub</p>

                    <Link
                      href="https://github.com/Newton2n"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block break-all text-sm text-muted-foreground transition-colors hover:text-foreground sm:break-normal"
                    >
                      github.com/Newton2n
                    </Link>
                  </div>
                </div>

                {/* Location */}
                <div className="flex min-w-0 items-start gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

                  <div className="min-w-0">
                    <p className="font-medium">Location</p>

                    <p className="text-sm text-muted-foreground">
                      Barishal, Bangladesh
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Other Ways */}
            <SectionCard
              title="Other Ways to Reach Us"
              description="Additional channels"
            >
              <ul className="space-y-3 text-sm leading-6">
                <li className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="shrink-0 font-medium">
                    Availability:
                  </span>

                  <span className="text-muted-foreground">
                    Daily, 01:00–19:00 UTC
                  </span>
                </li>

                <li className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="shrink-0 font-medium">
                    Response time:
                  </span>

                  <span className="text-muted-foreground">
                    Within 6 hours
                  </span>
                </li>
              </ul>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full cursor-pointer sm:w-auto"
                >
                  <Link href="/about">About</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full cursor-pointer sm:w-auto"
                >
                  <Link href="/privacy">Privacy & Terms</Link>
                </Button>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}