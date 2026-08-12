import { Suspense } from "react";
import { getAllReviewDetailsFromLoginUser } from "@/actions/review.action";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Skeleton } from "@/components/ui/skeleton";

import type { Review } from "@/types/review";
import ReviewFilters from "@/components/dashboard/filters/customer/review-filter";
import CustomerReviewsClient from "@/components/dashboard/filters/customer/customer-reviews-client";
import { UserReviewSearchParams } from "@/schema/review/review.schema";

type ReviewResult = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: Review[];
};

export default async function CustomerReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  // Serialized key forces Suspense to display the skeleton loader when query params change
  const filterKey = JSON.stringify(resolvedParams);

  return (
    <Suspense key={filterKey} fallback={<ReviewsLoading />}>
      <CustomerReviewsContent resolvedParams={resolvedParams} />
    </Suspense>
  );
}

async function CustomerReviewsContent({
  resolvedParams,
}: {
  resolvedParams: Record<string, string | string[] | undefined>;
}) {
  const rawMinRating =
    typeof resolvedParams.minRating === "string" ? Number(resolvedParams.minRating) : undefined;

  const rawMaxRating =
    typeof resolvedParams.maxRating === "string" ? Number(resolvedParams.maxRating) : undefined;

  // Validate & clamp rating between 1–5
  let minRating: number | undefined;
  let maxRating: number | undefined;

  if (rawMinRating !== undefined && !Number.isNaN(rawMinRating)) {
    minRating = Math.min(5, Math.max(1, rawMinRating));
  }

  if (rawMaxRating !== undefined && !Number.isNaN(rawMaxRating)) {
    maxRating = Math.min(5, Math.max(1, rawMaxRating));
  }

  const query: UserReviewSearchParams = {
    serviceId:
      typeof resolvedParams.serviceId === "string" ? resolvedParams.serviceId : undefined,
    minRating,
    maxRating,
    search: typeof resolvedParams.search === "string" ? resolvedParams.search : undefined,
    page: typeof resolvedParams.page === "string" ? Number(resolvedParams.page) : 1,
    limit: typeof resolvedParams.limit === "string" ? Number(resolvedParams.limit) : 10,
    sortBy:
      (resolvedParams.sortBy as "rating" | "createdAt" | undefined) || "createdAt",
    sortOrder: (resolvedParams.sortOrder as "asc" | "desc" | undefined) || "desc",
  };

  const result = await getAllReviewDetailsFromLoginUser(query);

  if (!result.success) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Reviews"
          description="Leave feedback after your service is completed."
        />

        <SectionCard
          title="Your Reviews"
          description="Unable to load your reviews."
        >
          <div className="rounded-xl border border-dashed py-16 text-center">
            <h3 className="text-lg font-semibold">Unable to load reviews</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.message}
            </p>
          </div>
        </SectionCard>
      </div>
    );
  }

  const reviewResult: ReviewResult = {
    meta: result.meta,
    data: result.data as Review[],
  };

  const reviews = reviewResult.data;
  const meta = reviewResult.meta;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Reviews"
        description="Leave feedback after your service is completed."
      />

      <ReviewFilters
        currentPage={meta.currentPage}
        totalPage={meta.totalPage}
      />

      <SectionCard
        title="Your Reviews"
        description={
          meta.totalRow
            ? `Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total ${
                meta.totalRow === 1 ? "review" : "reviews"
              }`
            : "You haven't submitted any reviews yet."
        }
      >
        <CustomerReviewsClient initialReviews={reviews} initialMeta={meta} />
      </SectionCard>
    </div>
  );
}

function ReviewsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Main Section Card & Review Cards Skeleton */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border bg-card p-5 shadow-sm space-y-4"
            >
              {/* Card Header: Service Info & Star Rating */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Skeleton key={starIndex} className="h-4 w-4 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Review Text Body */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {/* Bottom Footer Row: Date & Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t">
                <Skeleton className="h-3 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}