import { getMe } from "@/actions/auth.action";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardTopbar from "@/components/dashboard/dashboard-topbar";
import { notFound } from "next/navigation";

export default async function DashboardAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  if (!user.success) {
    return notFound();
  }

  const role = user.data?.role || "CUSTOMER";

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