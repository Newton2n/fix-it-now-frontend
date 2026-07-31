"use client";

import { useEffect, useState } from "react";
import { MoreVertical, Star } from "lucide-react";
import { toast } from "sonner";

import {
  getAllReviewDetailsFromLoginUser,
  updateReview,
  deleteReview,
} from "@/actions/review.action";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Review } from "@/types/review";

interface ReviewMeta {
  currentPage: number;
  limit: number;
  totalRow: number;
  totalPage: number;
}

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [meta, setMeta] = useState<ReviewMeta>({
    currentPage: 1,
    limit: 10,
    totalRow: 0,
    totalPage: 0,
  });

  const [loading, setLoading] = useState(true);

  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    review: Review | null;
  }>({
    open: false,
    review: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    reviewId: string | null;
  }>({
    open: false,
    reviewId: null,
  });

 
  // Fetch Reviews                    
  

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const result = await getAllReviewDetailsFromLoginUser();

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        setReviews(result.data);
        setMeta(result.meta);
      } catch (error) {
        console.error("Failed to load reviews:", error);
        toast.error("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

 
  // Edit Review    
 
  const handleUpdateReview = async (rating: number, description: string) => {
    const review = editDialog.review;

    if (!review) return;

    setEditLoading(true);

    try {
      const result = await updateReview(review.id, {
        rating,
        description,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setReviews((currentReviews) =>
        currentReviews.map((item) =>
          item.id === review.id
            ? {
                ...item,
                rating,
                description,
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );

      toast.success(result.message);

      setEditDialog({
        open: false,
        review: null,
      });
    } catch (error) {
      console.error("Update review error:", error);
      toast.error("Failed to update review.");
    } finally {
      setEditLoading(false);
    }
  };

 
  //Delete Review  


  const handleDeleteReview = async () => {
    const reviewId = deleteDialog.reviewId;

    if (!reviewId) return;

    setDeleteLoading(true);

    try {
      const result = await deleteReview(reviewId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setReviews((currentReviews) =>
        currentReviews.filter((review) => review.id !== reviewId),
      );

      setMeta((currentMeta) => ({
        ...currentMeta,
        totalRow: Math.max(0, currentMeta.totalRow - 1),
      }));

      toast.success(result.message);

      setDeleteDialog({
        open: false,
        reviewId: null,
      });
    } catch (error) {
      console.error("Delete review error:", error);
      toast.error("Failed to delete review.");
    } finally {
      setDeleteLoading(false);
    }
  };

  //  Loading                   


  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Reviews"
          description="Leave feedback after your service is completed."
        />

        <SectionCard title="Your Reviews" description="Loading your reviews...">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-48 w-full" />
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }


  //  Page 


  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Reviews"
        description="Leave feedback after your service is completed."
      />

      <SectionCard
        title="Your Reviews"
        description={
          meta.totalRow > 0
            ? `Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total reviews`
            : "You haven't submitted any reviews yet."
        }
      >
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onEdit={() =>
                  setEditDialog({
                    open: true,
                    review,
                  })
                }
                onDelete={() =>
                  setDeleteDialog({
                    open: true,
                    reviewId: review.id,
                  })
                }
              />
            ))}
          </div>
        ) : (
          <EmptyReviews />
        )}
      </SectionCard>

      <EditReviewDialog
        review={editDialog.review}
        open={editDialog.open}
        loading={editLoading}
        onOpenChange={(open) => {
          if (!open && !editLoading) {
            setEditDialog({
              open: false,
              review: null,
            });
          }
        }}
        onSubmit={handleUpdateReview}
      />

      <ConfirmDialog
        title="Delete review?"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete Review"
        cancelText="Keep Review"
        isDestructive
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!deleteLoading) {
            setDeleteDialog((current) => ({
              open,
              reviewId: open ? current.reviewId : null,
            }));
          }
        }}
        onConfirm={handleDeleteReview}
        loading={deleteLoading}
      />
    </div>
  );
}

// Review Card          
interface ReviewCardProps {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
}

function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Review ID</p>
            <p className="break-all font-medium text-foreground">{review.id}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
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
            </div>

            <span className="text-sm font-medium text-muted-foreground">
              {review.rating}/5
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
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
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open review actions</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onEdit}>Edit Review</DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                Delete Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}


// Edit Review Dialog         

interface EditReviewDialogProps {
  review: Review | null;
  open: boolean;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, description: string) => Promise<void>;
}

function EditReviewDialog({
  review,
  open,
  loading,
  onOpenChange,
  onSubmit,
}: EditReviewDialogProps) {
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setDescription(review.description);
    }
  }, [review]);

  if (!review) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedDescription = description.trim();

    if (!trimmedDescription) {
      toast.error("Please enter a review description.");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating.");
      return;
    }

    await onSubmit(rating, trimmedDescription);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Update your rating and feedback.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">Rating</label>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const starNumber = index + 1;

                return (
                  <button
                    key={starNumber}
                    type="button"
                    disabled={loading}
                    onClick={() => setRating(starNumber)}
                    className="rounded-md p-1 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Star
                      className={
                        starNumber <= rating
                          ? "h-7 w-7 fill-yellow-400 text-yellow-400"
                          : "h-7 w-7 text-muted-foreground/30"
                      }
                    />
                  </button>
                );
              })}

              <span className="ml-2 text-sm text-muted-foreground">
                {rating}/5
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="review-description" className="text-sm font-medium">
              Description
            </label>

            <textarea
              id="review-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={loading}
              rows={5}
              placeholder="Share your experience..."
              className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


// Empty State             


function EmptyReviews() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
      <h3 className="text-lg font-semibold text-foreground">
        No reviews found
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        You haven&apos;t submitted any reviews yet.
      </p>
    </div>
  );
}


// Info         


function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-all text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}


// Date  


function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString();
}
