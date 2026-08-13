import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "./Reveal";
import { getAllCategories } from "@/actions/category.action";
import CategoryCard from "@/components/category/card";
import type { Category } from "@/schema/category/category.schema";
import Link from "next/link";
import { cn } from "@/lib/utils";

export async function ServiceCategories() {
  const result = await getAllCategories({
    page: 1,
    limit: 6,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (!result.success) {
    return null;
  }

  // Always grab up to 6 categories, we will handle the display logic with CSS
  const categories: Category[] = result.data ? result.data.slice(0, 6) : [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <section
      id="categories"
      className="w-full border-b border-border bg-background py-16 lg:py-24"
    >
      {/* Expanded container to match ultra-wide 4K display widths (max-w-[1920px]) while preserving internal padding alignment */}
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Service discovery"
            title="Browse services by category"
            description="Explore different home service categories and connect with trusted professionals in your area."
          />
          <Button
            asChild
            variant="outline"
            className="shrink-0 gap-2 self-start sm:self-auto"
          >
            <Link href="/categories">
              View all categories
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </Reveal>

        {/* h-full on the li and card ensures equal height matching across the grid row */}
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {categories.map((category, i) => {
            return (
              <Reveal
                as="li"
                key={category.id}
                delay={Math.min(i, 3) * 60}
                className={cn(
                  "min-w-0 h-full",
                  // 1. Mobile (grid-cols-1): Show indices 0, 1, 2 (3 cards total), hide the rest
                  i < 3 ? "flex" : "hidden",
                  // 2. Tablet (grid-cols-2): Reveal index 3 (makes 4 cards total)
                  i === 3 && "sm:flex",
                  // 3. Desktop (grid-cols-3): Reveal indices 4 and 5 (makes 6 cards total)
                  i >= 4 && "lg:flex"
                )}
              >
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  imageUrl={category.imageUrl}
                  description={
                    category.description ||
                    "Get service by category with professional technicians ready to assist."
                  }
                  className="h-full flex flex-col justify-between w-full"
                />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}