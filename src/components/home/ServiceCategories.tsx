import {
  ArrowRight,
  Droplets,
  Hammer,
  House,
  Paintbrush,
  Plug,
  Snowflake,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal, SectionHeading } from "./Reveal";
import { sampleCategories } from "./sample-data";
import type { ServiceCategory } from "./types";

const ICONS: Record<ServiceCategory["icon"], LucideIcon> = {
  plumbing: Droplets,
  electrical: Plug,
  cleaning: Sparkles,
  ac: Snowflake,
  painting: Paintbrush,
  carpentry: Hammer,
  maintenance: House,
};

export function ServiceCategories({
  categories = sampleCategories,
}: {
  categories?: ServiceCategory[];
}) {
  return (
    <section id="categories" className="w-full border-b border-border bg-background py-16 lg:py-24">
      <div className="section-x mx-auto max-w-[110rem]">
        <Reveal>
          <SectionHeading
            eyebrow="Service discovery"
            title="What do you need help with?"
            description="Browse categories to find the right kind of professional, then compare services and availability in your area."
          />
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, i) => {
            const Icon = ICONS[category.icon] ?? Wrench;
            return (
              <Reveal as="li" key={category.id} delay={Math.min(i, 5) * 60} className="min-w-0">
                <Card className="group flex h-full min-w-0 cursor-pointer flex-col gap-3 rounded-2xl border-border bg-card p-5 shadow-none transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold tracking-tight">{category.name}</h3>
                  <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Explore
                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Card>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}