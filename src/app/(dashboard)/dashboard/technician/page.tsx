import Link from "next/link";
import { Suspense } from "react";
import { UserPlus, UserX } from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Button } from "@/components/ui/button";

import TechnicianDashboardOverview from "@/components/dashboard/technician/technician-dashboard-overview";
import TechnicianBookingChart from "@/components/dashboard/technician/technician-booking-chart";
import TechnicianRatingCard from "@/components/dashboard/technician/technician-rating-card";
import TechnicianEarningsCard from "@/components/dashboard/technician/technician-earnings-card";
import TechnicianRecentBookings from "@/components/dashboard/technician/technician-recent-bookings";
import TechnicianDashboardError from "@/components/dashboard/technician/technician-dashboard-error";

import { getTechnicianDashboardStats } from "@/actions/stats.action";
import { getLoginTechnicianProfile } from "@/actions/technician.action";

// 1. Separate Async Content Component
async function TechnicianDashboardContent() {
  const [profileResult, statsResult] = await Promise.all([
    getLoginTechnicianProfile(),
    getTechnicianDashboardStats(),
  ]);

  // Check if profile is missing
  const isProfileNotFound =
    !profileResult.success &&
    profileResult.message?.toLowerCase().includes("resource not found");

  const hasProfile =
    profileResult.success && Boolean(profileResult.data?.result);

  if (isProfileNotFound || !hasProfile) {
    return (
      <SectionCard
        title="Technician Profile Required"
        description="Create your technician profile to view your dashboard and metrics."
      >
        <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-14 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
            <UserX className="size-6 text-muted-foreground" />
          </div>

          <h3 className="mt-4 text-lg font-semibold">
            Create your technician profile first
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Your dashboard overview, earnings, and booking stats are tied to
            your technician profile. Create your profile first to get started.
          </p>

          <div className="mt-6">
            <Button asChild>
              <Link href="/dashboard/technician/technician-profile">
                <UserPlus className="mr-2 size-4" />
                Create Technician Profile
              </Link>
            </Button>
          </div>
        </div>
      </SectionCard>
    );
  }

  // Handle generic API or data errors
  if (!statsResult.success || !statsResult.data) {
    return (
      <TechnicianDashboardError
        message={statsResult.message || "Unable to load technician dashboard data."}
      />
    );
  }

  const dashboardData = statsResult.data;

  // Render dashboard when profile and stats exist
  return (
    <div className="space-y-6">
      <TechnicianDashboardOverview overview={dashboardData.overview} />

      <div className="grid gap-6 xl:grid-cols-2">
        <TechnicianBookingChart overview={dashboardData.overview} />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
          <TechnicianEarningsCard earnings={dashboardData.overview.earnings} />

          <TechnicianRatingCard
            averageRating={dashboardData.overview.averageRating}
            reviewsCount={dashboardData.overview.reviewsCount}
          />
        </div>
      </div>

      <TechnicianRecentBookings bookings={dashboardData.recentBookings} />
    </div>
  );
}

// 2. Fallback Loading UI
function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 rounded-xl bg-muted/50" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-64 rounded-xl bg-muted/50" />
        <div className="h-64 rounded-xl bg-muted/50" />
      </div>
      <div className="h-48 rounded-xl bg-muted/50" />
    </div>
  );
}

// 3. Main Exported Page with Suspense
export default function TechnicianDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Technician Dashboard"
        description="Track your services, bookings, earnings and customer feedback."
      />

      <Suspense fallback={<DashboardLoadingSkeleton />}>
        <TechnicianDashboardContent />
      </Suspense>
    </div>
  );
}