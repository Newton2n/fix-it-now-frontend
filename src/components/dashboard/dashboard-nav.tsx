import {
  LayoutDashboard,
  Users,
  Wrench,
  CalendarDays,
  CreditCard,
  Star,
  Settings,
  LifeBuoy,
  ShieldCheck,
  FolderKanban,
  ClipboardList,
  ListChecks,
  Bell,
} from "lucide-react";

export type Role = "admin" | "customer" | "technician";

export const dashboardNav = {
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/bookings", label: "Bookings", icon: ClipboardList },
    { href: "/dashboard/admin/categories", label: "Categories", icon: FolderKanban },
    { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/bookings", label: "Bookings", icon: CalendarDays },
    { href: "/dashboard/customer/payments", label: "Payments", icon: CreditCard },
    { href: "/dashboard/customer/reviews", label: "Reviews", icon: Star },
    { href: "/dashboard/customer/support", label: "Support", icon: LifeBuoy },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/technician/bookings", label: "Bookings", icon: ClipboardList },
    { href: "/dashboard/technician/availability", label: "Availability", icon: CalendarDays },
    { href: "/dashboard/technician/services", label: "Services", icon: Wrench },
    { href: "/dashboard/technician/settings", label: "Settings", icon: Settings },
  ],
};