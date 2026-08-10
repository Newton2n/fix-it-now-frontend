import { Suspense } from "react";


import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { getAllCategories } from "@/actions/category.action";

import CategoryCard from "@/components/category/card";
import CategorySearch from "@/components/category/category-search";
import CategoryPagination from "@/components/category/category-pagination";

import type { Category } from "@/schema/category/category.schema";

type CategoriesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
};



export default function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="w-full px-4 py-10 md:px-6">
          <div className="max-w-4xl">
            <Badge variant="secondary" className="mb-3">
              Service Categories
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Browse services by category
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              Explore different home service categories and connect
              with trusted professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="w-full px-4 py-8 md:px-6">
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesContent searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}

async function CategoriesContent({
  searchParams,
}: {
  searchParams: CategoriesPageProps["searchParams"];
}) {
  const params = await searchParams;

  const search = params.search || "";

  const page = Math.max(
    1,
    Number(params.page) || 1
  );

  const limit = Math.max(
    1,
    Number(params.limit) || 9
  );

  const sortBy =
    params.sortBy === "name"
      ? "name"
      : "createdAt";

  const sortOrder =
    params.sortOrder === "asc"
      ? "asc"
      : "desc";

  const result = await getAllCategories({
    search,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  if (!result.success) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-6 text-center">
        <h2 className="text-xl font-semibold">
          Unable to load categories
        </h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {result.message}
        </p>
      </div>
    );
  }

  const categories: Category[] = result.data ?? [];

  const meta = result.meta;

  const totalCategories =
    meta?.totalRow ?? categories.length;

  const currentPage =
    meta?.currentPage ?? page;

  const totalPage =
    meta?.totalPage ?? 1;

  return (
    <>
      {/* Search + filters */}
      <CategorySearch
        defaultSearch={search}
        defaultSortBy={sortBy}
        defaultSortOrder={sortOrder}
      />

      {/* Results info */}
      <div className="my-6">
        <p className="text-sm text-muted-foreground">
          {totalCategories}{" "}
          {totalCategories === 1
            ? "category"
            : "categories"}{" "}
          found
        </p>
      </div>

      {/* Empty state */}
      {categories.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 text-center">
          <h2 className="text-xl font-semibold">
            No categories found
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Try another search term or clear your filters.
          </p>
        </div>
      ) : (
        <>
          {/* Category cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {categories.map((category, index) => {
              
              return (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  description={category.description}
                />
              );
            })}
          </div>

          {/* Pagination */}
          <CategoryPagination
            currentPage={currentPage}
            totalPage={totalPage}
          />
        </>
      )}
    </>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search skeleton */}
      <div className="rounded-2xl border bg-card p-4">
        <Skeleton className="h-11 w-full" />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-10 w-full sm:w-48" />
          <Skeleton className="h-10 w-full sm:w-48" />
        </div>
      </div>

      {/* Result count */}
      <Skeleton className="h-5 w-32" />

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-card p-6"
          >
            <div className="space-y-4">
              <Skeleton className="h-12 w-12 rounded-xl" />

              <Skeleton className="h-5 w-2/3" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}