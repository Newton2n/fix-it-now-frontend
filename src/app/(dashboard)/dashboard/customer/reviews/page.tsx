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

export default function CustomerReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<ReviewsLoading />}>
      <CustomerReviewsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function CustomerReviewsContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const rawMinRating =
    typeof params.minRating === "string" ? Number(params.minRating) : undefined;

  const rawMaxRating =
    typeof params.maxRating === "string" ? Number(params.maxRating) : undefined;

  // Validate & clamp rating between 1–5
  let minRating: number | undefined;
  let maxRating: number | undefined;

  if (rawMinRating !== undefined && !Number.isNaN(rawMinRating)) {
    minRating = Math.min(5, Math.max(1, rawMinRating));
  }

  if (rawMaxRating !== undefined && !Number.isNaN(rawMaxRating)) {
    maxRating = Math.min(5, Math.max(1, rawMaxRating));
  }

  const query: UserReviewSearchParams= {
    serviceId:
      typeof params.serviceId === "string" ? params.serviceId : undefined,
    minRating,
    maxRating,
    search: typeof params.search === "string" ? params.search : undefined,
    page: typeof params.page === "string" ? Number(params.page) : 1,
    limit: typeof params.limit === "string" ? Number(params.limit) : 10,
    sortBy:
      (params.sortBy as "rating" | "createdAt" | undefined) || "createdAt",
    sortOrder: (params.sortOrder as "asc" | "desc" | undefined) || "desc",
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
      <DashboardPageHeader
        title="Reviews"
        description="Leave feedback after your service is completed."
      />

      <SectionCard title="Your Reviews" description="Loading your reviews...">
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
