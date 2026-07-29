import { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardTopbar from "@/components/dashboard/dashboard-topbar";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const role = "technician"; // replace later with auth-based role

  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="hidden lg:block">
        <DashboardSidebar role={role} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          role={role}
          title="Dashboard"
          subtitle="Manage your account and activity"
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}