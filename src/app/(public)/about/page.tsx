import Link from "next/link";
import { Wrench } from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";

import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 2xl:px-12 2xl:py-12">
      <div className="space-y-6 sm:space-y-8 2xl:space-y-10">
        <DashboardPageHeader
          title="About FixItNow"
          description="A platform connecting customers with trusted technicians for home and digital services."
        />

        {/* About + Features */}
        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] 2xl:gap-8">
          {/* What is FixItNow? */}
          <SectionCard
            title="What is FixItNow?"
            description="Our mission and vision"
          >
            <div className="max-w-4xl space-y-5">
              <p className="text-sm leading-7 text-foreground sm:text-base">
                FixItNow is a service marketplace that helps customers find,
                book, and manage trusted technicians for home repairs,
                appliance fixes, and digital services.
              </p>

              <p className="text-sm leading-7 text-foreground sm:text-base">
                Our goal is to make home and digital services simple,
                transparent, and reliable. We focus on quality, accountability,
                and a smooth experience for both customers and technicians.
              </p>

              {/* Core Values */}
              <div className="rounded-lg border bg-muted/40 p-4 sm:p-5">
                <p className="text-sm font-medium sm:text-base">
                  Core values
                </p>

                <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <li className="flex items-start gap-2">
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>Trust and safety</span>
                  </li>

                  <li className="flex items-start gap-2">
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>Clear communication</span>
                  </li>

                  <li className="flex items-start gap-2">
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>Reliable service delivery</span>
                  </li>

                  <li className="flex items-start gap-2">
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>Continuous improvement</span>
                  </li>
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* Key Features */}
          <SectionCard
            title="Key Features"
            description="What makes FixItNow different"
          >
            <ul className="space-y-4 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <Wrench className="mt-0.5 size-4 shrink-0 text-primary sm:size-5" />

                <span className="leading-6">
                  Verified technicians with clear profiles and ratings
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Wrench className="mt-0.5 size-4 shrink-0 text-primary sm:size-5" />

                <span className="leading-6">
                  Easy booking flow with status tracking
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Wrench className="mt-0.5 size-4 shrink-0 text-primary sm:size-5" />

                <span className="leading-6">
                  Secure payments and transparent pricing
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Wrench className="mt-0.5 size-4 shrink-0 text-primary sm:size-5" />

                <span className="leading-6">
                  Reviews and feedback to improve service quality
                </span>
              </li>
            </ul>
          </SectionCard>
        </div>

        {/* Get in Touch */}
        <SectionCard
          title="Get in Touch"
          description="Questions, feedback, or partnership ideas"
        >
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              We would love to hear from you. Reach out for support, feedback,
              or collaboration.
            </p>

            <Button asChild className="w-full cursor-pointer xl:w-auto">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}