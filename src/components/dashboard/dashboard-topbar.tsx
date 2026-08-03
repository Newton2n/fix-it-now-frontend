"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

import {
  dashboardNav,
  type Role,
} from "@/components/dashboard/dashboard-nav";

type DashboardTopbarProps = {
  role: Role;
  title: string;
  subtitle?: string;
};

export default function DashboardTopbar({
  role,
  title,
  subtitle,
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const navItems = dashboardNav[role];

  const isActive = (href: string) => {
    if (href === `/dashboard/${role.toLowerCase()}`) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background lg:hidden"
              >
                <Menu className="h-4 w-4" />

                <span className="sr-only">
                  Open menu
                </span>
              </button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-72 p-0"
            >
              <div className="flex h-full flex-col">
                {/* Menu header */}
                <div className="border-b p-4">
                  <h2 className="text-lg font-semibold">
                    Dashboard
                  </h2>

                  <p className="text-sm capitalize text-muted-foreground">
                    {role.toLowerCase()}
                  </p>
                </div>

                {/* Navigation */}
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
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />

                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Page title */}
          <div>
            <h1 className="text-base font-semibold">
              {title}
            </h1>

            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Role */}
        <Badge
          variant="secondary"
          className="capitalize"
        >
          {role.toLowerCase()}
        </Badge>
      </div>
    </header>
  );
}