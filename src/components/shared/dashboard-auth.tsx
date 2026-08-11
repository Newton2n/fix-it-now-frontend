import { Suspense } from "react";
import { getMe } from "@/actions/auth.action";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardTopbar from "@/components/dashboard/dashboard-topbar";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";

export default function DashboardAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLayoutSkeleton />}>
      <DashboardAuthContent>{children}</DashboardAuthContent>
    </Suspense>
  );
}

async function DashboardAuthContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  if (!user || !user.success) {
    redirect("/login");
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

function DashboardLayoutSkeleton() {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="hidden w-64 border-r bg-card lg:block">
        <div className="p-6">
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="h-16 border-b bg-card px-6 flex items-center">
          <Skeleton className="h-6 w-48 rounded-lg" />
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Skeleton className="h-96 w-full rounded-xl" />
        </main>
      </div>
    </div>
  );
}