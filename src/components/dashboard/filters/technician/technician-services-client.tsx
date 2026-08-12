"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import type { Service } from "@/types/api";
import type { Category } from "@/types/category";
import { toggleServiceAvailability } from "@/actions/service.action";

interface TechnicianServicesClientProps {
  services: Service[];
  categories: Category[];
  servicesError: string | null;
  categoriesError: string | null;
}

export default function TechnicianServicesClient({
  services,
  categories,
  servicesError,
}: TechnicianServicesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleToggleAvailability = async (serviceId: string, current: boolean) => {
    setActionLoading(serviceId);
    try {
      const result = await toggleServiceAvailability(serviceId, !current);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      // Ensures React Server Component re-rendering smoothly applies to DOM UI
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setActionLoading(null);
    }
  };

  if (servicesError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{servicesError}</AlertDescription>
      </Alert>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
        <h3 className="text-lg font-semibold">No services found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You haven&apos;t added any services yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div
          key={service.id}
          className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {service.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {service.description || "No description"}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Info label="Price" value={`$${service.price}`} />
                <Info
                  label="Category"
                  value={
                    categories.find((c) => c.id === service.categoryId)?.name ||
                    "Unknown"
                  }
                />
                <Info
                  label="Available"
                  value={service.isAvailable ? "Yes" : "No"}
                />
                <Info
                  label="Created"
                  value={new Date(service.createdAt).toLocaleString()}
                />
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={actionLoading === service.id || isPending}
                onClick={() =>
                  handleToggleAvailability(service.id, service.isAvailable)
                }
                className="cursor-pointer"
              >
                {service.isAvailable ? "Mark Unavailable" : "Mark Available"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-all text-sm font-medium">{value}</p>
    </div>
  );
}