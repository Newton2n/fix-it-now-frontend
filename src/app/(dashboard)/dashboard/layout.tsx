import { ReactNode } from "react";
import DashboardAuth from "@/components/shared/dashboard-auth";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardAuth>{children}</DashboardAuth>;
}