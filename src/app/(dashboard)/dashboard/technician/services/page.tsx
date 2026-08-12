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
import { ServiceSearchFilters } from "@/schema/service/service.schema";
import TechnicianServiceFilters from "@/components/dashboard/filters/technician/technician-service-filters";

type ServiceResult = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: Service[];
};

export default async function TechnicianServicesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const filterKey = JSON.stringify(resolvedParams);

  return (
    <Suspense key={filterKey} fallback={<TechnicianServicesSkeleton />}>
      <TechnicianServicesContent resolvedParams={resolvedParams} />
    </Suspense>
  );
}

async function TechnicianServicesContent({
  resolvedParams,
}: {
  resolvedParams: Record<string, string | string[] | undefined>;
}) {
  const query: ServiceSearchFilters = {
    search: typeof resolvedParams.search === "string" ? resolvedParams.search : undefined,
    categoryId:
      typeof resolvedParams.categoryId === "string" ? resolvedParams.categoryId : undefined,
    minPrice:
      typeof resolvedParams.minPrice === "string" ? Number(resolvedParams.minPrice) : undefined,
    maxPrice:
      typeof resolvedParams.maxPrice === "string" ? Number(resolvedParams.maxPrice) : undefined,
    isAvailable:
      typeof resolvedParams.isAvailable === "string" ? resolvedParams.isAvailable : undefined,
    page: typeof resolvedParams.page === "string" ? Number(resolvedParams.page) : 1,
    limit: typeof resolvedParams.limit === "string" ? Number(resolvedParams.limit) : 10,
    sortBy: (resolvedParams.sortBy as "price" | "date" | undefined) || "date",
    sortOrder: (resolvedParams.sortOrder as "asc" | "desc" | undefined) || "desc",
  };

  const [profileRes, servicesRes, categoriesRes] = await Promise.all([
    getLoginTechnicianProfile(),
    getAllServiceByLoginTechnician(query),
    getAllCategories(),
  ]);

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
              your profile first, then you can add and manage the services you
              offer.
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

  const services: Service[] = servicesRes.success ? servicesRes.data : [];
  const categories: Category[] = categoriesRes.success
    ? categoriesRes.data ?? []
    : [];

  const serviceResult: ServiceResult = {
    meta: servicesRes.meta,
    data: services,
  };

  const meta = serviceResult.meta;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Services"
        description="Manage the services you offer to customers."
      />

      <TechnicianServiceFilters
        currentPage={meta.currentPage}
        totalPage={meta.totalPage}
        categories={categories}
      />

      <SectionCard
        title="Service List"
        description={
          meta.totalRow > 0
            ? `Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total services`
            : "You have no services yet."
        }
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
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Filters Bar Skeleton */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Service List Card Skeleton Wrapper */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-52" />
        </div>

        {/* Service Item Cards */}
        <div className="space-y-4 pt-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border bg-card p-4 shadow-sm space-y-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>

                  {/* 4 Info Badges */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-lg border bg-background p-3 space-y-2"
                      >
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button Skeleton */}
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Skeleton className="h-9 w-36 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}