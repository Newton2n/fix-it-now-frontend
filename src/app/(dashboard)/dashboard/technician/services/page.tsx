import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllServiceByLoginTechnician } from "@/actions/service.action";

type Service = {
  id: string;
  categoryId: string;
  technicianId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  thumbnailImage: string | null;
  galleryImages: string[];
  createdAt: string;
  updatedAt: string;
};

export default async function TechnicianServicesPage() {
  const res = await getAllServiceByLoginTechnician();
  console.log("all service by login technician",res)
  const services: Service[] = res?.data?.result ?? [];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Services"
        description="Manage the services you offer to customers."
        action={<Button>Add Service</Button>}
      />

      <SectionCard
        title="Service List"
        description={`You have ${services.length} active service offering${services.length !== 1 ? "s" : ""}`}
      >
        {services.length > 0 ? (
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Service Title</p>
                      <p className="text-lg font-semibold text-foreground">{service.title}</p>
                    </div>

                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </p>

                    <div className="grid gap-2 md:grid-cols-2">
                      <Info label="Service ID" value={service.id} />
                      <Info label="Category ID" value={service.categoryId} />
                      <Info label="Technician ID" value={service.technicianId} />
                      <Info label="Price" value={`${service.currency} ${service.price}`} />
                      <Info label="Created At" value={formatDateTime(service.createdAt)} />
                      <Info label="Updated At" value={formatDateTime(service.updatedAt)} />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <Badge
                      variant={service.isAvailable ? "default" : "destructive"}
                      className="rounded-full px-3"
                    >
                      {service.isAvailable ? "Available" : "Unavailable"}
                    </Badge>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
            <h3 className="text-lg font-semibold text-foreground">No services found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven’t added any services yet. Create your first service to start getting bookings.
            </p>
            <Button className="mt-6">Add Service</Button>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-all text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}