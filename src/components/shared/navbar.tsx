"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  FileText,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Menu,
  ShieldCheck,
  User as UserIcon,
  UserPlus,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { logout } from "@/actions/auth.action";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

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

import ThemeMode from "@/components/theme-mode";

import { cn } from "@/lib/utils";
import BackButton from "./back-button";

export type Role =
  | "CUSTOMER"
  | "TECHNICIAN"
  | "ADMIN"
  | null;

type NavbarProps = {
  role?: Role;
  userName?: string | null;
  profilePicture?: string | null;
};

type NavLink = {
  href: string;
  label: string;
  exact?: boolean;
  icon?: React.ElementType;
};

// Core navigation links
const BASE_LINKS: NavLink[] = [
  {
    href: "/",
    label: "Home",
    exact: true,
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

// Secondary / Info links grouped in dropdown & mobile section
const SECONDARY_LINKS: NavLink[] = [
  {
    href: "/about",
    label: "About Us",
    icon: Info,
  },
  {
    href: "/contact",
    label: "Contact",
    icon: Mail,
  },
  {
    href: "/privacy",
    label: "Privacy Policy",
    icon: ShieldCheck,
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
        exact: false,
      },
    ],
  },

  TECHNICIAN: {
    dashboardHref: "/dashboard/technician",
    links: [
      {
        href: "/dashboard/technician",
        label: "Dashboard",
        exact: false,
      },
    ],
  },

  ADMIN: {
    dashboardHref: "/dashboard/admin",
    links: [
      {
        href: "/dashboard/admin",
        label: "Admin Panel",
        exact: false,
      },
    ],
  },
};

function getInitials(name?: string | null) {
  if (!name) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getRoleLabel(role: Role) {
  if (!role) {
    return "";
  }

  return (
    role.charAt(0) +
    role.slice(1).toLowerCase()
  );
}

function getProfileLink(role: Role) {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin/profile";

    case "CUSTOMER":
      return "/dashboard/customer/profile";

    case "TECHNICIAN":
      return "/dashboard/technician/profile";

    default:
      return "/profile";
  }
}

function isRouteActive(
  pathname: string,
  href: string,
  exact = false,
) {
  if (exact || href === "/") {
    return pathname === href;
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

function AuthButtons({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex gap-2",
        mobile ? "flex-col" : "items-center",
      )}
    >
      <Button
        asChild
        variant="outline"
        className={cn(
          "cursor-pointer",
          mobile && "w-full justify-center",
        )}
      >
        <Link
          href="/login"
          onClick={onNavigate}
        >
          <LogIn className="size-4" />
          Login
        </Link>
      </Button>

      <Button
        asChild
        className={cn(
          "cursor-pointer",
          mobile && "w-full justify-center",
        )}
      >
        <Link
          href="/register"
          onClick={onNavigate}
        >
          <UserPlus className="size-4" />
          Register
        </Link>
      </Button>
    </div>
  );
}

