"use client"
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Lightweight IntersectionObserver scroll reveal (opacity + translateY). */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      style={shown && delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out",
        shown ? "opacity-100 translate-y-0" : "motion-safe:opacity-0 motion-safe:translate-y-4",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("min-w-0", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          <span className="h-px w-6 bg-primary/50" aria-hidden="true" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display mt-3 max-w-2xl text-pretty text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}