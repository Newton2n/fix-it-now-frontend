"use client";

import Link from "next/link";
import {
  Menu,
  LogIn,
  LogOut,
  LayoutDashboard,
  UserPlus,
  User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/actions/auth.action";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN" | null;

type NavbarProps = {
  role?: Role;
  userName?: string | null;
};

type NavLink = {
  href: string;
  label: string;
};

const BASE_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/categories", label: "Categories" },
];

const ROLE_CONFIG: Record<
  Exclude<Role, null>,
  { dashboardHref: string; links: NavLink[] }
> = {
  CUSTOMER: {
    dashboardHref: "/dashboard/customer",
    links: [{ href: "/dashboard/customer", label: "My Dashboard" }],
  },
  TECHNICIAN: {
    dashboardHref: "/dashboard/technician",
    links: [
      { href: "/dashboard/technician", label: "Dashboard" },
      { href: "/dashboard/technician/bookings", label: "Bookings" },
    ],
  },
  ADMIN: {
    dashboardHref: "/dashboard/admin",
    links: [
      { href: "/dashboard/admin", label: "Admin Panel" },
      { href: "/dashboard/admin/categories", label: "Categories" },
    ],
  },
};

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function AuthButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "outline" }), "w-full")}
      >
        Login
      </Link>
      <Link
        href="/register"
        className={cn(buttonVariants({ variant: "default" }), "w-full")}
      >
        Register
      </Link>
    </div>
  );
}

function AccountMenu({
  role,
  userName,
  onLogout,
}: {
  role: Role;
  userName?: string | null;
  onLogout: () => void;
}) {
  const isLoggedIn = Boolean(userName);
  const dashboardHref = role ? ROLE_CONFIG[role].dashboardHref : null;
  const profileLink =
    role === "ADMIN"
      ? "/dashboard/admin/profile"
      : role === "CUSTOMER"
      ? "/dashboard/customer/profile"
      : "/dashboard/technician/profile";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {isLoggedIn ? (
            <Avatar className="h-9 w-9">
              <AvatarFallback>{getInitials(userName)}</AvatarFallback>
            </Avatar>
          ) : (
            <UserIcon className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {isLoggedIn ? (
          <>
            <DropdownMenuLabel className="truncate">
              {userName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {dashboardHref && (
              <DropdownMenuItem asChild>
                <Link href={dashboardHref} className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem asChild>
              <Link href={profileLink} className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/register" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu({
  links,
  role,
  userName,
  onLogout,
}: NavbarProps & { links: NavLink[]; onLogout: () => void }) {
  const dashboardHref = role ? ROLE_CONFIG[role].dashboardHref : null;
  const isLoggedIn = Boolean(userName);
  const profileLink =
    role === "ADMIN"
      ? "/dashboard/admin/profile"
      : role === "CUSTOMER"
      ? "/dashboard/customer/profile"
      : "/dashboard/technician/profile";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Menu
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          <nav className="flex flex-col gap-1">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 border-t pt-4">
            {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <div className="text-sm text-muted-foreground">
                  Signed in as{" "}
                  <span className="font-medium text-foreground">
                    {userName}
                  </span>
                </div>

                {dashboardHref && (
                  <Link
                    href={dashboardHref}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full"
                    )}
                  >
                    Dashboard
                  </Link>
                )}

                <Link
                  href={profileLink}
                  className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
                >
                  Profile
                </Link>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Navbar({ role = null, userName = null }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to logout.");
    }
  };

  const links = [...BASE_LINKS, ...(role ? ROLE_CONFIG[role].links : [])];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">FixItNow</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <AccountMenu role={role} userName={userName} onLogout={handleLogout} />
          </div>

          <MobileMenu
            links={links}
            role={role}
            userName={userName}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}