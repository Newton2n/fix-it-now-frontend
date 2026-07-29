"use client";

import Link from "next/link";
import { Menu, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Role } from "./dashboard-nav";
import DashboardSidebar from "./dashboard-sidebar";

type Props = {
  role: Role;
  title: string;
  subtitle?: string;
};

export default function DashboardTopbar({ role, title, subtitle }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger  className="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <DashboardSidebar role={role} />
            </SheetContent>
          </Sheet>

          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            {subtitle ? (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm"  className="hidden sm:inline-flex">
            <Link href="/">
              <UserRound className="mr-2 h-4 w-4" />
              Site
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger >
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>FN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>My Account</span>
                  <span className="text-xs text-muted-foreground capitalize">{role}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem >
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem >
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}