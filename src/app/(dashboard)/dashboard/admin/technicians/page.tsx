import { Suspense } from "react";

import { getAllTechnicianProfile } from "@/actions/admin.action";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import TechnicianActions from "@/components/admin/technician-actions";
import { TechnicianVerificationBadge } from "@/components/status-badges";
import { Skeleton } from "@/components/ui/skeleton";
import type { TechnicianProfile } from "@/types/api";

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

  const technicianResult = result.data;
  const technicians: TechnicianProfile[] = technicianResult?.data ?? [];

  const verifiedCount = technicians.filter(
    (technician) => technician.verificationStatus === "VERIFIED",
  ).length;

  const pendingCount = technicians.filter(
    (technician) => technician.verificationStatus === "PENDING",
  ).length;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Technicians" value={technicians.length} />
        <StatCard label="Verified" value={verifiedCount} />
        <StatCard label="Pending Review" value={pendingCount} />
      </div>

      <SectionCard
        title="Technician List"
        description={`You have ${technicians.length} technician${
          technicians.length !== 1 ? "s" : ""
        }`}
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
    </>
  );
}

function TechnicianCard({
  technician,
}: {
  technician: TechnicianProfile;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Technician
            </p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">
              {getBioPreview(technician.bio)}
            </h3>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            <Info label="User ID" value={technician.userId} />
            <Info label="Experience" value={technician.experience} />
            <Info label="Created" value={formatDateTime(technician.createdAt)} />
            <Info label="Skills" value={technician.skills?.join(", ") || "Not added"} />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <TechnicianVerificationBadge status={technician.verificationStatus} />
          <TechnicianActions technician={technician} />
        </div>
      </div>
    </div>
  );
}

function EmptyTechnicians() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
      <h3 className="text-lg font-semibold text-foreground">No technicians found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        There are no technicians to display.
      </p>
    </div>
  );
}

function TechniciansSkeleton() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>

      <SectionCard title="Technician List" description="Loading technicians...">
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-40 rounded-xl" />
          ))}
        </div>
      </SectionCard>
    </>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-medium leading-6 text-foreground">
        {value}
      </p>
    </div>
  );
}

function getBioPreview(bio: string | null | undefined) {
  if (!bio) return "No bio added";
  if (bio.length <= 60) return bio;
  return `${bio.slice(0, 60)}...`;
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}