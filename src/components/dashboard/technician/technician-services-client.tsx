"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { ServiceForm } from "@/components/forms/service-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Service, Category } from "@/types/api";
import { deleteService } from "@/actions/service.action";

type Props = {
  services: Service[];
  categories: Category[];
  servicesError: string | null;
  categoriesError: string | null;
};

export default function TechnicianServicesClient({
  services: initialServices,
  categories,
  servicesError,
  categoriesError,
}: Props) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const refreshList = () => {
    router.refresh();
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setEditDialogOpen(true);
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    const result = await deleteService(serviceToDelete);

    if (!result.success) {
      toast.error(result.message || "Failed to delete service.");
      return;
    }

    toast.success(result.message || "Service deleted.");
    setDeleteConfirmOpen(false);
    setServiceToDelete(null);

    setServices((prev) =>
      prev.filter((service) => service.id !== serviceToDelete),
    );
    refreshList();
  };

  const handleCreateSuccess = async () => {
    setCreateDialogOpen(false);
    refreshList();
  };

  const handleEditSuccess = async () => {
    setEditDialogOpen(false);
    setSelectedService(null);
    refreshList();
  };

  if (servicesError || categoriesError) {
    return (
      <div className="space-y-4">
        {servicesError ? (
          <p className="text-sm text-destructive">{servicesError}</p>
        ) : null}
        {categoriesError ? (
          <p className="text-sm text-destructive">{categoriesError}</p>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
              <DialogDescription>
                Add a new service to your offerings.
              </DialogDescription>
            </DialogHeader>

            <ServiceForm
              mode="create"
              categories={categories}
              onSuccess={handleCreateSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      {services.length > 0 ? (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">
                      Service Title
                    </p>
                    <h3 className="truncate text-lg font-semibold">
                      {service.title}
                    </h3>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 shrink-0"
                        aria-label={`Actions for ${service.title}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditService(service)}
                        className="cursor-pointer gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          setServiceToDelete(service.id);
                          setDeleteConfirmOpen(true);
                        }}
                        className="cursor-pointer gap-2 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Badge
                  variant={service.isAvailable ? "default" : "destructive"}
                  className="w-fit rounded-full px-3"
                >
                  {service.isAvailable ? "Available" : "Unavailable"}
                </Badge>

                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  {service.description}
                </p>

                <div className="grid gap-3 md:grid-cols-2">
                  <Info label="Service ID" value={service.id} />
                  <Info label="Category ID" value={service.categoryId} />
                  <Info label="Technician ID" value={service.technicianId} />
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
            </div>
          ))}
        </div>
      ) : (
        <EmptyServices onCreateClick={() => setCreateDialogOpen(true)} />
      )}

      {selectedService && (
        <Dialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setSelectedService(null);
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Update your service information.
              </DialogDescription>
            </DialogHeader>

            <ServiceForm
              mode="edit"
              initialData={selectedService}
              categories={categories}
              onSuccess={handleEditSuccess}
            />
          </DialogContent>
        </Dialog>
      )}

      <ConfirmDialog
        title="Delete Service?"
        description="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete Service"
        cancelText="Cancel"
        isDestructive
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          setDeleteConfirmOpen(open);
          if (!open) setServiceToDelete(null);
        }}
        onConfirm={handleDeleteService}
      />
    </>
  );
}

function EmptyServices({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
      <h3 className="text-lg font-semibold">No services found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        You haven&apos;t added any services yet. Create your first service to
        start getting bookings.
      </p>
      <Button onClick={onCreateClick} className="mt-6">
        Add Service
      </Button>
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

function formatDateTime(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(dateString));
}
