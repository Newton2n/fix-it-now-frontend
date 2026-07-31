import { Suspense } from "react";

import { getAllUser } from "@/actions/admin.action";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import UserActions from "@/components/admin/user-action";

type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
type UserStatus = "ACTIVE" | "INACTIVE";

type User = {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
  country: string | null;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
};

type UserMeta = {
  currentPage: number;
  limit: number;
  totalRow: number;
  totalPage: number;
};

const emptyMeta: UserMeta = {
  currentPage: 1,
  limit: 10,
  totalRow: 0,
  totalPage: 0,
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Users"
        description="Manage customers, technicians, and admins."
      />

      <Suspense fallback={<UsersPageSkeleton />}>
        <UsersContent />
      </Suspense>
    </div>
  );
}

async function UsersContent() {
  const result = await getAllUser();

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

  const customerCount = users.filter((user) => user.role === "CUSTOMER").length;
  const technicianCount = users.filter((user) => user.role === "TECHNICIAN").length;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Users" value={meta.totalRow} />
        <StatCard label="Customers" value={customerCount} />
        <StatCard label="Technicians" value={technicianCount} />
      </div>

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
            <p className="break-all text-sm text-muted-foreground">{user.email}</p>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            <Info label="User ID" value={user.id} />
            <Info label="Role" value={user.role} />
            <Info label="Status" value={user.status} />
            <Info label="Phone" value={user.phoneNumber ?? "Not added"} />
            <Info label="Country" value={user.country ?? "Not added"} />
            <Info label="Created At" value={formatDateTime(user.createdAt)} />
            <Info label="Updated At" value={formatDateTime(user.updatedAt)} />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getStatusVariant(user.status)} className="rounded-full px-3">
              {getStatusLabel(user.status)}
            </Badge>

            <Badge variant={getRoleVariant(user.role)} className="rounded-full px-3">
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
      <h3 className="text-lg font-semibold text-foreground">No users found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        There are no registered users to display.
      </p>
    </div>
  );
}

function UsersPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      <SectionCard title="User List" description="Loading users...">
        <div className="space-y-4">
          <SkeletonUser />
          <SkeletonUser />
          <SkeletonUser />
        </div>
      </SectionCard>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-8 w-16 animate-pulse rounded bg-muted" />
    </div>
  );
}

function SkeletonUser() {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="h-5 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-56 animate-pulse rounded bg-muted" />

      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
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
  return status === "ACTIVE" ? "Active" : "Inactive";
}

function getStatusVariant(status: UserStatus) {
  return status === "ACTIVE" ? "default" : "secondary";
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