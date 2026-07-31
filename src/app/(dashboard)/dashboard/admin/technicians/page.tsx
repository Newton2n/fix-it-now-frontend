import { Suspense } from "react";
import Link from "next/link";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getAllTechnicianProfile } from "@/actions/admin.action";
import type { TechnicianProfile } from "@/types/api";
import TechnicianActionButtons from "@/components/admin/technician-action-buttons";
import { TechnicianVerificationBadge } from "@/components/status-badges";

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
    <SectionCard title="Technician List" description="Manage technician profiles">
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

function TechnicianCard({
  technician,
}: {
  technician: TechnicianProfile;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">
              {getBioPreview(technician.bio)}
            </h3>
            <TechnicianVerificationBadge status={technician.status} />
          </div>

          <p className="text-sm text-muted-foreground">
            Experience: {technician.yearsOfExperience}
          </p>

          <p className="text-sm text-muted-foreground">
            Skills: {technician.skills?.join(", ") || "Not added"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/technician-profile/${technician.id}`}>
              View Profile
            </Link>
          </Button>

          <TechnicianActionButtons technician={technician} />
        </div>
      </div>
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

function getBioPreview(bio: string | null | undefined) {
  if (!bio) return "No bio added";
  if (bio.length <= 60) return bio;
  return `${bio.slice(0, 60)}...`;
}