import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";

import { getAllTechnicians } from "@/actions/technician.action";
import { getUserById } from "@/actions/user.action";

import TechnicianCard from "@/components/technicians/technician-card";
import TechnicianSkeleton from "@/components/technicians/technician-skeleton";
import TechnicianSearchFilters from "@/components/technicians/technician-search-filters";
import TechnicianPagination from "@/components/technicians/technician-pagination";

type SearchParams = {
  search?: string;
  page?: string;
  limit?: string;
  minExperience?: string;
  isAvailable?: string;
  skills?: string;
  serviceArea?: string;
  sortBy?: "experience" | "date";
  sortOrder?: "asc" | "desc";
};

type Technician = {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  isAvailable: boolean;
  yearsOfExperience: string;
  serviceArea: string[];
  status: string;
};

export default async function TechniciansPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const search = params.search || "";
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;

  const minExperience = params.minExperience || "";
  const isAvailable = params.isAvailable || "";
  const skills = params.skills || "";
  const serviceArea = params.serviceArea || "";

  const sortBy = params.sortBy === "experience" ? "experience" : "date";

  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <Badge variant="secondary" className="mb-3">
            Our Technicians
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find a trusted technician
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Search and filter technicians by skills, experience, availability,
            and service area.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <TechnicianSearchFilters
          defaultValues={{
            search,
            minExperience,
            isAvailable,
            skills,
            serviceArea,
            sortBy,
            sortOrder,
          }}
        />

        <div className="mt-8">
          <Suspense
            key={`${search}-${page}-${minExperience}-${isAvailable}-${skills}-${serviceArea}-${sortBy}-${sortOrder}`}
            fallback={<TechnicianSkeleton />}
          >
            <TechniciansContent
              search={search}
              page={page}
              limit={limit}
              minExperience={minExperience}
              isAvailable={isAvailable}
              skills={skills}
              serviceArea={serviceArea}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

async function TechniciansContent({
  search,
  page,
  limit,
  minExperience,
  isAvailable,
  skills,
  serviceArea,
  sortBy,
  sortOrder,
}: {
  search: string;
  page: number;
  limit: number;
  minExperience: string;
  isAvailable: string;
  skills: string;
  serviceArea: string;
  sortBy: "experience" | "date";
  sortOrder: "asc" | "desc";
}) {
  const result = await getAllTechnicians({
    search,
    page,
    limit,

    minExperience: minExperience ? Number(minExperience) : undefined,

    isAvailable: isAvailable || undefined,

    skills: skills || undefined,

    serviceArea: serviceArea || undefined,

    sortBy,
    sortOrder,
  });

  if (!result.success) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-6 text-center">
        <h2 className="text-xl font-semibold">Unable to load technicians</h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {result.message}
        </p>
      </div>
    );
  }

  const technicians: Technician[] = result.data ?? [];

  const totalTechnicians = result.meta?.totalRow ?? technicians.length;

  if (technicians.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 text-center">
        <h2 className="text-xl font-semibold">No technicians found</h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Try changing your search or filter options.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Result count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalTechnicians}{" "}
          {totalTechnicians === 1 ? "technician" : "technicians"} found
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {technicians.map((technician) => (
          <TechnicianWithUser key={technician.id} technician={technician} />
        ))}
      </div>

      {/* Pagination */}
      <TechnicianPagination
        currentPage={result.meta?.page || result.meta?.currentPage || 1}
        totalPages={result.meta?.totalPage || 1}
      />
    </>
  );
}

async function TechnicianWithUser({ technician }: { technician: Technician }) {
  const userResult = await getUserById(technician.userId);

  const user = userResult?.success ? userResult.data : null;

  const name = user?.name || "Professional Technician";

  const profileImage =
    user?.profileImage || user?.image || user?.profilePicture || null;

  return (
    <TechnicianCard
      id={technician.id}
      name={name}
      profileImage={profileImage}
      bio={technician.bio}
      skills={technician.skills}
      yearsOfExperience={technician.yearsOfExperience}
      serviceArea={technician.serviceArea}
      isAvailable={technician.isAvailable}
      status={technician.status}
    />
  );
}
