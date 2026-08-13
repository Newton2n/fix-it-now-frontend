import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "./Reveal";
import { getAllService } from "@/actions/service.action";
import ServiceCard from "@/components/service/service-card";
import Link from "next/link";
import { cn } from "@/lib/utils";

type MinimalService = {
  id: string;
  title: string;
  thumbnailImage?: string | null | undefined;
  price: number;
};

export async function FeaturedServices() {
  const servicesResult = await getAllService({
    page: 1,
    limit: 6,
  });

  const rawServices: MinimalService[] =
    servicesResult?.data?.result?.data || [];

  const services: MinimalService[] = rawServices.slice(0, 6);

  if (services.length === 0) {
    return null;
  }

  return (
    <section
      id="services"
      className="w-full border-b border-border bg-background py-16 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured services"
            title="Popular jobs booked on FixItNow"
            description="Clear scope, clear service area, and a professional attached to every booking."
          />
          <Button
            asChild
            variant="outline"
            className="shrink-0 gap-2 self-start sm:self-auto"
          >
            <Link href="/services">
              View all services
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 items-stretch">
          {services.map((service, i) => (
            <Reveal
              as="li"
              key={service.id}
              delay={Math.min(i, 3) * 70}
              className={cn(
                "min-w-0 h-full",

                i < 3 ? "block" : "hidden",

                i === 3 && "sm:block",

                i >= 4 && "lg:block",
              )}
            >
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.title}
                image={
                  service.thumbnailImage ||
                  "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                location="Location not specified"
                price={service.price}
                technician="Professional Technician"
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
