import { Suspense } from "react";
import Image from "next/image";
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

async function CategoryDetailContent({
  params,
}: CategoryDetailPageProps) {
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
        <div className="mx-auto w-full max-w-[1800px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14 2xl:px-12 2xl:py-16">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_480px] 2xl:grid-cols-[minmax(0,1fr)_560px] 2xl:gap-16">
            {/* Hero Content */}
            <div className="min-w-0 max-w-4xl">
              <p className="mb-3 text-sm font-medium text-muted-foreground sm:text-base 2xl:text-lg">
                Category
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
                {category.name}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9 2xl:text-2xl 2xl:leading-10">
                {category.description ||
                  "Browse professional services available in this category."}
              </p>
            </div>

            {/* Category Image */}
            <div className="relative w-full overflow-hidden rounded-2xl border bg-muted shadow-sm">
              <div className="relative aspect-[16/10] w-full">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={`${category.name} category`}
                    fill
                    priority
                    sizes="
                      (max-width: 1024px) 100vw,
                      (max-width: 1280px) 420px,
                      (max-width: 1536px) 480px,
                      560px
                    "
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm text-muted-foreground sm:text-base">
                      No image available
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full">
        <div className="mx-auto grid w-full max-w-[1800px] min-w-0 gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:py-12 xl:grid-cols-[340px_minmax(0,1fr)] xl:gap-12 2xl:grid-cols-[380px_minmax(0,1fr)] 2xl:gap-16 2xl:px-12 2xl:py-16">
          {/* Category Info */}
          <aside className="w-full min-w-0">
            <Card className="h-fit w-full rounded-2xl shadow-sm">
              <CardHeader className="space-y-2 p-5 sm:p-6 lg:p-7 2xl:p-8">
                <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl 2xl:text-3xl">
                  Category Info
                </CardTitle>

                <CardDescription className="text-sm leading-6 text-foreground/60 sm:text-base sm:leading-7 2xl:text-lg">
                  Basic information about this category
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 p-5 pt-0 sm:p-6 sm:pt-0 lg:p-7 lg:pt-0 2xl:p-8 2xl:pt-0">
                {/* Category ID */}
                <div className="min-w-0 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
                    Category ID
                  </p>

                  <p className="break-all rounded-lg bg-muted/50 p-3 font-mono text-xs text-foreground/80 sm:text-sm">
                    {category.id}
                  </p>
                </div>

                {/* Name */}
                <div className="min-w-0 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
                    Name
                  </p>

                  <p className="text-base font-semibold capitalize text-foreground sm:text-lg 2xl:text-xl">
                    {category.name}
                  </p>
                </div>

                {/* Description */}
                <div className="min-w-0 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
                    Description
                  </p>

                  <p className="break-words text-sm leading-6 text-foreground/70 sm:text-base sm:leading-7 2xl:text-lg 2xl:leading-8">
                    {category.description || "No description provided."}
                  </p>
                </div>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="mt-2 w-full"
                >
                  <Link href="/categories">Back to Categories</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Services */}
          <div className="w-full min-w-0">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-3xl 2xl:text-4xl">
                Services in {category.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-foreground/65 sm:text-base sm:leading-7 lg:text-lg lg:leading-8 2xl:text-xl">
                Browse professional services available in this category.
              </p>
            </div>

            {services.length > 0 ? (
              <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
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
                    <div
                      key={service.id}
                      className="h-full min-w-0"
                    >
                      <ServiceCard
                        id={service.id}
                        title={service.title}
                        image={
                          service.thumbnailImage ||
                          "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=1170&auto=format&fit=crop"
                        }
                        location={
                          service.location ?? "Location not specified"
                        }
                        price={service.price}
                        technician={
                          service.technician?.name ??
                          "Professional Technician"
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            ) : (
              <Card className="mt-6 w-full rounded-2xl border-dashed bg-muted/20">
                <CardContent className="px-4 py-16 text-center sm:py-20">
                  <h3 className="text-lg font-semibold sm:text-xl">
                    No services found
                  </h3>

                  <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-foreground/65 sm:text-base sm:leading-7">
                    There are currently no services available in this
                    category.
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
        <div className="mx-auto w-full max-w-[1800px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14 2xl:px-12 2xl:py-16">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_480px] 2xl:grid-cols-[minmax(0,1fr)_560px] 2xl:gap-16">
            {/* Hero Content */}
            <div className="max-w-4xl space-y-4">
              <Skeleton className="h-5 w-24 sm:h-6 sm:w-28" />

              <Skeleton className="h-10 w-72 max-w-full sm:h-12 sm:w-96 lg:h-14 xl:h-16 2xl:h-20 2xl:w-[500px]" />

              <Skeleton className="h-5 w-full max-w-2xl sm:h-6" />

              <Skeleton className="h-5 w-4/5 max-w-xl sm:h-6" />
            </div>

            {/* Hero Image */}
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="w-full">
        <div className="mx-auto grid w-full max-w-[1800px] min-w-0 gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:py-12 xl:grid-cols-[340px_minmax(0,1fr)] xl:gap-12 2xl:grid-cols-[380px_minmax(0,1fr)] 2xl:gap-16 2xl:px-12 2xl:py-16">
          {/* Sidebar */}
          <div className="w-full min-w-0">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>

          {/* Services */}
          <div className="w-full min-w-0">
            <div className="space-y-3">
              <Skeleton className="h-8 w-72 max-w-full sm:h-9 lg:h-10" />
              <Skeleton className="h-5 w-96 max-w-full sm:h-6" />
            </div>

            <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-80 w-full rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}