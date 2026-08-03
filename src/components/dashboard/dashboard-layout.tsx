import { ReactNode } from "react";
import DashboardSidebar from "./dashboard-sidebar";
import DashboardTopbar from "./dashboard-topbar";

export type Role = "ADMIN" | "CUSTOMER" | "TECHNICIAN";
type Props = {
  role: Role;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function DashboardLayout({
  role,
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="hidden lg:block">
        <DashboardSidebar role={role} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar role={role} title={title} subtitle={subtitle} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
