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

  const rawCategories: Category[] = result.data ?? [];

  const categories =
    rawCategories.length >= 6
      ? rawCategories.slice(0, 6)
      : rawCategories.slice(0, 3);

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
                  "min-w-0 h-full flex",
                  // Hides items past index 2 on mobile and tablet screens, showing all 6 on large/desktop screens
                  i >= 3 && "hidden lg:flex",
                )}
              >
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  description={
                    category.description ||
                    "Get service by category with professional technicians ready to assist."
                  }
                  className="h-full flex flex-col justify-between"
                />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
