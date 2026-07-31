import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Wrench,
  Sparkles,
  Home,
  Zap,
  Droplets,
} from "lucide-react";

import { getAllCategories } from "@/actions/category.action";
import CategoryCard from "@/components/category/card";
import type { Category } from "@/schema/category/category.schema";

const iconMap = [Wrench, Smartphone, Sparkles, Home, Zap, Droplets];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <Badge variant="secondary" className="mb-3">
            Service Categories
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse services by category
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Explore different home service categories and connect with trusted
            professionals.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesContent />
        </Suspense>
      </section>
    </main>
  );
}

async function CategoriesContent() {
  const result = await getAllCategories();

  if (!result.success) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-6 text-center">
        <h2 className="text-xl font-semibold">Unable to load categories</h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {result.message}
        </p>
      </div>
    );
  }

  const categories: Category[] = result.data ?? [];
  const totalCategories = result.meta?.totalRow ?? categories.length;

  if (categories.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 text-center">
        <h2 className="text-xl font-semibold">No categories found</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Service categories are currently unavailable.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {totalCategories} {totalCategories === 1 ? "category" : "categories"}{" "}
          found
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const Icon = iconMap[index % iconMap.length];

          return (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              description={category.description}
              icon={Icon}
            />
          );
        })}
      </div>
    </>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-xl border bg-card p-6">
            <div className="space-y-4">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />

              <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />

              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
