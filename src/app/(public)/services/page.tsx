import { Suspense } from "react";

import ServiceCard from "@/components/service/service-card";
import ServiceSearchFilters from "@/components/service/service-search-filters";
import ServicePagination from "@/components/service/service-pagination";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { getAllService } from "@/actions/service.action";
import { getAllCategories } from "@/actions/category.action";
import { Service } from "@/types/service";

type ServicesPageProps = {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    isAvailable?: string;
    sortBy?: "price" | "date";
    sortOrder?: "asc" | "desc";
    page?: string;
  }>;
};

export default async function ServicesPage({
  searchParams,
}: ServicesPageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const categoryId = params.categoryId || "";
  const minPrice = params.minPrice
    ? Number(params.minPrice)
    : undefined;
  const maxPrice = params.maxPrice
    ? Number(params.maxPrice)
    : undefined;

  const isAvailable = params.isAvailable || "";
  const sortBy = params.sortBy || "date";
  const sortOrder = params.sortOrder || "desc";
  const page = Number(params.page) || 1;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <Badge variant="secondary" className="mb-3">
            Browse Services
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find the right service for your home
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Search, filter, and compare trusted technicians before you book.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Suspense
          key={[
            search,
            categoryId,
            minPrice,
            maxPrice,
            isAvailable,
            sortBy,
            sortOrder,
            page,
          ].join("-")}
          fallback={<ServicesContentSkeleton />}
        >
          <ServicesContent
            search={search}
            categoryId={categoryId}
            minPrice={minPrice}
            maxPrice={maxPrice}
            isAvailable={isAvailable}
            sortBy={sortBy}
            sortOrder={sortOrder}
            page={page}
          />
        </Suspense>
      </section>
    </main>
  );
}

type ServicesContentProps = {
  search: string;
  categoryId: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable: string;
  sortBy: "price" | "date";
  sortOrder: "asc" | "desc";
  page: number;
};

async function ServicesContent({
  search,
  categoryId,
  minPrice,
  maxPrice,
  isAvailable,
  sortBy,
  sortOrder,
  page,
}: ServicesContentProps) {
  const [servicesResult, categoriesResult] = await Promise.all([
    getAllService({
      search,
      categoryId: categoryId || undefined,
      minPrice,
      maxPrice,
      isAvailable: isAvailable || undefined,
      sortBy,
      sortOrder,
      page,
      limit: 12,
    }),

    getAllCategories({
      page: 1,
      limit: 100,
      sortBy: "name",
      sortOrder: "asc",
    }),
  ]);

  const services =
    servicesResult?.data?.result?.data || [];

  const meta =
    servicesResult?.data?.result?.meta;

  const categories =
    categoriesResult?.data || [];

  return (
    <>
      {/* Search + filters */}
      <ServiceSearchFilters
        categories={categories}
        defaultValues={{
          search,
          categoryId,
          minPrice: minPrice?.toString() || "",
          maxPrice: maxPrice?.toString() || "",
          isAvailable,
          sortBy,
          sortOrder,
        }}
      />

      {/* Result count */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Available Services
          </h2>

          <p className="text-sm text-muted-foreground">
            {meta?.totalRow || 0} service
            {(meta?.totalRow || 0) !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Services */}
      {services.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service :Service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              image={
                service.thumbnailImage ||
                "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              location="Location not specified"
              rating={5}
              price={service.price}
              technician="Professional Technician"
            />
          ))}
        </div>
      ) : (
        <EmptyServices />
      )}

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <ServicePagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPage}
        />
      )}
    </>
  );
}

function ServicesContentSkeleton() {
  return (
    <>
      <div className="space-y-4 rounded-2xl border bg-card p-4">
        <Skeleton className="h-10 w-full" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-80 w-full rounded-xl"
          />
        ))}
      </div>
    </>
  );
}

function EmptyServices() {
  return (
    <div className="mt-8 rounded-xl border border-dashed bg-muted/20 px-6 py-16 text-center">
      <h3 className="text-lg font-semibold">
        No services found
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Try changing your search or filters.
      </p>
    </div>
  );
}