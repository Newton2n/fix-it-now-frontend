import { House, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground",
        className,
      )}
      aria-hidden="true"
    >
      <House className="size-4.5" strokeWidth={2.2} />
      <span className="absolute -bottom-1 -right-1 grid size-4.5 place-items-center rounded-md bg-brand-amber text-brand-amber-foreground ring-2 ring-background">
        <Wrench className="size-2.5" strokeWidth={2.6} />
      </span>
    </span>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-lg font-semibold tracking-tight", className)}>
      FixIt<span className="text-primary">Now</span>
    </span>
  );
}