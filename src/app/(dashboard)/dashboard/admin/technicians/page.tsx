import { Suspense } from "react";
import { getAllTechnicianProfile } from "@/actions/admin.action";
import { TechnicianSearchParams } from "@/schema/technician/technician.schema";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TechnicianProfile } from "@/types/technician";
import { TechnicianCard } from "@/components/admin/admin-technician-card";
import TechnicianFilters from "@/components/dashboard/filters/customer/technician-filter";

export default function AdminTechniciansPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Technicians"
        description="Review and manage technician profiles."
      />

      <Suspense fallback={<TechniciansSkeleton />}>
        <TechniciansContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function TechniciansContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const query: TechnicianSearchParams = {
    search: typeof params.search === "string" ? params.search : undefined,
    page: typeof params.page === "string" ? Number(params.page) : 1,
    limit: typeof params.limit === "string" ? Number(params.limit) : 10,
    minExperience:
      typeof params.minExperience === "string"
        ? Number(params.minExperience)
        : undefined,
    isAvailable:
      typeof params.isAvailable === "string" ? params.isAvailable : undefined,
    status:
      (params.status as "PENDING_APPROVAL" | "VERIFIED" | "SUSPENDED") ||
      undefined, // 
    skills: typeof params.skills === "string" ? params.skills : undefined,
    serviceArea:
      typeof params.serviceArea === "string" ? params.serviceArea : undefined,
    sortBy: (params.sortBy as "experience" | "date" | undefined) || "date",
    sortOrder: (params.sortOrder as "asc" | "desc" | undefined) || "desc",
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
    <SectionCard title="Technician List" description="Loading technicians...">
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-28 rounded-xl" />
        ))}
      </div>
    </SectionCard>
  );
}
