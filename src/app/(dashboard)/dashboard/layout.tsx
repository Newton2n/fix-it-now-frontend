import { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardTopbar from "@/components/dashboard/dashboard-topbar";
import { getMe } from "@/actions/auth.action";
import { notFound } from "next/navigation";

type Props = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  const user = await getMe();
  console.log("get me ", user);
  if (!user.success) {
    return notFound();
  }
  const role = user?.data.role;

  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="hidden lg:block">
        <DashboardSidebar role={role || "CUSTOMER"} />
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
