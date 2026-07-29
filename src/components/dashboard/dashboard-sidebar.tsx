"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wrench,
  CalendarDays,
  CreditCard,
  Star,
  Settings,
  FolderKanban,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Role = "ADMIN" | "CUSTOMER" | "TECHNICIAN";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const dashboardNav: Record<Role, NavItem[]> = {
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/profile", label: "Profile", icon: Users },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/bookings", label: "Bookings", icon: ClipboardList },
    { href: "/dashboard/admin/categories", label: "Categories", icon: FolderKanban },
    { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
  ],
  CUSTOMER: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/bookings", label: "Bookings", icon: CalendarDays },
    { href: "/dashboard/customer/payments", label: "Payments", icon: CreditCard },
    { href: "/dashboard/customer/profile", label: "Profile", icon: Users },
    { href: "/dashboard/customer/reviews", label: "Reviews", icon: Star },
  ],
  TECHNICIAN: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/technician/bookings", label: "Bookings", icon: ClipboardList },
    { href: "/dashboard/technician/availability", label: "Availability", icon: CalendarDays },
    { href: "/dashboard/technician/services", label: "Services", icon: Wrench },
    { href: "/dashboard/technician/settings", label: "Settings", icon: Settings },
  ],
};

type DashboardSidebarProps = {
  role: Role;
};

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const navItems = dashboardNav[role];

const isActive = (href: string) => {
  if (href.endsWith("/customer") || href.endsWith("/admin") || href.endsWith("/technician")) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

  return (
    <aside className="flex h-full w-full flex-col border-r bg-background">
      <div className="border-b px-4 py-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Dashboard
        </p>
        <p className="text-lg font-bold capitalize">{role.toLowerCase()}</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}