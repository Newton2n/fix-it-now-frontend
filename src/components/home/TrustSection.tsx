"use client";

import { useState } from "react";
import { MessageSquareQuote, ShieldCheck, Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "./Reveal";
import type { Review } from "./types";
import { cn } from "@/lib/utils";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={cn(
            "size-4 transition-transform duration-200",
            n <= rating
              ? "fill-amber-500 text-amber-500 drop-shadow-xs"
              : "text-muted-foreground/20 fill-muted-foreground/10"
          )}
        />
      ))}
    </div>
  );
}

/** Redesigned modern, immersive trust and reviews section with filtering options, rich card styling, and max-w-[1920px] container support. */
export function TrustSection({ reviews = [] }: { reviews?: Review[] }) {
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredReviews = filterRating 
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <section className="relative w-full border-b border-border bg-background py-20 lg:py-28 overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-primary/5 blur-[140px]" />

      {/* Expanded container matching ultra-wide 4K display widths (max-w-[1920px]) while preserving responsive padding alignment */}
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        
        {/* Header Content */}
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Trust & Verified Reviews"
              title="Real experiences from completed bookings."
              description="Feedback on FixItNow is exclusively written by verified customers after a job is fully finished, ensuring absolute authenticity."
            />
          </Reveal>

          {/* Quick Metrics Bar if reviews exist */}
          {reviews.length > 0 && (
            <Reveal delay={50} className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card/60 px-5 py-3 shadow-xs backdrop-blur-md">
                <div className="flex items-center gap-1.5 font-bold text-foreground text-lg">
                  <span>{averageRating}</span>
                  <Star className="size-4 fill-amber-500 text-amber-500" />
                </div>
                <div className="h-4 w-px bg-border" />
                <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Overall platform score based on <strong className="text-foreground">{reviews.length} verified jobs</strong>
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 bg-card/80 border border-border/80 p-1.5 rounded-2xl shadow-xs backdrop-blur-md">
                <button
                  onClick={() => setFilterRating(null)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200",
                    filterRating === null ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All ({reviews.length})
                </button>
                <button
                  onClick={() => setFilterRating(5)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-1",
                    filterRating === 5 ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>5 Stars</span>
                </button>
              </div>
            </Reveal>
          )}
        </div>

        {/* Reviews Content Grid */}
        {reviews.length === 0 ? (
          <Reveal delay={100}>
            <Card className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-dashed border-border/80 bg-card/40 p-10 text-center shadow-none backdrop-blur-sm sm:p-14">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                <MessageSquareQuote className="size-6" aria-hidden="true" />
              </span>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">No customer reviews published yet</h3>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-md mx-auto">
                  We don't publish placeholder testimonials or fake feedback. As soon as customers complete and review their service bookings, authentic ratings appear here.
                </p>
              </div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border/80 bg-background px-4 py-2 text-xs font-medium text-foreground shadow-xs">
                <ShieldCheck className="size-4 text-primary shrink-0" aria-hidden="true" />
                <span>Verified after completion · Tied to real escrow bookings</span>
              </div>
            </Card>
          </Reveal>
        ) : (
          <div className="mt-12">
            {filteredReviews.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">No reviews found matching this filter rating.</p>
                <Button variant="link" onClick={() => setFilterRating(null)} className="mt-2 text-primary">
                  Clear filter
                </Button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredReviews.map((review, i) => (
                  <Reveal as="li" key={review.id} delay={Math.min(i, 4) * 70} className="min-w-0 h-full flex">
                    <Card className="group relative flex h-full w-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/80 p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl backdrop-blur-md">
                      
                      {/* Top Row: Stars & Quote Icon */}
                      <div className="flex items-center justify-between gap-2">
                        <Stars rating={review.rating} />
                        <span className="grid size-8 place-items-center rounded-xl bg-primary/5 text-primary/60 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                          <Quote className="size-3.5 fill-current" />
                        </span>
                      </div>

                      {/* Main Body Review Text */}
                      <p className="my-5 min-w-0 flex-1 text-sm sm:text-base leading-relaxed text-foreground/90 font-normal italic">
                        &ldquo;{review.body}&rdquo;
                      </p>

                      {/* Footer Author & Service Tag */}
                      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3.5 border-t border-border/80 pt-4 mt-auto">
                        <Avatar className="size-10 shrink-0 ring-2 ring-border/50">
                          {review.avatarUrl ? <AvatarImage src={review.avatarUrl} alt={review.author} /> : null}
                          <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                            {review.author.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-sm font-semibold text-foreground">{review.author}</p>
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                              <ShieldCheck className="size-3" />
                              Verified
                            </span>
                          </div>
                          <p className="truncate text-xs text-muted-foreground mt-0.5">{review.service}</p>
                        </div>
                      </div>

                    </Card>
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>
    </section>
  );
}