function AccountMenu({
  role,
  userName,
  profilePicture,
  onLogout,
}: {
  role: Role;
  userName?: string | null;
  profilePicture?: string | null;
  onLogout: () => void;
}) {
  if (!userName) {
    return null;
  }

  const dashboardHref = role
    ? ROLE_CONFIG[role].dashboardHref
    : null;

  const profileLink = getProfileLink(role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group h-10 cursor-pointer rounded-full px-1.5 pr-2 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open profile menu"
        >
          <Avatar size="default">
            <AvatarImage
              src={profilePicture ?? undefined}
              alt={`${userName}'s profile picture`}
            />

            <AvatarFallback>
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>

          <span className="hidden max-w-32 truncate pl-1.5 text-sm font-medium lg:block">
            {userName}
          </span>

          <ChevronDown className="ml-1 hidden size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 lg:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-60 rounded-xl p-1.5"
      >
        {/* User information */}
        <DropdownMenuLabel className="px-2 py-2">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarImage
                src={profilePicture ?? undefined}
                alt={`${userName}'s profile picture`}
              />

              <AvatarFallback>
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {userName}
              </p>

              {role && (
                <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                  {getRoleLabel(role)}
                </p>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Dashboard */}
        {dashboardHref && (
          <DropdownMenuItem asChild>
            <Link
              href={dashboardHref}
              className="cursor-pointer"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        {/* Profile */}
        <DropdownMenuItem asChild>
          <Link
            href={profileLink}
            className="cursor-pointer"
          >
            <UserIcon className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu({
  links,
  role,
  userName,
  profilePicture,
  onLogout,
}: NavbarProps & {
  links: NavLink[];
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isLoggedIn = Boolean(userName);

  const dashboardHref = role
    ? ROLE_CONFIG[role].dashboardHref
    : null;

  const profileLink = getProfileLink(role as Role);

  const dashboardActive =
    dashboardHref !== null
      ? isRouteActive(pathname, dashboardHref, false)
      : false;

  const profileActive = isRouteActive(pathname, profileLink, true);

  const handleNavigation = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-9 cursor-pointer rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[300px] p-0 sm:w-[360px]"
      >
        <SheetHeader className="border-b px-5 py-5 text-left">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarImage
                  src={profilePicture ?? undefined}
                  alt={`${userName}'s profile picture`}
                />

                <AvatarFallback>
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <SheetTitle className="truncate text-base">
                  {userName}
                </SheetTitle>

                {role && (
                  <p className="mt-1 text-xs capitalize text-muted-foreground">
                    {getRoleLabel(role)}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <SheetTitle>Navigation</SheetTitle>
          )}
        </SheetHeader>

        <div className="flex h-[calc(100vh-81px)] flex-col overflow-y-auto">
          {/* Main navigation */}
          <nav className="flex flex-col gap-1 px-4 py-4">
            <span className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </span>
            {links.map((item) => {
              const active = isRouteActive(
                pathname,
                item.href,
                item.exact,
              );

              return (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className={cn(
                    "h-10 cursor-pointer justify-start rounded-md px-3 text-sm transition-colors",
                    active
                      ? "font-semibold text-primary"
                      : "font-medium text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={handleNavigation}
                  >
                    {item.label}
                  </Link>
                </Button>
              );
            })}

            {/* Secondary / Company Links Section in Mobile */}
            <div className="my-2 border-t pt-3" />

            <span className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Company & Legal
            </span>

            {SECONDARY_LINKS.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(pathname, item.href);

              return (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className={cn(
                    "h-10 cursor-pointer justify-start rounded-md px-3 text-sm transition-colors",
                    active
                      ? "font-semibold text-primary"
                      : "font-medium text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={handleNavigation}
                  >
                    {Icon && <Icon className="mr-2 size-4" />}
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Logged in user actions */}
          {isLoggedIn && (
            <div className="mt-auto border-t px-4 py-5">
              <div className="flex flex-col gap-2">
                {/* Dashboard */}
                {dashboardHref && (
                  <Button
                    asChild
                    variant="outline"
                    className={cn(
                      "h-10 w-full cursor-pointer justify-start rounded-md",
                      dashboardActive && "font-semibold text-primary",
                    )}
                  >
                    <Link
                      href={dashboardHref}
                      aria-current={
                        dashboardActive ? "page" : undefined
                      }
                      onClick={handleNavigation}
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>
                  </Button>
                )}

                {/* Profile */}
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "h-10 w-full cursor-pointer justify-start rounded-md",
                    profileActive
                      ? "font-semibold text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Link
                    href={profileLink}
                    aria-current={profileActive ? "page" : undefined}
                    onClick={handleNavigation}
                  >
                    <UserIcon className="size-4" />
                    Profile
                  </Link>
                </Button>

                {/* Logout */}
                <Button
                  variant="destructive"
                  className="h-10 w-full cursor-pointer justify-start rounded-md"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}

          {/* Logged out actions */}
          {!isLoggedIn && (
            <div className="mt-auto border-t px-4 py-5">
              <AuthButtons
                mobile
                onNavigate={handleNavigation}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Navbar({
  role = null,
  userName = null,
  profilePicture = null,
}: NavbarProps) {
  const pathname = usePathname();

  const isLoggedIn = Boolean(userName);

  const handleLogout = async () => {
    try {
      const res = await logout();

      if (res?.success) {
        toast.success("Logged out successfully.");
      }
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    } finally {
      window.location.href = "/login";
    }
  };

  const links = [
    ...BASE_LINKS,
    ...(role ? ROLE_CONFIG[role].links : []),
  ];

  // Checks if any of the secondary pages (About, Contact, etc.) are active
  const isSecondaryActive = SECONDARY_LINKS.some((item) =>
    isRouteActive(pathname, item.href),
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        {pathname !== "/" && (
          <BackButton
            label="Back"
            className="shrink-0"
          />
        )}

        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 cursor-pointer"
          aria-label="FixItNow home"
        >
          <span className="text-xl font-bold tracking-tight text-primary">
            FixItNow
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 min-[950px]:flex">
          {links.map((item) => {
            const active = isRouteActive(
              pathname,
              item.href,
              item.exact,
            );

            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn(
                  "h-9 cursor-pointer rounded-md px-3 text-sm transition-colors",
                  active
                    ? "font-semibold text-primary"
                    : "font-medium text-muted-foreground hover:text-foreground",
                )}
              >
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </Button>
            );
          })}

          {/* Desktop "More" Dropdown for About, Contact, Legal pages */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "group h-9 cursor-pointer rounded-md px-3 text-sm font-medium transition-colors",
                  isSecondaryActive
                    ? "font-semibold text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                More
                <ChevronDown className="ml-1 size-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="w-48 rounded-xl p-1.5"
            >
              {SECONDARY_LINKS.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(pathname, item.href);

                return (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "cursor-pointer",
                        active && "font-semibold text-primary",
                      )}
                    >
                      {Icon && <Icon className="size-4" />}
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeMode />

          {/* Desktop account */}
          <div className="hidden items-center gap-2 md:flex">
            {isLoggedIn ? (
              <AccountMenu
                role={role}
                userName={userName}
                profilePicture={profilePicture}
                onLogout={handleLogout}
              />
            ) : (
              <AuthButtons />
            )}
          </div>

          {/* Mobile menu */}
          <div className="min-[950px]:hidden">
            <MobileMenu
              links={links}
              role={role}
              userName={userName}
              profilePicture={profilePicture}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
}