import { Suspense } from "react";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllTechnicianProfile } from "@/actions/admin.action";
import type { TechnicianProfile } from "@/types/technician";
import { TechnicianCard } from "@/components/admin/admin-technician-card";

export default function AdminTechniciansPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Technicians"
        description="Review and manage technician profiles."
      />

      <Suspense fallback={<TechniciansSkeleton />}>
        <TechniciansContent />
      </Suspense>
    </div>
  );
}

async function TechniciansContent() {
  const result = await getAllTechnicianProfile();

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

  return (
    <SectionCard
      title="Technician List"
      description="Manage technician profiles"
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