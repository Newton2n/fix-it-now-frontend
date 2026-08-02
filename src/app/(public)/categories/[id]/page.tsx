import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
    <Suspense fallback={<CategoryDetailSkeleton />}>
      <CategoryDetailContent params={params} />
    </Suspense>
  );
}

async function CategoryDetailContent({
  params,
}: CategoryDetailPageProps) {
  const { id } = await params;

  const [categoryResult, serviceResult] = await Promise.all([
    getCategoryDetails(id),
    getAllServiceByCategoryId(id),
  ]);

  const category = categoryResult?.data?.result ?? null;
  const services = serviceResult?.data?.result?.data ?? [];

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <Button asChild variant="ghost" className="mb-4 px-0">
            <Link href="/categories">← Back to categories</Link>
          </Button>

          <Badge variant="secondary" className="mb-3">
            Category Detail
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {category.name}
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            {category.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Category Info</CardTitle>
              <CardDescription>
                Basic information about this category
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Category ID</p>
                <p className="break-all font-mono text-xs">{category.id}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{category.name}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Description</p>
                <p>{category.description}</p>
              </div>

              <Button asChild className="w-full">
                <Link href="/categories">Back to Categories</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Services */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Services in this category</h2>
              <p className="text-sm text-muted-foreground">
                Browse all services under {category.name}.
              </p>
            </div>

            {services.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {services.map((service: any) => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.title}
                    image={service.thumbnailImage}
                    location={service.location ?? "Location not specified"}
                    rating={service.rating ?? 5}
                    price={service.price}
                    technician={
                      service.technician?.name ?? "Professional Technician"
                    }
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No services found in this category.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function CategoryDetailSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 space-y-4">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <Skeleton className="h-87.5 w-full rounded-xl" />
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <Skeleton className="h-75 w-full rounded-xl" />
              <Skeleton className="h-75 w-full rounded-xl" />
              <Skeleton className="h-75 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}