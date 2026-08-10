import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  id: string;
  name: string;
  description?: string | null;
  icon: LucideIcon;
  className?: string;
};

export default function CategoryCard({
  id,
  name,
  description,
  icon: Icon,
  className,
}: CategoryCardProps) {
  return (
    <Link href={`/categories/${id}`} className={cn("block h-full w-full", className)}>
      {/* 
        1. h-full ensures the card stretches to match the row's height.
        2. flex flex-col organizes elements vertically. 
      */}
      <Card className="group flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl border-border bg-card p-5 shadow-none transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm">
        
        {/* Top Content Group */}
        <div className="flex flex-col gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <h3 className="text-base font-semibold tracking-tight text-foreground line-clamp-1">{name}</h3>
          
          {/* 
            line-clamp-2 restricts the description to a maximum of 2 lines.
            This guarantees every card's description text takes up the exact same vertical space.
          */}
          <p className="min-w-0 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {description || "Get service by category with professional technicians ready to assist."}
          </p>
        </div>

        {/* Bottom Action Link (Stays locked at the bottom due to justify-between) */}
        <div className="pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Explore
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>

      </Card>
    </Link>
  );
}