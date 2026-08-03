import {
  LayoutDashboard,
  Users,
  Wrench,
  CalendarDays,
  CreditCard,
  Star,
  FolderKanban,
  ClipboardList,
  DollarSign,
  UserCog,
  type LucideIcon,
} from "lucide-react";

export type Role = "ADMIN" | "CUSTOMER" | "TECHNICIAN";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const dashboardNav: Record<Role, NavItem[]> = {
  ADMIN: [
    {
      href: "/dashboard/admin",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/admin/profile",
      label: "Profile",
      icon: Users,
    },
    {
      href: "/dashboard/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      href: "/dashboard/admin/technicians",
      label: "Technician",
      icon: Wrench,
    },
    {
      href: "/dashboard/admin/bookings",
      label: "Bookings",
      icon: ClipboardList,
    },
    {
      href: "/dashboard/admin/categories",
      label: "Categories",
      icon: FolderKanban,
    },
    {
      href: "/dashboard/admin/payments",
      label: "Payments",
      icon: DollarSign,
    },
  ],

  CUSTOMER: [
    {
      href: "/dashboard/customer",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/customer/bookings",
      label: "Bookings",
      icon: CalendarDays,
    },
    {
      href: "/dashboard/customer/payments",
      label: "Payments",
      icon: CreditCard,
    },
    {
      href: "/dashboard/customer/profile",
      label: "Profile",
      icon: Users,
    },
    {
      href: "/dashboard/customer/reviews",
      label: "Reviews",
      icon: Star,
    },
  ],

  TECHNICIAN: [
    {
      href: "/dashboard/technician",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/technician/profile",
      label: "Profile",
      icon: Users,
    },
    {
      href: "/dashboard/technician/technician-profile",
      label: "Technician Profile",
      icon: UserCog,
    },
    {
      href: "/dashboard/technician/bookings",
      label: "Bookings",
      icon: ClipboardList,
    },
    {
      href: "/dashboard/technician/availability",
      label: "Availability",
      icon: CalendarDays,
    },
    {
      href: "/dashboard/technician/services",
      label: "Services",
      icon: Wrench,
    },
  ],
};