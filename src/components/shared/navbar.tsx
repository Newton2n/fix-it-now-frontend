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

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import ThemeMode from "@/components/theme-mode";

import { cn } from "@/lib/utils";

export type Role =
  | "CUSTOMER"
  | "TECHNICIAN"
  | "ADMIN"
  | null;

type NavbarProps = {
  role?: Role;
  userName?: string | null;
};

type NavLink = {
  href: string;
  label: string;
};

const BASE_LINKS: NavLink[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/services",
    label: "Services",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/technicians",
    label: "Technicians",
  },
];

const ROLE_CONFIG: Record<
  Exclude<Role, null>,
  {
    dashboardHref: string;
    links: NavLink[];
  }
> = {
  CUSTOMER: {
    dashboardHref: "/dashboard/customer",
    links: [
      {
        href: "/dashboard/customer",
        label: "My Dashboard",
      },
    ],
  },

  TECHNICIAN: {
    dashboardHref: "/dashboard/technician",
    links: [
      {
        href: "/dashboard/technician",
        label: "Dashboard",
      },
      {
        href: "/dashboard/technician/bookings",
        label: "Bookings",
      },
    ],
  },

  ADMIN: {
    dashboardHref: "/dashboard/admin",
    links: [
      {
        href: "/dashboard/admin",
        label: "Admin Panel",
      },
      {
        href: "/dashboard/admin/categories",
        label: "Categories",
      },
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

function AuthButtons({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Link
        href="/login"
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
        href="/register"
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

  const dashboardHref = role
    ? ROLE_CONFIG[role].dashboardHref
    : null;

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
          className="size-9 rounded-full outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label="Open account menu"
        >
          {isLoggedIn ? (
            <Avatar className="size-9">
              <AvatarFallback>
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <UserIcon className="size-5" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-52"
      >
        {isLoggedIn ? (
          <>
            <DropdownMenuLabel className="truncate">
              {userName}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {dashboardHref && (
              <DropdownMenuItem asChild>
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem asChild>
              <Link
                href={profileLink}
                className="flex items-center gap-2"
              >
                <UserIcon className="size-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="size-4" />
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link
                href="/login"
                className="flex items-center gap-2"
              >
                <LogIn className="size-4" />
                Login
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/register"
                className="flex items-center gap-2"
              >
                <UserPlus className="size-4" />
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
}: NavbarProps & {
  links: NavLink[];
  onLogout: () => void;
}) {
  const dashboardHref = role
    ? ROLE_CONFIG[role].dashboardHref
    : null;

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
          className="size-9 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-75 sm:w-85"
      >
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <UserIcon className="size-4" />
            Menu
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 pt-6">
          <nav className="flex flex-col gap-1">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t pt-5">
            {isLoggedIn ? (
              <div className="flex flex-col gap-2.5">
                <div className="mb-2 rounded-lg bg-muted/50 px-3 py-3">
                  <p className="text-xs text-muted-foreground">
                    Signed in as
                  </p>

                  <p className="mt-1 truncate text-sm font-medium">
                    {userName}
                  </p>
                </div>

                {dashboardHref && (
                  <Link
                    href={dashboardHref}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                      }),
                      "w-full justify-start",
                    )}
                  >
                    <LayoutDashboard className="mr-2 size-4" />
                    Dashboard
                  </Link>
                )}

                <Link
                  href={profileLink}
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                    }),
                    "w-full justify-start",
                  )}
                >
                  <UserIcon className="mr-2 size-4" />
                  Profile
                </Link>

                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={onLogout}
                >
                  <LogOut className="mr-2 size-4" />
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

export default function Navbar({
  role = null,
  userName = null,
}: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logged out successfully.");

      router.push("/login");
      router.refresh();
    } catch {
      // toast.error("Failed to logout.");
    }
  };

  const links = [
    ...BASE_LINKS,
    ...(role ? ROLE_CONFIG[role].links : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-5 sm:px-8 lg:px-[clamp(2rem,6vw,7rem)]">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0"
          aria-label="FixItNow home"
        >
          <span className="text-xl font-bold tracking-tight text-primary">
            FixItNow
          </span>
        </Link>

        {/* Desktop navigation */}
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Desktop controls */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Theme button */}
            <ThemeMode />

            {/* User button */}
            <AccountMenu
              role={role}
              userName={userName}
              onLogout={handleLogout}
            />
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeMode />

            <MobileMenu
              links={links}
              role={role}
              userName={userName}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
