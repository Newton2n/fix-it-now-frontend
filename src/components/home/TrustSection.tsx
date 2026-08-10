import { MessageSquareQuote, ShieldCheck, Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Reveal, SectionHeading } from "./Reveal";
import { getLatestReviews } from "@/actions/review.action";
import { cn } from "@/lib/utils";
import { Review } from "@/types/review";

function Stars({ rating }: { rating: number }) {
  return (
    <div
      role="img"
      className="flex items-center gap-1"
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={cn(
            "size-4 transition-transform duration-200",
            n <= rating
              ? "fill-amber-500 text-amber-500 drop-shadow-xs"
              : "text-muted-foreground/20 fill-muted-foreground/10",
          )}
        />
      ))}
    </div>
  );
}

export async function TrustSection() {
  const response = await getLatestReviews();
  const rawReviews: Review[] = response.data || [];

  const reviews: Review[] = rawReviews.map((r, index) => ({
    ...r,
    author: `Verified Customer #${index + 1}`,
    service: "Home Service Booking",
  }));

  const hasLessThanSix = reviews.length < 6;
  const displayLimit = hasLessThanSix ? 3 : 6;
  const visibleReviews = reviews.slice(0, displayLimit);

  if (reviews.length === 0) {
    return (
      <section className="relative w-full border-b border-border bg-background py-16 lg:py-24 overflow-hidden">
        <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              align="left"
              eyebrow="Trust & Verified Reviews"
              title="Real experiences from completed bookings."
              description="Feedback on FixItNow is exclusively written by verified customers after a job is fully finished."
            />
          </Reveal>
          <Reveal delay={100}>
            <Card className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-dashed border-border/80 bg-card/40 p-10 text-center shadow-none backdrop-blur-sm sm:p-14">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                <MessageSquareQuote className="size-6" aria-hidden="true" />
              </span>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  No customer reviews published yet
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-md mx-auto">
                  We don&apos;t publish placeholder testimonials or fake
                  feedback. As soon as customers complete and review their
                  service bookings, authentic ratings appear here.
                </p>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full border-b border-border bg-background py-16 lg:py-24 overflow-hidden">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-primary/5 blur-[140px]" />

      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Trust & Verified Reviews"
            title="Real experiences from completed bookings."
            description="Feedback on FixItNow is exclusively written by verified customers after a job is fully finished, ensuring absolute authenticity."
          />
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {visibleReviews.map((review, i) => {
            const hideOnMobileClass =
              !hasLessThanSix && i >= 3 ? "hidden lg:flex" : "flex";

            return (
              <Reveal
                as="li"
                key={review.id}
                delay={Math.min(i, 3) * 60}
                className={cn("min-w-0 h-full flex", hideOnMobileClass)}
              >
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
                    &ldquo;{review.description}&rdquo;
                  </p>

                  {/* Footer Author & Service Tag */}
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3.5 border-t border-border/80 pt-4 mt-auto">
                    <Avatar className="size-10 shrink-0 ring-2 ring-border/50">
                      <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                        {"User".slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                          <ShieldCheck className="size-3" />
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
