import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Clock3,
  MapPin,
  Star,
  UserRound,
} from "lucide-react";

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
  "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=2000&auto=format&fit=crop&q=85";

type ServiceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ServiceReview = {
  id: string;
  bookingId: string;
  description?: string;
  rating: number;
  createdAt: string;
  updatedAt?: string;
};

function isServiceReview(value: unknown): value is ServiceReview {
  if (!value || typeof value !== "object") {
    return false;
  }

  const review = value as Partial<ServiceReview>;

  return (
    typeof review.id === "string" &&
    typeof review.bookingId === "string" &&
    typeof review.rating === "number" &&
    typeof review.createdAt === "string"
  );
}

function getAverageRating(reviews: ServiceReview[]) {
  if (!reviews.length) {
    return 0;
  }

  return (
    reviews.reduce((total, review) => total + review.rating, 0) /
    reviews.length
  );
}

function formatDateTime(dateString?: string) {
  if (!dateString) {
    return "Unknown date";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function RatingStars({
  rating,
  size = "size-4",
}: {
  rating: number;
  size?: string;
}) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`${size} ${
            index < safeRating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/25"
          }`}
        />
      ))}
    </div>
  );
}

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
  const serviceData = result?.data?.result;
  const service: ServiceItem | null = serviceData?.service ?? null;

  if (!service) {
    notFound();
  }

  const reviews: ServiceReview[] = Array.isArray(serviceData?.review)
    ? serviceData.review.filter(isServiceReview)
    : [];

  const averageRating = getAverageRating(reviews);
  const imageSrc = service.thumbnailImage?.trim() || fallbackImage;

  return (
    <main className="min-h-screen overflow-x-hidden bg-muted/20">
      <section className="mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 xl:px-8 xl:py-8 2xl:max-w-[2200px] 2xl:px-10 2xl:py-9">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1 text-xs text-muted-foreground sm:mb-5 sm:text-sm"
        >
          <Link
            href="/services"
            className="transition-colors hover:text-foreground"
          >
            Services
          </Link>

          <ChevronRight className="size-3.5 shrink-0" />

          <span className="max-w-[240px] truncate text-foreground">
            {service.title}
          </span>
        </nav>

        {/* Main content */}
        <div
          className="
            grid
            items-start
            gap-5
            lg:gap-6
            xl:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.65fr)]
            xl:gap-8
            2xl:grid-cols-[minmax(0,1.45fr)_minmax(480px,0.55fr)]
            2xl:gap-10
          "
        >
          {/* Image section */}
          <div
            className="
              relative
              aspect-[4/3]
              overflow-hidden
              rounded-xl
              border
              bg-muted
              shadow-sm
              sm:rounded-2xl
              lg:aspect-[16/9]
              xl:aspect-[16/10]
              2xl:aspect-[16/9]
            "
          >
            <Image
              src={imageSrc}
              alt={service.title}
              fill
              priority
              quality={85}
              sizes="
                (max-width: 1279px) 100vw,
                (max-width: 1535px) 65vw,
                (max-width: 2559px) 68vw,
                70vw
              "
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-4 pt-16 sm:p-5 sm:pt-20">
              <Badge
                variant={service.isAvailable ? "default" : "secondary"}
                className="rounded-full border-0 px-3 py-1 text-xs shadow-sm sm:text-sm"
              >
                {service.isAvailable ? "Available now" : "Currently unavailable"}
              </Badge>

              {reviews.length > 0 && (
                <div className="flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs text-white backdrop-blur-sm sm:text-sm">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span>{averageRating.toFixed(1)}</span>
                  <span className="text-white/70">
                    ({reviews.length})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details section */}
          <div className="min-w-0 space-y-4 sm:space-y-5 xl:space-y-5">
            {/* Header */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
                Professional service
              </p>

              <h1 className="break-words text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl 2xl:text-5xl">
                {service.title}
              </h1>

              <p className="max-w-3xl break-words text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7 2xl:text-lg">
                {service.description}
              </p>
            </div>

            {/* Quick information */}
            <div
              className="
                grid
                grid-cols-1
                gap-2
                rounded-xl
                border
                bg-background
                p-3
                text-sm
                sm:grid-cols-3
                sm:p-4
                xl:grid-cols-1
                2xl:grid-cols-3
              "
            >
              <InfoItem
                icon={<MapPin className="size-4" />}
                label="Location"
                value="Not specified"
              />

              <InfoItem
                icon={
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                }
                label="Rating"
                value={
                  reviews.length > 0
                    ? `${averageRating.toFixed(1)} / 5`
                    : "No ratings"
                }
              />

              <InfoItem
                icon={<Clock3 className="size-4" />}
                label="Response"
                value="Quick response"
              />
            </div>

            {/* Technician card */}
            <Card className="overflow-hidden shadow-sm">
              <CardHeader className="space-y-1.5 p-4 sm:p-5">
                <CardTitle className="text-base sm:text-lg">
                  Technician profile
                </CardTitle>

                <CardDescription className="text-xs sm:text-sm">
                  View technician details before booking.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 px-4 pb-4 sm:px-5 sm:pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:size-12">
                    <UserRound className="size-5 text-primary sm:size-6" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold sm:text-base">
                      Professional Technician
                    </p>

                    <p className="truncate text-xs text-muted-foreground sm:text-sm">
                      Verified service provider
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="h-10 w-full text-sm"
                >
                  <Link href={`/technicians/${service.technicianId}`}>
                    View technician profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pricing card */}
            <Card className="overflow-hidden border-primary/20 shadow-sm">
              <CardHeader className="space-y-1.5 p-4 sm:p-5">
                <CardTitle className="text-base sm:text-lg">
                  Starting price
                </CardTitle>

                <CardDescription className="text-xs sm:text-sm">
                  Final price may vary depending on service requirements.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-4 px-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:pb-5">
                <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {service.price}

                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    {service.currency}
                  </span>
                </p>

                {service.isAvailable ? (
                  <Button
                    asChild
                    className="h-10 w-full sm:h-11 sm:w-auto sm:px-6"
                  >
                    <Link href={`/booking/${service.id}`}>Book now</Link>
                  </Button>
                ) : (
                  <Button disabled className="h-10 w-full sm:h-11 sm:w-auto">
                    Unavailable
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews */}
        <ServiceReviews reviews={reviews} />
      </section>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="shrink-0 text-muted-foreground">{icon}</span>

      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">
          {label}
        </p>

        <p className="truncate font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ServiceReviews({
  reviews,
}: {
  reviews: ServiceReview[];
}) {
  const averageRating = getAverageRating(reviews);

  return (
    <section className="mt-6 sm:mt-7 xl:mt-8 2xl:mt-10">
      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="border-b bg-background p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-xl">
                Customer reviews
              </CardTitle>

              <CardDescription className="mt-1 text-xs sm:text-sm">
                Feedback from customers who used this service.
              </CardDescription>
            </div>

            {reviews.length > 0 && (
              <div className="flex shrink-0 items-center gap-2">
                <RatingStars rating={averageRating} />

                <span className="text-sm font-semibold sm:text-base">
                  {averageRating.toFixed(1)}
                </span>

                <span className="text-xs text-muted-foreground sm:text-sm">
                  ({reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 lg:p-6">
          {reviews.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-10 text-center">
              <h3 className="text-sm font-semibold sm:text-base">
                No reviews yet
              </h3>

              <p className="mx-auto mt-1.5 max-w-lg text-xs leading-5 text-muted-foreground sm:text-sm">
                Customers have not submitted a review for this service yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 xl:grid-cols-2">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/20 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <RatingStars rating={review.rating} />

                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        {review.rating}/5
                      </p>
                    </div>

                    <time
                      dateTime={review.createdAt}
                      className="shrink-0 text-[11px] text-muted-foreground sm:text-xs"
                    >
                      {formatDateTime(review.createdAt)}
                    </time>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-foreground/90">
                    {review.description?.trim() || "No written feedback."}
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

function ServiceDetailSkeleton() {
  return (
    <main className="min-h-screen bg-muted/20">
      <section className="mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 xl:px-8 xl:py-8 2xl:max-w-[2200px] 2xl:px-10">
        <Skeleton className="mb-4 h-4 w-40" />

        <div className="grid gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.65fr)] xl:gap-8 2xl:grid-cols-[minmax(0,1.45fr)_minmax(480px,0.55fr)] 2xl:gap-10">
          <Skeleton className="aspect-[4/3] w-full rounded-xl sm:rounded-2xl lg:aspect-[16/9] xl:aspect-[16/10] 2xl:aspect-[16/9]" />

          <div className="space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full max-w-2xl" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-8/12" />
            </div>

            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>

        <Skeleton className="mt-8 h-72 w-full rounded-xl" />
      </section>
    </main>
  );
}