import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import AdminDashboardOverview from "@/components/dashboard/admin/admin-dashboard-overview";
import AdminBookingStatusChart from "@/components/dashboard/admin/admin-booking-status-chart";
import AdminUserCompositionChart from "@/components/dashboard/admin/admin-user-composition-chart";
import AdminRecentBookings from "@/components/dashboard/admin/admin-recent-bookings";
import AdminDashboardError from "@/components/dashboard/admin/admin-dashboard-error";
import { getAdminDashboardStats } from "@/actions/stats.action";

export default async function AdminDashboardPage() {
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
      <DashboardPageHeader
        title="Admin Dashboard"
        description="Monitor platform activity, bookings, users and revenue."
      />

      <AdminDashboardOverview overview={dashboardData.overview} />

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminBookingStatusChart bookingStatus={dashboardData.bookingStatus} />

        <AdminUserCompositionChart overview={dashboardData.overview} />
      </div>

      <AdminRecentBookings bookings={dashboardData.recentBookings} />
    </div>
  );
}
