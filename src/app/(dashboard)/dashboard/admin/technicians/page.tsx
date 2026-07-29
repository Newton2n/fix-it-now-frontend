import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const technicians = [
  { id: 1, name: "Rahim Uddin", status: "Verified" },
  { id: 2, name: "Aminul Islam", status: "Pending" },
  { id: 3, name: "Jannat Ara", status: "Verified" },
];

export default function AdminTechniciansPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Technicians"
        description="Review and manage technician profiles."
      />

      <SectionCard title="Technician List" description="Registered technicians">
        <div className="space-y-4">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{tech.name}</p>
                <p className="text-sm text-muted-foreground">Technician ID: {tech.id}</p>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary">{tech.status}</Badge>
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}