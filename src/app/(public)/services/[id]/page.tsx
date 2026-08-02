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
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative h-80 overflow-hidden rounded-2xl border bg-muted md:h-120">
            <Image
              src={service.thumbnailImage || fallbackImage}
              alt={service.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <Badge variant="secondary">
                {service.isAvailable
                  ? "Available"
                  : "Currently Unavailable"}
              </Badge>

              <h1 className="text-3xl font-bold tracking-tight capitalize sm:text-4xl">
                {service.title}
              </h1>

              <p className="leading-7 text-muted-foreground">
                {service.description}
              </p>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Location not specified</span>
              </div>

              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>5.0 Rating</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Quick Response</span>
              </div>
            </div>

            {/* Technician */}
            <Card>
              <CardHeader>
                <CardTitle>Technician Profile</CardTitle>
                <CardDescription>
                  View technician details before booking
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <UserRound className="size-6 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="font-medium">
                      Professional Technician
                    </p>

                    <p className="text-sm text-muted-foreground">
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
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>
                  Starting service price
                </CardDescription>
              </CardHeader>

              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-3xl font-bold">
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
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-2xl md:h-120" />
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </section>
    </main>
  );
}