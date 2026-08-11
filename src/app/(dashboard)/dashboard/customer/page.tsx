import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";

import CustomerDashboardOverview from "@/components/dashboard/customer/customer-dashboard-overview";
import CustomerBookingStatusChart from "@/components/dashboard/customer/customer-booking-status-chart";
import CustomerSpendingCard from "@/components/dashboard/customer/customer-spending-card";
import CustomerRecentBookings from "@/components/dashboard/customer/customer-recent-bookings";
import CustomerDashboardError from "@/components/dashboard/customer/customer-dashboard-error";
import { getCustomerDashboardStats } from "@/actions/stats.action";

export default async function CustomerDashboardPage() {
  const result = await getCustomerDashboardStats();

  if (!result.success || !result.data) {
    return (
      <CustomerDashboardError
        message={result.message || "Unable to load customer dashboard data."}
      />
    );
  }

  const dashboardData = result.data;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Customer Dashboard"
        description="Keep track of your bookings, services, payments and activity."
      />

      <CustomerDashboardOverview overview={dashboardData.overview} />

      <div className="grid gap-6 xl:grid-cols-2">
        <CustomerBookingStatusChart overview={dashboardData.overview} />

        <CustomerSpendingCard
          totalSpent={dashboardData.overview.totalSpent}
          paymentsCount={dashboardData.overview.paymentsCount}
        />
      </div>

      <CustomerRecentBookings bookings={dashboardData.recentBookings} />
    </div>
  );
}
