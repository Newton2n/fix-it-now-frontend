import { Suspense } from "react";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { getAllServiceByLoginTechnician } from "@/actions/service.action";
import { getAllCategories } from "@/actions/category.action";
import type { Service } from "@/types/api";
import type { Category } from "@/types/category";
import TechnicianServicesClient from "@/components/dashboard/technician/technician-services-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function TechnicianServicesPage() {
  return (
    <Suspense fallback={<TechnicianServicesSkeleton />}>
      <TechnicianServicesContent />
    </Suspense>
  );
}

async function TechnicianServicesContent() {
  const [servicesRes, categoriesRes] = await Promise.all([
    getAllServiceByLoginTechnician(),
    getAllCategories(),
  ]);

  const services: Service[] = servicesRes.success
    ? servicesRes.data?.result ?? []
    : [];
  const categories: Category[] = categoriesRes.success
    ? categoriesRes.data ?? []
    : [];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Services"
        description="Manage the services you offer to customers."
      />

      <SectionCard
        title="Service List"
        description={`You have ${services.length} service${
          services.length !== 1 ? "s" : ""
        }`}
      >
        <TechnicianServicesClient
          services={services}
          categories={categories}
          servicesError={servicesRes.success ? null : servicesRes.message}
          categoriesError={categoriesRes.success ? null : categoriesRes.message}
        />
      </SectionCard>
    </div>
  );
}

function TechnicianServicesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-112.5 w-full rounded-xl" />
    </div>
  );
}