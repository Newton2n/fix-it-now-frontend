"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

type DashboardTopbarProps = {
  role: "TECHNICIAN" | "CUSTOMER" | "ADMIN";
  title: string;
  subtitle?: string;
};

export default function DashboardTopbar({
  role,
  title,
  subtitle,
}: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
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

            <SheetContent side="left" className="w-72 p-0">
              <div className="flex h-full flex-col">
                <div className="border-b p-4">
                  <h2 className="text-lg font-semibold">
                    Menu
                  </h2>

                  <p className="text-sm text-muted-foreground capitalize">
                    {role}
                  </p>
                </div>

                <nav className="flex-1 p-4">
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/bookings"
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                    >
                      Bookings
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                    >
                      Profile
                    </Link>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

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

        <Badge
          variant="secondary"
          className="capitalize"
        >
          {role}
        </Badge>
      </div>
    </header>
  );
}