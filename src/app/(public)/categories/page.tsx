import { Badge } from "@/components/ui/badge";
import { Smartphone, Wrench, Sparkles, Home, Zap, Droplets } from "lucide-react";

import { getAllCategories } from "@/actions/category.action";
import CategoryCard from "@/components/category/card";
import { Category } from "@/schema/category/category.schema";

const iconMap = [
  Wrench,
  Smartphone,
  Sparkles,
  Home,
  Zap,
  Droplets,
];

export default async function CategoriesPage() {
  const result = await getAllCategories();

  const categories: Category[] =
    result?.data?.result?.data ?? [];

  const meta =
    result?.data?.result?.meta;


  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">

          <Badge
            variant="secondary"
            className="mb-3"
          >
            Service Categories
          </Badge>


          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse services by category
          </h1>


          <p className="mt-2 max-w-2xl text-muted-foreground">
            Explore different home service categories and
            connect with trusted professionals.
          </p>


          {meta?.totalRow !== undefined && (
            <p className="mt-3 text-sm text-muted-foreground">
              {meta.totalRow} categories found
            </p>
          )}

        </div>
      </section>



      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">


        {categories.length === 0 ? (

          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 text-center">

            <h2 className="text-xl font-semibold">
              No categories found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Service categories are currently unavailable.
            </p>

          </div>

        ) : (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {categories.map((category, index) => {

              const Icon =
                iconMap[index % iconMap.length];


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

        )}

      </section>

    </main>
  );
}