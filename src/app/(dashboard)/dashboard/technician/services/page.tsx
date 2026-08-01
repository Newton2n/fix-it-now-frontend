import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { getAllServiceByLoginTechnician } from "@/actions/service.action";
import { getAllCategories } from "@/actions/category.action";
import type { Service } from "@/types/api";
import type { Category } from "@/types/api";
import TechnicianServicesClient from "@/components/dashboard/technician/technician-services-client";

export default async function TechnicianServicesPage() {
  const [servicesRes, categoriesRes] = await Promise.all([
    getAllServiceByLoginTechnician(),
    getAllCategories(),
  ]);

  const services: Service[] = servicesRes.success ? servicesRes.data?.result ?? [] : [];
  const categories: Category[] = categoriesRes.success ? categoriesRes.data ?? [] : [];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Services"
        description="Manage the services you offer to customers."
      />

      <SectionCard
        title="Service List"
        description={`You have ${services.length} service${services.length !== 1 ? "s" : ""}`}
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