import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  thumbnailImage: string | null;
  createdAt: string;
  updatedAt: string;
};

type TechnicianServicesGridProps = {
  services: Service[];
};

export default function TechnicianServicesGrid({
  services,
}: TechnicianServicesGridProps) {
  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
        <h3 className="text-lg font-semibold text-foreground">No services found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This technician has not created any services yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <div
          key={service.id}
          className="rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
              <Badge
                variant={service.isAvailable ? "default" : "secondary"}
                className="rounded-full px-3"
              >
                {service.isAvailable ? "Active" : "Inactive"}
              </Badge>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {service.description}
            </p>

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm font-medium text-foreground">
                {service.currency} {service.price}
              </p>
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}