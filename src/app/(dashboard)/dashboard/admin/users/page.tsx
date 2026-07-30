import { getAllUser } from "@/actions/admin.action";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
type UserStatus = "ACTIVE" | "BANNED" | "INACTIVE";

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

type UserResponse = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: User[];
};

export default async function AdminUsersPage() {
  const result = await getAllUser();
  const users = result.data.result.data;
  const meta = result.data.result.meta;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Users"
        description="Manage customers, technicians, and admins."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Users" value={meta.totalRow} />
        <StatCard
          label="Customers"
          value={users.filter((u: User) => u.role === "CUSTOMER").length}
        />
        <StatCard
          label="Technicians"
          value={users.filter((u: User) => u.role === "TECHNICIAN").length}
        />
      </div>

      <SectionCard
        title="User List"
        description={`Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total users`}
      >
        {users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user: User) => (
              <div
                key={user.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        User
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {user.name}
                      </p>
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
                      <Info
                        label="Country"
                        value={user.country ?? "Not added"}
                      />
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

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="destructive">
                        Ban / Unban
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              No users found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no registered users to display.
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
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
    case "BANNED":
      return "Banned";
    case "INACTIVE":
      return "Inactive";
    default:
      return status;
  }
}

function getStatusVariant(status: UserStatus) {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "BANNED":
      return "destructive";
    case "INACTIVE":
      return "secondary";
    default:
      return "secondary";
  }
}

function getRoleVariant(role: UserRole) {
  switch (role) {
    case "ADMIN":
      return "destructive";
    case "TECHNICIAN":
      return "outline";
    case "CUSTOMER":
      return "secondary";
    default:
      return "secondary";
  }
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}
