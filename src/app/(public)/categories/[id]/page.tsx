import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { Service } from "@/types/service";

import ServiceCard from "@/components/service/service-card";

import { getCategoryDetails } from "@/actions/category.action";
import { getAllServiceByCategoryId } from "@/actions/service.action";

type CategoryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<CategoryDetailSkeleton />}>
        <CategoryDetailContent params={params} />
      </Suspense>
    </main>
  );
}

async function CategoryDetailContent({ params }: CategoryDetailPageProps) {
  const { id } = await params;

  const [categoryResult, serviceResult] = await Promise.all([
    getCategoryDetails(id),
    getAllServiceByCategoryId(id),
  ]);

  const category = categoryResult?.data?.result?.data ?? null;
  const services = serviceResult?.data?.result?.data ?? [];

  if (!category) {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="w-full px-4 py-10 md:px-6">
          <div className="max-w-4xl">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Category
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {category.name}
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              {category.description ||
                "Browse professional services available in this category."}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-4 py-8 md:px-6">
        <div className="grid w-full min-w-0 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Category Info */}
          <aside className="w-full min-w-0">
            <Card className="h-fit w-full shadow-sm">
              <CardHeader className="space-y-1.5 p-4 sm:p-6">
                <CardTitle className="text-lg font-semibold tracking-tight sm:text-xl">
                  Category Info
                </CardTitle>

                <CardDescription className="text-xs sm:text-sm">
                  Basic information about this category
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 p-4 pt-0 text-sm sm:p-6 sm:pt-0">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Category ID
                  </p>

                  <p className="break-all rounded-md bg-muted/50 p-2 font-mono text-xs text-foreground/80">
                    {category.id}
                  </p>
                </div>

                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Name
                  </p>

                  <p className="font-medium capitalize text-foreground">
                    {category.name}
                  </p>
                </div>

                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Description
                  </p>

                  <p className="break-words leading-relaxed text-muted-foreground">
                    {category.description || "No description provided."}
                  </p>
                </div>

                <Button asChild variant="outline" className="mt-2 w-full">
                  <Link href="/categories">Back to Categories</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Services */}
          <div className="w-full min-w-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">
                  Services in {category.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Browse professional services available in this category.
                </p>
              </div>
            </div>

            {services.length > 0 ? (
              <div className="mt-6 grid w-full min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {services.map(
                  (
                    service: Service & {
                      location?: string | null;
                      rating?: number | null;
                      technician?: {
                        name?: string | null;
                      } | null;
                    },
                  ) => (
                    <div key={service.id} className="min-w-0 h-full">
                      <ServiceCard
                        id={service.id}
                        title={service.title}
                        image={
                          service.thumbnailImage ||
                          "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        location={service.location ?? "Location not specified"}
                        price={service.price}
                        technician={
                          service.technician?.name ?? "Professional Technician"
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            ) : (
              <Card className="mt-6 w-full border-dashed bg-muted/20">
                <CardContent className="px-4 py-16 text-center">
                  <h3 className="text-lg font-semibold">No services found</h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    There are currently no services available in this category.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryDetailSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <section className="border-b bg-muted/30">
        <div className="w-full px-4 py-10 md:px-6">
          <div className="max-w-4xl space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-72 max-w-full sm:h-11" />
            <Skeleton className="h-5 w-full max-w-2xl" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="w-full px-4 py-8 md:px-6">
        <div className="grid w-full min-w-0 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}
          <div className="w-full min-w-0">
            <Skeleton className="h-[380px] w-full rounded-xl" />
          </div>

          {/* Services */}
          <div className="w-full min-w-0">
            <div className="space-y-2">
              <Skeleton className="h-7 w-72 max-w-full" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>

            <div className="mt-6 grid w-full min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-80 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
