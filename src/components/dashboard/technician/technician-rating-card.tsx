"use client";

import { MessageSquareText, Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TechnicianRatingCardProps = {
  averageRating: number;
  reviewsCount: number;
};

export default function TechnicianRatingCard({
  averageRating,
  reviewsCount,
}: TechnicianRatingCardProps) {
  const roundedRating = Math.max(
    0,
    Math.min(5, Math.round(averageRating)),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Customer Feedback</CardTitle>

            <CardDescription>
              Your current rating and review activity.
            </CardDescription>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <MessageSquareText className="size-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold">
            {averageRating.toFixed(1)}
          </span>

          <div
            className="flex items-center gap-0.5"
            aria-label={`${averageRating.toFixed(1)} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={
                  index < roundedRating
                    ? "size-5 fill-yellow-400 text-yellow-400"
                    : "size-5 text-muted-foreground/30"
                }
              />
            ))}
          </div>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {reviewsCount}{" "}
          {reviewsCount === 1 ? "review" : "reviews"} received
        </p>
      </CardContent>
    </Card>
  );
}