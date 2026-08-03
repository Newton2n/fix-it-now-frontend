"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { createReview, updateReview } from "@/actions/review.action";
import { cn } from "@/lib/utils";
import { reviewSchema } from "@/schema/review/review.schema";

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  mode: "create" | "edit";
  bookingId?: string;
  reviewId?: string;
  initialData?: {
    rating: number;
    description?: string;
  };
  onSuccess?: (data?: {
    id?: string;
    rating: number;
    description?: string;
    updatedAt?: string;
  }) => void;
}

export function ReviewForm({
  mode,
  bookingId,
  reviewId,
  initialData,
  onSuccess,
}: ReviewFormProps) {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      description: initialData?.description || "",
    },
  });

  const rating = watch("rating");

  // Update form values when editing existing review
  useEffect(() => {
    reset({
      rating: initialData?.rating || 0,
      description: initialData?.description || "",
    });
  }, [initialData, reset]);

  const onSubmit = async (data: ReviewFormData) => {
    if (mode === "create" && !bookingId) {
      toast.error("Booking ID is missing.");
      return;
    }

    if (mode === "edit" && !reviewId) {
      toast.error("Review ID is missing.");
      return;
    }

    setIsPending(true);

    try {
      const result =
        mode === "create"
          ? await createReview({
              bookingId: bookingId!,
              rating: data.rating,
              description: data.description || "",
            })
          : await updateReview(reviewId!, {
              rating: data.rating,
              description: data.description || "",
            });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      onSuccess?.(
        mode === "edit"
          ? {
              id: reviewId!,
              rating: data.rating,
              description: data.description || "",
              updatedAt: new Date().toISOString(),
            }
          : undefined,
      );
    } catch (error) {
      console.error("Review submit error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        
      })}
      className="space-y-6"
    >
      {" "}
      <Card className="p-6">
        {" "}
        <h3 className="mb-4 text-lg font-semibold">
          {mode === "create"
            ? "How was your experience?"
            : "Update your experience"}{" "}
        </h3>
        <div className="space-y-6">
          {/* Rating */}
          <div>
            <Label>Rating</Label>

            <div className="mt-3 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    setValue("rating", star, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                  className="rounded-md transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={cn(
                      "h-8 w-8",
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground",
                    )}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                {rating} star{rating !== 1 ? "s" : ""} selected
              </p>
            )}

            {errors.rating && (
              <p className="mt-1 text-sm text-destructive">
                {errors.rating.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="review-description">
              {mode === "create" ? "Your Review" : "Description"}
            </Label>

            <Textarea
              id="review-description"
              placeholder="Share your experience with this service..."
              className="mt-2"
              disabled={isPending}
              {...register("description")}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
            />

            {errors.description && (
              <p
                id="description-error"
                className="mt-1 text-sm text-destructive"
              >
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </Card>
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}

          {mode === "create" ? "Submit Review" : "Update Review"}
        </Button>
      </div>
    </form>
  );
}
