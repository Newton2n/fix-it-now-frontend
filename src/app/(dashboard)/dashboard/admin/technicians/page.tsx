import { Suspense } from "react";
import { getAllTechnicianProfile } from "@/actions/admin.action";
import { TechnicianSearchParams } from "@/schema/technician/technician.schema";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TechnicianProfile } from "@/types/technician";
import { TechnicianCard } from "@/components/admin/admin-technician-card";
import TechnicianFilters from "@/components/dashboard/filters/customer/technician-filter";

export default async function AdminTechniciansPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  // Serialized key forces Suspense to show skeleton loader when route/query params change
  const filterKey = JSON.stringify(resolvedParams);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Technicians"
        description="Review and manage technician profiles."
      />

      <Suspense key={filterKey} fallback={<TechniciansSkeleton />}>
        <TechniciansContent resolvedParams={resolvedParams} />
      </Suspense>
    </div>
  );
}

async function TechniciansContent({
  resolvedParams,
}: {
  resolvedParams: Record<string, string | string[] | undefined>;
}) {
  const query: TechnicianSearchParams = {
    search: typeof resolvedParams.search === "string" ? resolvedParams.search : undefined,
    page: typeof resolvedParams.page === "string" ? Number(resolvedParams.page) : 1,
    limit: typeof resolvedParams.limit === "string" ? Number(resolvedParams.limit) : 10,
    minExperience:
      typeof resolvedParams.minExperience === "string"
        ? Number(resolvedParams.minExperience)
        : undefined,
    isAvailable:
      typeof resolvedParams.isAvailable === "string" ? resolvedParams.isAvailable : undefined,
    status:
      (resolvedParams.status as "PENDING_APPROVAL" | "VERIFIED" | "SUSPENDED") ||
      undefined,
    skills: typeof resolvedParams.skills === "string" ? resolvedParams.skills : undefined,
    serviceArea:
      typeof resolvedParams.serviceArea === "string" ? resolvedParams.serviceArea : undefined,
    sortBy: (resolvedParams.sortBy as "experience" | "date" | undefined) || "date",
    sortOrder: (resolvedParams.sortOrder as "asc" | "desc" | undefined) || "desc",
  };

  const result = await getAllTechnicianProfile(query);

  if (!result.success) {
    return (
      <SectionCard title="Unable to load technicians">
        <div className="rounded-xl border border-dashed py-16 text-center">
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {result.message || "Unable to load technicians."}
          </p>
        </div>
      </SectionCard>
    );
  }

  const technicians: TechnicianProfile[] = result.data?.data ?? [];
  const meta = result.data?.meta ?? {
    page: 1,
    limit: 10,
    totalRow: 0,
    totalPage: 0,
  };

  // Ensure totalPage is at least 1 when there are rows
  const totalPage =
    meta.totalPage > 0 ? meta.totalPage : meta.totalRow > 0 ? 1 : 0;

  return (
    <div className="space-y-4">
      {/* Filters + pagination */}
      <TechnicianFilters currentPage={meta.page} totalPage={totalPage} />

      <SectionCard
        title="Technician List"
        description={`Page ${meta.page} of ${totalPage} • ${meta.totalRow} total`}
      >
        {technicians.length > 0 ? (
          <div className="space-y-4">
            {technicians.map((technician) => (
              <TechnicianCard key={technician.id} technician={technician} />
            ))}
          </div>
        ) : (
          <EmptyTechnicians />
        )}
      </SectionCard>
    </div>
  );
}

function EmptyTechnicians() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
      <h3 className="text-lg font-semibold text-foreground">
        No technicians found
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        There are no technicians to display.
      </p>
    </div>
  );
}

function TechniciansSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filter Toolbar Skeleton */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <Skeleton className="h-10 w-full max-w-xs" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Technician List Section Skeleton */}
      <SectionCard title="Technician List" description="Loading technicians...">
        <div className="space-y-4">
          <SkeletonTechnicianCard />
          <SkeletonTechnicianCard />
          <SkeletonTechnicianCard />
        </div>
      </SectionCard>
    </div>
  );
}

function SkeletonTechnicianCard() {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* User / Profile Metadata */}
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          <div className="space-y-2 flex-1 min-w-0">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-60" />
            
            {/* Skills & Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </div>
        </div>

        {/* Status Badges & Action Buttons */}
        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}