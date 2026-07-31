"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Star } from "lucide-react"
import { submitReview, updateReview } from "@/actions/review.action"
import { ratingSchema } from "@/lib/form-utils"
import { cn } from "@/lib/utils"

const reviewSchema = z.object({
  rating: ratingSchema,
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(500, "Comment must be less than 500 characters"),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  mode: "create" | "edit"
  bookingId?: string
  reviewId?: string
  initialData?: { rating: number; comment: string }
  onSuccess?: () => void
}

export function ReviewForm({
  mode,
  bookingId,
  reviewId,
  initialData,
  onSuccess,
}: ReviewFormProps) {
  const [isPending, setIsPending] = useState(false)
  const [rating, setRating] = useState(initialData?.rating || 0)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      comment: initialData?.comment || "",
    },
  })

  const onSubmit = async (data: ReviewFormData) => {
    setIsPending(true)
    try {
      const result =
        mode === "create"
          ? await submitReview({
              bookingId: bookingId || "",
              rating: rating,
              comment: data.comment,
            })
          : await updateReview(reviewId || "", {
              rating: rating,
              comment: data.comment,
            })

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      onSuccess?.()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Rating Section */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">How was your experience?</h3>

        <div className="space-y-4">
          <div>
            <Label>Rating</Label>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={cn(
                      "h-8 w-8",
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
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
          </div>

          <div>
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience with this service..."
              className="mt-2"
              {...register("comment")}
              aria-invalid={!!errors.comment}
              aria-describedby={errors.comment ? "comment-error" : undefined}
            />
            {errors.comment && (
              <p id="comment-error" className="mt-1 text-sm text-destructive">
                {errors.comment.message}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isPending || rating === 0}
          className="gap-2"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "create" ? "Submit Review" : "Update Review"}
        </Button>
      </div>
    </form>
  )
}
