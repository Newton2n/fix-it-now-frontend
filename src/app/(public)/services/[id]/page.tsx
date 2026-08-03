import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Clock,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { getSingleService } from "@/actions/service.action";
import { ServiceItem } from "@/schema/service/service.schema";

const fallbackImage =
  "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=800&auto=format&fit=crop&q=80";

type ServiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  return (
    <Suspense fallback={<ServiceDetailSkeleton />}>
      <ServiceDetailContent params={params} />
    </Suspense>
  );
}

async function ServiceDetailContent({
  params,
}: ServiceDetailPageProps) {
  const { id } = await params;

  const result = await getSingleService(id);

  const service: ServiceItem | null =
    result?.data?.result ?? null;

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-background">
      <section className="mx-auto w-full max-w-7xl min-w-0 px-4 py-6 sm:py-8 md:px-6 md:py-10">
        <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Image */}
          <div className="relative h-64 w-full min-w-0 overflow-hidden rounded-2xl border bg-muted sm:h-80 md:h-120">
            <Image
              src={service.thumbnailImage || fallbackImage}
              alt={service.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="min-w-0 w-full space-y-5 sm:space-y-6">
            {/* Header */}
            <div className="min-w-0 space-y-3">
              <Badge
                variant="secondary"
                className="max-w-full"
              >
                {service.isAvailable
                  ? "Available"
                  : "Currently Unavailable"}
              </Badge>

              <h1 className="min-w-0 break-words text-3xl font-bold tracking-tight capitalize sm:text-4xl">
                {service.title}
              </h1>

              <p className="min-w-0 break-words leading-7 text-muted-foreground">
                {service.description}
              </p>
            </div>

            {/* Quick Info */}
            <div className="flex min-w-0 flex-wrap gap-3 text-sm text-muted-foreground sm:gap-4">
              <div className="flex min-w-0 items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="break-words">
                  Location not specified
                </span>
              </div>

              <div className="flex min-w-0 items-center gap-2">
                <Star className="h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400" />
                <span>5.0 Rating</span>
              </div>

              <div className="flex min-w-0 items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span>Quick Response</span>
              </div>
            </div>

            {/* Technician */}
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle className="break-words">
                  Technician Profile
                </CardTitle>

                <CardDescription className="break-words">
                  View technician details before booking
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
                    <UserRound className="size-6 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="break-words font-medium">
                      Professional Technician
                    </p>

                    <p className="break-words text-sm text-muted-foreground">
                      Verified service provider
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full"
                  variant="outline"
                >
                  <Link
                    href={`/technician-profile/${service.technicianId}`}
                  >
                    View Technician Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>

                <CardDescription>
                  Starting service price
                </CardDescription>
              </CardHeader>

              <CardContent className="flex min-w-0 flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-2xl font-bold sm:text-3xl">
                    {service.price}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      {service.currency}
                    </span>
                  </p>
                </div>

                <Button
                  disabled={!service.isAvailable}
                  asChild={service.isAvailable}
                >
                  {service.isAvailable ? (
                    <Link href={`/booking/${service.id}`}>
                      Book Now
                    </Link>
                  ) : (
                    "Unavailable"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

function ServiceDetailSkeleton() {
  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-background">
      <section className="mx-auto w-full max-w-7xl min-w-0 px-4 py-6 sm:py-8 md:px-6 md:py-10">
        <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Image Skeleton */}
          <Skeleton className="h-64 w-full min-w-0 rounded-2xl sm:h-80 md:h-120" />

          {/* Content Skeleton */}
          <div className="min-w-0 w-full space-y-5 sm:space-y-6">
            {/* Header */}
            <div className="min-w-0 space-y-3">
              <Skeleton className="h-6 w-24 max-w-full rounded-full" />

              <Skeleton className="h-9 w-full max-w-xl sm:h-10" />

              <Skeleton className="h-16 w-full max-w-2xl sm:h-20" />
            </div>

            {/* Quick Info */}
            <div className="flex min-w-0 flex-wrap gap-3 sm:gap-4">
              <Skeleton className="h-5 w-28 shrink-0 sm:w-32" />
              <Skeleton className="h-5 w-20 shrink-0 sm:w-24" />
              <Skeleton className="h-5 w-24 shrink-0 sm:w-28" />
            </div>

            {/* Technician Skeleton */}
            <div className="min-w-0 w-full rounded-xl border bg-card p-4 shadow-sm sm:p-5">
              <div className="space-y-4">
                <Skeleton className="h-6 w-40 max-w-full" />

                <Skeleton className="h-4 w-56 max-w-full" />

                <div className="flex min-w-0 items-center gap-4">
                  <Skeleton className="size-12 shrink-0 rounded-full" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-40 max-w-full" />
                    <Skeleton className="h-4 w-48 max-w-full" />
                  </div>
                </div>

                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Pricing Skeleton */}
            <div className="min-w-0 w-full rounded-xl border bg-card p-4 shadow-sm sm:p-5">
              <div className="space-y-4">
                <Skeleton className="h-6 w-24 max-w-full" />

                <Skeleton className="h-4 w-40 max-w-full" />

                <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                  <Skeleton className="h-9 w-24 shrink-0 sm:w-28" />

                  <Skeleton className="h-10 w-full max-w-32 sm:w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}