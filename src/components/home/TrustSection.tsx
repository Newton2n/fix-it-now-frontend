import { MessageSquareQuote, ShieldCheck, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Reveal, SectionHeading } from "./Reveal";
import type { Review } from "./types";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={
            n <= rating
              ? "size-3.5 fill-brand-amber text-brand-amber"
              : "size-3.5 text-muted-foreground/40"
          }
        />
      ))}
    </span>
  );
}

/** Pass real reviews via `reviews`. With none, an honest empty state is shown. */
export function TrustSection({ reviews = [] }: { reviews?: Review[] }) {
  return (
    <section className="w-full border-b border-border bg-background py-16 lg:py-24">
      <div className="section-x mx-auto max-w-[110rem]">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Trust & reviews"
            title="Feedback comes from completed bookings only."
            description="Reviews on FixItNow are written by customers after a job is finished, and they stay attached to the technician's profile."
          />
        </Reveal>

        {reviews.length === 0 ? (
          <Reveal delay={100}>
            <Card className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-3 rounded-3xl border-dashed border-border bg-card p-8 text-center shadow-none sm:p-10">
              <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
                <MessageSquareQuote className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold tracking-tight">No reviews to show yet</h3>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                We don't publish placeholder testimonials. As soon as customers review completed
                bookings, their ratings appear here and on technician profiles.
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                Verified after completion · Tied to a real booking
              </p>
            </Card>
          </Reveal>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal as="li" key={review.id} delay={Math.min(i, 4) * 70} className="min-w-0">
                <Card className="flex h-full min-w-0 flex-col gap-4 rounded-2xl border-border bg-card p-6 shadow-none">
                  <Stars rating={review.rating} />
                  <p className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">
                    {review.body}
                  </p>
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-t border-border pt-4">
                    <Avatar className="size-9 shrink-0">
                      {review.avatarUrl ? <AvatarImage src={review.avatarUrl} alt="" /> : null}
                      <AvatarFallback className="bg-secondary text-xs font-semibold text-primary">
                        {review.author.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{review.author}</p>
                      <p className="truncate text-xs text-muted-foreground">{review.service}</p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}