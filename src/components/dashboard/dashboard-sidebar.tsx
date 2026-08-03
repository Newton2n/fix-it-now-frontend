"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  dashboardNav,
  type Role,
} from "@/components/dashboard/dashboard-nav";

type DashboardSidebarProps = {
  role: Role;
};

export default function DashboardSidebar({
  role,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const navItems = dashboardNav[role];

  const isActive = (href: string) => {
    // Dashboard overview should only be active
    // on the exact dashboard URL.
    if (href === `/dashboard/${role.toLowerCase()}`) {
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

        <p className="text-lg font-bold capitalize">
          {role.toLowerCase()}
        </p>
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
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
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