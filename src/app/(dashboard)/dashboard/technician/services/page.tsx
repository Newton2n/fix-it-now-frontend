"use client";

import { useEffect, useState } from "react";
import { MoreVertical, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
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
import { Skeleton } from "@/components/ui/skeleton";

import {
  getAllServiceByLoginTechnician,
  deleteService,
} from "@/actions/service.action";

import { getAllCategories } from "@/actions/category.action";

import type { Service } from "@/types/api";
import type { Category } from "@/schema/category/category.schema";

export default function TechnicianServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          getAllServiceByLoginTechnician(),
          getAllCategories(),
        ]);

        /*
         * Services
         */
        if (servicesRes?.success && servicesRes.data?.result) {
          setServices(servicesRes.data.result);
        }

        /*
         * Categories
         *
         * getAllCategories() returns:
         *
         * {
         *   success: true,
         *   data: Category[],
         *   meta: {...}
         * }
         */
        if (categoriesRes?.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }

        /*
         * Handle API errors individually.
         */
        if (!servicesRes?.success) {
          toast.error(servicesRes?.message || "Failed to load your services.");
        }

        if (!categoriesRes?.success) {
          toast.error(categoriesRes?.message || "Failed to load categories.");
        }
      } catch (error) {
        console.error("Failed to fetch services data:", error);

        toast.error("Something went wrong while loading your services.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /*
   * Open edit dialog
   */
  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setEditDialogOpen(true);
  };

  /*
   * Delete service
   */
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    const result = await deleteService(serviceToDelete);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    setServices((prev) =>
      prev.filter((service) => service.id !== serviceToDelete),
    );

    setDeleteConfirmOpen(false);
    setServiceToDelete(null);
  };

  /*
   * Service created successfully
   *
   * We don't need window.location.reload().
   */
  const handleCreateSuccess = (newService?: Service) => {
    setCreateDialogOpen(false);

    if (newService) {
      setServices((prev) => [newService, ...prev]);
    }
  };

  /*
   * Service updated successfully
   */
  const handleEditSuccess = (updatedService?: Service) => {
    setEditDialogOpen(false);

    if (updatedService) {
      setServices((prev) =>
        prev.map((service) =>
          service.id === updatedService.id ? updatedService : service,
        ),
      );
    }

    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="My Services"
          description="Manage the services you offer to customers."
        />

        <SectionCard
          title="Service List"
          description="Loading your services..."
        >
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-32 w-full" />
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Services"
        description="Manage the services you offer to customers."
        action={
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
                  {/* Service Information */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Service Title
                      </p>

                      <h3 className="text-lg font-semibold">{service.title}</h3>
                    </div>

                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </p>

                    <div className="grid gap-3 md:grid-cols-2">
                      <Info label="Service ID" value={service.id} />

                      <Info label="Category ID" value={service.categoryId} />

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

                  {/* Actions */}
                  <div className="flex flex-col gap-3 sm:items-end">
                    <Badge
                      variant={service.isAvailable ? "default" : "destructive"}
                      className="rounded-full px-3"
                    >
                      {service.isAvailable ? "Available" : "Unavailable"}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyServices onCreateClick={() => setCreateDialogOpen(true)} />
        )}
      </SectionCard>

      {/* Edit Service Dialog */}
      {selectedService && (
        <Dialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);

            if (!open) {
              setSelectedService(null);
            }
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        title="Delete Service?"
        description="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete Service"
        cancelText="Cancel"
        isDestructive
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          setDeleteConfirmOpen(open);

          if (!open) {
            setServiceToDelete(null);
          }
        }}
        onConfirm={handleDeleteService}
      />
    </div>
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
  return new Date(dateString).toLocaleString();
}
