import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Star } from "lucide-react";
import { getAllReviewDetailsFromLoginUser } from "@/actions/review.action";
import { Review } from "@/types/review";

export default async function CustomerReviewsPage() {
  const res = await getAllReviewDetailsFromLoginUser();
  const reviews = res.data;
  const meta = res.meta;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Reviews"
        description="Leave feedback after your service is completed."
      />

      <SectionCard
        title="Your Reviews"
        description={`Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total reviews`}
      >
        <div className="space-y-4">
          {reviews?.length > 0 ? (
            reviews.map((review: Review) => (
              <div
                key={review.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Review ID</p>
                      <p className="font-medium break-all text-foreground">{review.id}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={
                            index < review.rating
                              ? "h-4 w-4 fill-yellow-400 text-yellow-400"
                              : "h-4 w-4 text-muted-foreground/30"
                          }
                        />
                      ))}
                      <span className="ml-1 text-sm font-medium text-muted-foreground">
                        {review.rating}.0
                      </span>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <Info label="Booking ID" value={review.bookingId} />
                      <Info label="Created At" value={formatDateTime(review.createdAt)} />
                      <Info label="Updated At" value={formatDateTime(review.updatedAt)} />
                    </div>

                    <div className="rounded-lg border bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="mt-1 text-sm font-medium leading-6 text-foreground">
                        {review.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-start gap-2">
                    <Badge variant="secondary" className="rounded-full px-3">
                      {review.rating} Star
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="outline" size="icon" className="h-9 w-9">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open actions</span>
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
              <h3 className="text-lg font-semibold text-foreground">No reviews found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You haven’t submitted any reviews yet.
              </p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-all text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}