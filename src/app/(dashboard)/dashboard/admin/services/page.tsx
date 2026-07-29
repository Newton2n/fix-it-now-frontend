import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const services = [
  { id: 1, title: "Plumbing Repair", status: "Active" },
  { id: 2, title: "AC Installation", status: "Active" },
  { id: 3, title: "Home Cleaning", status: "Inactive" },
];

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Services"
        description="Manage all platform service listings."
      />

      <SectionCard title="Service List" description="All available services">
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{service.title}</p>
                <p className="text-sm text-muted-foreground">Service ID: {service.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{service.status}</Badge>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}