import { Suspense } from "react";
import Link from "next/link";
import { UserPlus, UserX } from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import TechnicianServicesClient from "@/components/dashboard/technician/technician-services-client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { getAllServiceByLoginTechnician } from "@/actions/service.action";
import { getAllCategories } from "@/actions/category.action";
import { getLoginTechnicianProfile } from "@/actions/technician.action";

import type { Service } from "@/types/api";
import type { Category } from "@/types/category";

export default function TechnicianServicesPage() {
  return (
    <Suspense fallback={<TechnicianServicesSkeleton />}>
      <TechnicianServicesContent />
    </Suspense>
  );
}

async function TechnicianServicesContent() {
  const [profileRes, servicesRes, categoriesRes] = await Promise.all([
    getLoginTechnicianProfile(),
    getAllServiceByLoginTechnician(),
    getAllCategories(),
  ]);

  // 1. Handle missing profile (e.g. 404 / "Resource not found")
  const isProfileNotFound =
    !profileRes.success &&
    profileRes.message?.toLowerCase().includes("resource not found");

  const hasProfile = profileRes.success && Boolean(profileRes.data?.result);

  if (isProfileNotFound || !hasProfile) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="My Services"
          description="Manage the services you offer to customers."
        />

        <SectionCard
          title="Technician Profile Required"
          description="Create your technician profile before managing your services."
        >
          <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-14 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <UserX className="size-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Create your technician profile first
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Your services are connected to your technician profile. Create
              your profile first, then you can add and manage the services you offer.
            </p>

            <div className="mt-6">
              <Button asChild>
                <Link href="/dashboard/technician/technician-profile">
                  <UserPlus className="mr-2 size-4" />
                  Create Technician Profile
                </Link>
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }

  // 2. Handle generic profile fetching error (server down, bad network, etc.)
  if (!profileRes.success) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="My Services"
          description="Manage the services you offer to customers."
        />

        <SectionCard title="Unable to load services">
          <Alert variant="destructive">
            <AlertDescription>
              {profileRes.message || "Unable to load your technician profile."}
            </AlertDescription>
          </Alert>
        </SectionCard>
      </div>
    );
  }

  // 3. Render services UI when profile is valid
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
          categoriesError={
            categoriesRes.success ? null : categoriesRes.message
          }
        />
      </SectionCard>
    </div>
  );
}

function TechnicianServicesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-[450px] w-full rounded-xl" />
    </div>
  );
}