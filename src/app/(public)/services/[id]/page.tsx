import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Star, UserRound } from "lucide-react";

import { getSingleService } from "@/actions/service.action";
import type { ServiceItem } from "@/schema/service/service.schema";

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

const fallbackImage =
  "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=800&auto=format&fit=crop&q=80";

type ServiceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ServiceReview = {
  id: string;
  bookingId: string;
  description: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  return (
    <Suspense fallback={<ServiceDetailSkeleton />}>
      <ServiceDetailContent params={params} />
    </Suspense>
  );
}

async function ServiceDetailContent({ params }: ServiceDetailPageProps) {
  const { id } = await params;

  const result = await getSingleService(id);

  const serviceData = result?.data?.result;

  const service: ServiceItem | null = serviceData?.service ?? null;

  const rawReviews = Array.isArray(serviceData?.review)
    ? serviceData.review
    : [];

  const reviews: ServiceReview[] = rawReviews.filter(
    (review): review is ServiceReview =>
      review !== null &&
      typeof review === "object" &&
      typeof review.id === "string" &&
      typeof review.bookingId === "string" &&
      typeof review.rating === "number" &&
      typeof review.createdAt === "string",
  );

  if (!service) {
    notFound();
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-background">
      <section className="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto grid w-full min-w-0 max-w-[1800px] gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8">
          {/* Service Image */}
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

          {/* Service Content */}
          <div className="w-full min-w-0 space-y-5 sm:space-y-6">
            {/* Header */}
            <div className="min-w-0 space-y-3">
              <Badge variant="secondary" className="max-w-full">
                {service.isAvailable ? "Available" : "Currently Unavailable"}
              </Badge>

              <h1 className="min-w-0 break-words text-3xl font-bold tracking-tight capitalize sm:text-4xl">
                {service.title}
              </h1>

              <p className="min-w-0 break-words leading-7 text-muted-foreground">
                {service.description}
              </p>
            </div>

            {/* Quick Information */}
            <div className="flex min-w-0 flex-wrap gap-3 text-sm text-muted-foreground sm:gap-4">
              <div className="flex min-w-0 items-center gap-2">
                <MapPin className="size-4 shrink-0" />

                <span className="break-words">Location not specified</span>
              </div>

              <div className="flex min-w-0 items-center gap-2">
                <Star className="size-4 shrink-0 fill-yellow-400 text-yellow-400" />

                <span>
                  {reviews.length > 0
                    ? `${averageRating.toFixed(1)} Rating`
                    : "No ratings yet"}
                </span>
              </div>

              <div className="flex min-w-0 items-center gap-2">
                <Clock className="size-4 shrink-0" />

                <span>Quick Response</span>
              </div>
            </div>

            {/* Technician Profile */}
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

                <Button asChild className="w-full" variant="outline">
                  <Link href={`/technicians/${service.technicianId}`}>
                    View Technician Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>

                <CardDescription>Starting service price</CardDescription>
              </CardHeader>

              <CardContent className="flex min-w-0 flex-wrap items-center justify-between gap-4">
                <p className="text-2xl font-bold sm:text-3xl">
                  {service.price}

                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    {service.currency}
                  </span>
                </p>

                {service.isAvailable ? (
                  <Button asChild>
                    <Link href={`/booking/${service.id}`}>Book Now</Link>
                  </Button>
                ) : (
                  <Button disabled>Unavailable</Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <ServiceReviews reviews={reviews} />
      </section>
    </main>
  );
}

// Reviews

function ServiceReviews({ reviews }: { reviews: ServiceReview[] }) {
  const validReviews = reviews.filter(
    (review) => review !== null && typeof review.rating === "number",
  );

  const averageRating =
    validReviews.length > 0
      ? validReviews.reduce((total, review) => total + review.rating, 0) /
        validReviews.length
      : 0;

  return (
    <section className="mt-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Customer Reviews</CardTitle>

              <CardDescription>
                Feedback from customers who used this service.
              </CardDescription>
            </div>

            {validReviews.length > 0 && (
              <div className="flex items-center gap-2">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />

                <span className="text-lg font-semibold">
                  {averageRating.toFixed(1)}
                </span>

                <span className="text-sm text-muted-foreground">
                  ({validReviews.length}{" "}
                  {validReviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {validReviews.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/20 px-4 py-12 text-center">
              <h3 className="text-lg font-semibold">No reviews yet</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Customers have not submitted a review for this service yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {validReviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-xl border bg-background p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={
                            index < review.rating
                              ? "size-4 fill-yellow-400 text-yellow-400"
                              : "size-4 text-muted-foreground/30"
                          }
                        />
                      ))}

                      <span className="ml-2 text-sm font-medium">
                        {review.rating}/5
                      </span>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(review.createdAt)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6">
                    {review.description || "No written feedback."}
                  </p>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

// Skeleton

function ServiceDetailSkeleton() {
  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-background">
      <section className="w-full px-4 py-6 sm:py-8 md:px-6 md:py-10">
        <div className="mx-auto w-full max-w-[1800px] min-w-0">
          <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2 lg:gap-8">
            <Skeleton className="h-64 w-full min-w-0 rounded-2xl sm:h-80 md:h-120" />

            <div className="w-full min-w-0 space-y-5 sm:space-y-6">
              <div className="min-w-0 space-y-3">
                <Skeleton className="h-6 w-24 max-w-full rounded-full" />

                <Skeleton className="h-9 w-full max-w-xl sm:h-10" />

                <Skeleton className="h-16 w-full max-w-2xl sm:h-20" />
              </div>

              <div className="flex min-w-0 flex-wrap gap-3 sm:gap-4">
                <Skeleton className="h-5 w-28 shrink-0 sm:w-32" />
                <Skeleton className="h-5 w-20 shrink-0 sm:w-24" />
                <Skeleton className="h-5 w-24 shrink-0 sm:w-28" />
              </div>

              <div className="w-full min-w-0 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
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

              <div className="w-full min-w-0 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
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
        </div>

        {/* Reviews Skeleton */}
        <div className="mt-8 rounded-xl border bg-card p-6">
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-72 max-w-full" />
              </div>

              <Skeleton className="h-6 w-32" />
            </div>

            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="rounded-xl border p-4">
                  <div className="flex justify-between gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                  </div>

                  <Skeleton className="mt-4 h-12 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Date formatter

function formatDateTime(dateString?: string) {
  if (!dateString) {
    return "Unknown date";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}