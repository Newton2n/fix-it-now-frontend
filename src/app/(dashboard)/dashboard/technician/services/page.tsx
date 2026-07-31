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

  const services: Service[] = res?.data?.result ?? [];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Services"
        description="Manage the services you offer to customers."
        action={
          <Button>
            Add Service
          </Button>
        }
      />

      <SectionCard
        title="Service List"
        description={`You have ${services.length} service${
          services.length !== 1 ? "s" : ""
        }`}
      >
        {services.length > 0 ? (
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Service Title
                      </p>

                      <h3 className="text-lg font-semibold">
                        {service.title}
                      </h3>
                    </div>

                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </p>

                    <div className="grid gap-3 md:grid-cols-2">
                      <Info
                        label="Service ID"
                        value={service.id}
                      />

                      <Info
                        label="Category ID"
                        value={service.categoryId}
                      />

                      <Info
                        label="Technician ID"
                        value={service.technicianId}
                      />

                      <Info
                        label="Price"
                        value={`${service.currency} ${service.price}`}
                      />

                      <Info
                        label="Created"
                        value={formatDateTime(service.createdAt)}
                      />

                      <Info
                        label="Updated"
                        value={formatDateTime(service.updatedAt)}
                      />
                    </div>
                  </div>


                  <div className="flex flex-col gap-3 sm:items-end">
                    <Badge
                      variant={
                        service.isAvailable
                          ? "default"
                          : "destructive"
                      }
                      className="rounded-full px-3"
                    >
                      {service.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </Badge>


                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyServices />
        )}
      </SectionCard>
    </div>
  );
}


function EmptyServices() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
      <h3 className="text-lg font-semibold">
        No services found
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        You haven’t added any services yet. Create your first service to start
        getting bookings.
      </p>

      <Button className="mt-6">
        Add Service
      </Button>
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
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-medium">
        {value}
      </p>
    </div>
  );
}


function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}