import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const users = [
  { id: 1, name: "John Doe", role: "customer", status: "Active" },
  { id: 2, name: "Aminul Islam", role: "technician", status: "Banned" },
  { id: 3, name: "Sarah Khan", role: "admin", status: "Active" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Users"
        description="Manage customers, technicians, and admins."
      />

      <SectionCard title="User List" description="All registered platform users">
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary">{user.status}</Badge>
                <Button size="sm" variant="outline">
                  Ban / Unban
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}