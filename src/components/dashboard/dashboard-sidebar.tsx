"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { dashboardNav, Role } from "./dashboard-nav";

type Props = {
  role: Role;
};

export default function DashboardSidebar({ role }: Props) {
  const pathname = usePathname();
  const items = dashboardNav[role];

  return (
    <aside className="flex h-full w-72 flex-col border-r bg-background">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <span className="text-sm font-bold">F</span>
        </div>
        <div className="leading-tight">
          <p className="font-semibold">FixItNow</p>
          <p className="text-xs text-muted-foreground capitalize">{role} panel</p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-3">
          <div className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Navigation
          </div>

          <div className="space-y-1">
            {items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  {active ? <Badge variant="secondary">Active</Badge> : null}
                </Link>
              );
            })}
          </div>
        </nav>
      </ScrollArea>
    </aside>
  );
}