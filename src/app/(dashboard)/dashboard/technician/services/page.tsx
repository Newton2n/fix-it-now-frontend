import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const services = [
  { id: 1, title: "Plumbing Repair", status: "Active" },
  { id: 2, title: "AC Installation", status: "Active" },
];

export default function TechnicianServicesPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Services"
        description="Manage the services you offer to customers."
        action={<Button>Add Service</Button>}
      />

      <SectionCard title="Service List" description="Your active service offerings">
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <p className="font-medium">{service.title}</p>
                <p className="text-sm text-muted-foreground">Service ID: {service.id}</p>
              </div>
              <Badge variant="secondary">{service.status}</Badge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}