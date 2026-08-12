// app/admin/users/page.tsx
import { Suspense } from "react";
import { getAllUser } from "@/actions/admin.action";
import { UserSearchParams } from "@/schema/user/user.schema";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import UserActions from "@/components/admin/user-action";
import { User, UserMeta, UserRole } from "@/types/admin";
import { UserStatus } from "@/types/api";
import UserFilters from "@/components/dashboard/filters/admin/user-filter";

const emptyMeta: UserMeta = {
  currentPage: 1,
  limit: 10,
  totalRow: 0,
  totalPage: 0,
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  // Serialized key forces Suspense to show skeleton loader when route/query params change
  const filterKey = JSON.stringify(resolvedParams);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Users"
        description="Manage customers, technicians, and admins."
      />

      <Suspense key={filterKey} fallback={<UsersPageSkeleton />}>
        <UsersContent resolvedParams={resolvedParams} />
      </Suspense>
    </div>
  );
}

async function UsersContent({
  resolvedParams,
}: {
  resolvedParams: Record<string, string | string[] | undefined>;
}) {
  const query: UserSearchParams = {
    search:
      typeof resolvedParams.search === "string" ? resolvedParams.search : undefined,
    phoneNumber:
      typeof resolvedParams.phoneNumber === "string" ? resolvedParams.phoneNumber : undefined,
    email:
      typeof resolvedParams.email === "string" ? resolvedParams.email : undefined,
    role:
      (resolvedParams.role as UserRole | undefined) || undefined,
    status:
      (resolvedParams.status as UserStatus | undefined) || undefined,
    country:
      typeof resolvedParams.country === "string" ? resolvedParams.country : undefined,
    page:
      typeof resolvedParams.page === "string" ? Number(resolvedParams.page) : 1,
    limit:
      typeof resolvedParams.limit === "string" ? Number(resolvedParams.limit) : 10,
    sortBy:
      (resolvedParams.sortBy as "name" | "role" | "createdAt" | undefined) ||
      "createdAt",
    sortOrder:
      (resolvedParams.sortOrder as "asc" | "desc" | undefined) || "desc",
  };

  const result = await getAllUser(query);

  if (!result.success) {
    return (
      <SectionCard title="Unable to load users">
        <div className="rounded-xl border border-dashed py-16 text-center">
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {result.message || "Unable to load users."}
          </p>
        </div>
      </SectionCard>
    );
  }

  const userResult = result.data;
  const users: User[] = userResult?.data ?? [];
  const meta: UserMeta = userResult?.meta ?? emptyMeta;

  // Stats based on current page only, so they match the list
  const customerCount = users.filter((u) => u.role === "CUSTOMER").length;
  const technicianCount = users.filter(
    (u) => u.role === "TECHNICIAN",
  ).length;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Users (this page)" value={users.length} />
        <StatCard label="Customers" value={customerCount} />
        <StatCard label="Technicians" value={technicianCount} />
      </div>

      {/* Filters + pagination */}
      <UserFilters currentPage={meta.currentPage} totalPage={meta.totalPage} />

      <SectionCard
        title="User List"
        description={`Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total users`}
      >
        {users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <EmptyUsers />
        )}
      </SectionCard>
    </>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              User
            </p>
            <p className="text-lg font-semibold text-foreground">{user.name}</p>
            <p className="break-all text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            <Info label="User ID" value={user.id} />
            <Info label="Role" value={user.role} />
            <Info label="Status" value={user.status} />
            <Info
              label="Phone"
              value={user.phoneNumber ?? "Not added"}
            />
            <Info label="Country" value={user.country ?? "Not added"} />
            <Info
              label="Created At"
              value={formatDateTime(user.createdAt)}
            />
            <Info
              label="Updated At"
              value={formatDateTime(user.updatedAt)}
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={getStatusVariant(user.status)}
              className="rounded-full px-3"
            >
              {getStatusLabel(user.status)}
            </Badge>

            <Badge
              variant={getRoleVariant(user.role)}
              className="rounded-full px-3"
            >
              {user.role}
            </Badge>
          </div>

          <UserActions userId={user.id} status={user.status} />
        </div>
      </div>
    </div>
  );
}

function EmptyUsers() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
      <h3 className="text-lg font-semibold text-foreground">
        No users found
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        There are no registered users to display.
      </p>
    </div>
  );
}

function UsersPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Filter Toolbar Skeleton */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <Skeleton className="h-10 w-full max-w-xs" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>

      {/* User List Section Skeleton */}
      <SectionCard title="User List" description="Loading users...">
        <div className="space-y-4">
          <SkeletonUserCard />
          <SkeletonUserCard />
          <SkeletonUserCard />
        </div>
      </SectionCard>
    </div>
  );
}

function SkeletonStatCard() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-2">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

function SkeletonUserCard() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3 flex-1">
          <div className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-56" />
          </div>

          {/* Grid of details */}
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-background p-3 space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>

        {/* Badges and Actions */}
        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-medium leading-6 text-foreground">
        {value}
      </p>
    </div>
  );
}

function getStatusLabel(status: UserStatus) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "INACTIVE":
      return "Inactive";
    case "BLOCKED":
      return "Blocked";
    default:
      return "Unknown";
  }
}

function getStatusVariant(status: UserStatus) {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "INACTIVE":
      return "secondary";
    case "BLOCKED":
      return "destructive";
    default:
      return "secondary";
  }
}

function getRoleVariant(role: UserRole) {
  switch (role) {
    case "ADMIN":
      return "destructive" as const;
    case "TECHNICIAN":
      return "outline" as const;
    case "CUSTOMER":
      return "secondary" as const;
    default:
      return "secondary" as const;
  }
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}