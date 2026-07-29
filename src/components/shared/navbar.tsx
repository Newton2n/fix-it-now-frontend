"use client";

import Link from "next/link";
import { Menu, User } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
Sheet,
SheetContent,
SheetHeader,
SheetTitle,
SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Role = "customer" | "technician" | "admin" | null;

type HeaderProps = {
role?: Role;
userName?: string;
};

export default function Navbar({
role = null,
userName,
}: HeaderProps) {
const baseLinks = [
{
href: "/",
label: "Home",
},
{
href: "/services",
label: "Services",
},
];

const roleLinks =
role === "customer"
? [
{
href: "/dashboard/customer",
label: "My Dashboard",
},
]
: role === "technician"
? [
{
href: "/dashboard/technician",
label: "Dashboard",
},
{
href: "/dashboard/technician/bookings",
label: "Bookings",
},
]
: role === "admin"
? [
{
href: "/dashboard/admin",
label: "Admin Panel",
},
{
href: "/dashboard/admin/categories",
label: "Categories",
},
]
: [];

const allLinks = [...baseLinks, ...roleLinks];

return ( <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur"> <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
{/* Logo */} <Link
       href="/"
       className="flex items-center gap-2"
     > <span className="text-xl font-bold text-primary">
FixItNow </span>

      <Badge
        variant="secondary"
        className="hidden sm:inline-flex"
      >
        Trusted Home Service Platform
      </Badge>
    </Link>

    {/* Desktop Navigation */}
    <nav className="hidden items-center gap-6 md:flex">
      {allLinks.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>

    {/* Right Actions */}
    <div className="flex items-center gap-2">
      {/* Desktop User Menu */}
      {userName ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              />
            }
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56"
          >
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{userName}</span>

                {role && (
                  <span className="text-xs capitalize text-muted-foreground">
                    {role}
                  </span>
                )}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Role-based Dashboard */}
            <DropdownMenuItem
              render={
                <Link
                  href={
                    role === "customer"
                      ? "/dashboard/customer"
                      : role === "technician"
                        ? "/dashboard/technician"
                        : "/dashboard/admin"
                  }
                />
              }
            >
              Dashboard
            </DropdownMenuItem>

            {/* Profile */}
            <DropdownMenuItem
              render={
                <Link href="/profile" />
              }
            >
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        /* Desktop Auth Buttons */
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/auth/login"
            className={cn(
              buttonVariants({
                variant: "outline",
              }),
            )}
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className={cn(
              buttonVariants({
                variant: "default",
              }),
            )}
          >
            Register
          </Link>
        </div>
      )}

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation menu"
            />
          }
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-80"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Menu
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex flex-col gap-4">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-1">
              {allLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile User / Auth Section */}
            <div className="mt-4 border-t pt-4">
              {userName ? (
                <div className="flex flex-col gap-3">
                  <div className="text-sm text-muted-foreground">
                    Signed in as{" "}
                    <span className="font-medium text-foreground">
                      {userName}
                    </span>
                  </div>

                  <Link
                    href={
                      role === "customer"
                        ? "/dashboard/customer"
                        : role === "technician"
                          ? "/dashboard/technician"
                          : "/dashboard/admin"
                    }
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                      }),
                      "w-full",
                    )}
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                      }),
                      "w-full",
                    )}
                  >
                    Profile
                  </Link>

                  <Button
                    variant="destructive"
                    className="w-full"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/auth/login"
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                      }),
                      "w-full",
                    )}
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/register"
                    className={cn(
                      buttonVariants({
                        variant: "default",
                      }),
                      "w-full",
                    )}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </div>
</header>

);
}
