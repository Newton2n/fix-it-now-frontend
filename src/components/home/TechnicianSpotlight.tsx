import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "./Reveal";
import { getAllTechnicians } from "@/actions/technician.action";
import { getUserById } from "@/actions/user.action";
import TechnicianCard from "@/components/technicians/technician-card";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Technician = {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  isAvailable: boolean;
  yearsOfExperience: string;
  serviceArea: string[];
  status: "PENDING_APPROVAL" | "VERIFIED" | "SUSPENDED";
};

export async function TechnicianSpotlight() {
  const result = await getAllTechnicians({
    page: 1,
    limit: 6,
    sortBy: "date",
    sortOrder: "desc",
    status: "VERIFIED",
  });

  if (!result.success) {
    return null;
  }

  const rawTechnicians: Technician[] = result.data ?? [];

  // Filter to explicitly ensure only VERIFIED technicians are shown
  const verifiedTechnicians = rawTechnicians.filter(
    (tech) => tech.status === "VERIFIED",
  );

  // Always grab up to 6 verified technicians, we handle visibility dynamically via CSS
  const technicians: Technician[] = verifiedTechnicians.slice(0, 6);
  const totalCount = technicians.length;

  if (totalCount === 0) {
    return null;
  }

  // Calculate maximum items allowed to keep rows complete at each breakpoint:
  const mobileLimit = Math.min(totalCount, 3);
  const tabletLimit = totalCount >= 4 ? 4 : totalCount >= 2 ? 2 : totalCount;
  const desktopLimit = totalCount >= 6 ? 6 : totalCount >= 3 ? 3 : totalCount;

  return (
    <section
      id="technicians"
      className="w-full border-b border-border bg-background py-16 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Technician discovery"
            title="Find the right professional for the job."
            description="Profiles show skills, experience, service area and current availability. Connect with trusted technicians in your area."
          />
          <Button
            asChild
            variant="outline"
            className="shrink-0 gap-2 self-start sm:self-auto"
          >
            <Link href="/technicians">
              Browse all technicians
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 items-stretch">
          {technicians.map((technician, i) => {
            const isMobileVisible = i < mobileLimit;
            const isTabletVisible = i < tabletLimit;
            const isDesktopVisible = i < desktopLimit;

            return (
              <Reveal
                as="li"
                key={technician.id}
                delay={Math.min(i, 3) * 70}
                className={cn(
                  "min-w-0 h-full",
                  // Mobile (1 col): Visible only up to mobileLimit
                  isMobileVisible ? "block" : "hidden",
                  // Tablet (2 col): Visible only up to tabletLimit (2 or 4)
                  isTabletVisible ? "sm:block" : "sm:hidden",
                  // Desktop (3 col): Visible only up to desktopLimit (3 or 6)
                  isDesktopVisible ? "lg:block" : "lg:hidden",
                )}
              >
                {/* Wrap the async sub-component with Suspense */}
                <Suspense fallback={<TechnicianCardSkeleton />}>
                  <TechnicianWithUser technician={technician} />
                </Suspense>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

async function TechnicianWithUser({ technician }: { technician: Technician }) {
  const userResult = await getUserById(technician.userId);

  const user = userResult?.success ? userResult.data : null;

  const name = user?.name || "Professional Technician";

  const profileImage =
    user?.profileImage || user?.image || user?.profilePicture || null;

  return (
    <TechnicianCard
      id={technician.id}
      name={name}
      profileImage={profileImage}
      bio={technician.bio}
      skills={technician.skills}
      yearsOfExperience={technician.yearsOfExperience}
      serviceArea={technician.serviceArea}
      isAvailable={technician.isAvailable}
      status={technician.status}
    />
  );
}

function TechnicianCardSkeleton() {
  return (
    <div className="h-[280px] w-full animate-pulse rounded-xl border border-border bg-muted/40 p-6" />
  );
}
