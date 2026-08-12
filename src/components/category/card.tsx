import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  className?: string;
};

export default function CategoryCard({
  id,
  name,
  description,
  imageUrl,
  className,
}: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${id}`}
      className={cn("group block h-full w-full", className)}
    >
      <Card className="flex h-full w-full flex-col overflow-hidden rounded-2xl border-border bg-card p-0 shadow-none transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm">
        {/* Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm text-muted-foreground">
                No image
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div className="flex flex-col gap-3">
            <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-foreground">
              {name}
            </h3>

            <p className="line-clamp-2 min-w-0 text-sm leading-relaxed text-muted-foreground">
              {description ||
                "Get service by category with professional technicians ready to assist."}
            </p>
          </div>

          {/* Action */}
          <div className="pt-5">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Explore
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}