import { Suspense } from "react";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import AdminDashboardOverview from "@/components/dashboard/admin/admin-dashboard-overview";
import AdminBookingStatusChart from "@/components/dashboard/admin/admin-booking-status-chart";
import AdminUserCompositionChart from "@/components/dashboard/admin/admin-user-composition-chart";
import AdminRecentBookings from "@/components/dashboard/admin/admin-recent-bookings";
import AdminDashboardError from "@/components/dashboard/admin/admin-dashboard-error";
import { getAdminDashboardStats } from "@/actions/stats.action";

// 1. Async Content Component
async function AdminDashboardContent() {
  const result = await getAdminDashboardStats();

  if (!result.success || !result.data) {
    return (
      <AdminDashboardError
        message={result.message || "Unable to load admin dashboard data."}
      />
    );
  }

  const dashboardData = result.data;

  return (
    <div className="space-y-6">
      <AdminDashboardOverview overview={dashboardData.overview} />

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminBookingStatusChart bookingStatus={dashboardData.bookingStatus} />

        <AdminUserCompositionChart overview={dashboardData.overview} />
      </div>

      <AdminRecentBookings bookings={dashboardData.recentBookings} />
    </div>
  );
}

// 2. Loading Skeleton Fallback
function AdminDashboardSkeleton() {
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

// 3. Main Exported Page
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Admin Dashboard"
        description="Monitor platform activity, bookings, users and revenue."
      />

      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboardContent />
      </Suspense>
    </div>
  );
}