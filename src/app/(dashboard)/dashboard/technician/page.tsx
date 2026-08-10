import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";

import TechnicianDashboardOverview from "@/components/dashboard/technician/technician-dashboard-overview";
import TechnicianBookingChart from "@/components/dashboard/technician/technician-booking-chart";
import TechnicianRatingCard from "@/components/dashboard/technician/technician-rating-card";
import TechnicianEarningsCard from "@/components/dashboard/technician/technician-earnings-card";
import TechnicianRecentBookings from "@/components/dashboard/technician/technician-recent-bookings";
import TechnicianDashboardError from "@/components/dashboard/technician/technician-dashboard-error";
import { getTechnicianDashboardStats } from "@/actions/stats.action";

export default async function TechnicianDashboardPage() {
  const result = await getTechnicianDashboardStats();

  if (!result.success || !result.data) {
    return (
      <TechnicianDashboardError
        message={result.message || "Unable to load technician dashboard data."}
      />
    );
  }

  const dashboardData = result.data;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Technician Dashboard"
        description="Track your services, bookings, earnings and customer feedback."
      />

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
