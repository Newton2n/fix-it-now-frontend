"use client";

import { ArrowRight, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Reveal, SectionHeading } from "./Reveal";
import { sampleServices } from "./sample-data";
import type { FeaturedService } from "./types";
import Image from "next/image";

export function FeaturedServices({
  services = sampleServices,
}: {
  services?: FeaturedService[];
}) {
  return (
    <section id="services" className="w-full border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured services"
            title="Popular jobs booked on FixItNow"
            description="Clear scope, clear service area, and a professional attached to every booking."
          />
          <Button variant="outline" className="shrink-0 gap-2 self-start sm:self-auto">
            View all services
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, i) => (
            <Reveal as="li" key={service.id} delay={Math.min(i, 4) * 70} className="min-w-0">
              <Card className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border-border bg-card p-0 shadow-none transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm">
                <div className="relative w-full overflow-hidden bg-secondary">
                  <div className="aspect-[4/3] w-full">
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt={service.imageAlt ?? ""}
                        loading="lazy"
                        width={1024}
                        height={768}
                        className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                      />
                    ) : null}
                  </div>
                  <Badge className="absolute left-3 top-3 border-border bg-card/95 text-xs font-medium text-foreground hover:bg-card">
                    {service.category}
                  </Badge>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2 p-5">
                  <h3 className="text-base font-semibold leading-snug tracking-tight">
                    {service.title}
                  </h3>
                  <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    {service.serviceArea ? (
                      <span className="inline-flex min-w-0 items-center gap-1.5">
                        <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{service.serviceArea}</span>
                      </span>
                    ) : null}
                    {service.rating ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Star
                          className="size-3.5 fill-amber-500 text-amber-500"
                          aria-hidden="true"
                        />
                        {service.rating.average.toFixed(1)} ({service.rating.count})
                      </span>
                    ) : (
                      <span>Ratings shown once reviews are in</span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar className="size-7 shrink-0">
                        {service.provider?.avatarUrl ? (
                          <AvatarImage src={service.provider.avatarUrl} alt="" />
                        ) : null}
                        <AvatarFallback className="bg-secondary text-[0.65rem] font-semibold text-muted-foreground">
                          {service.provider?.name?.slice(0, 2).toUpperCase() ?? "FN"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate text-xs text-muted-foreground">
                        {service.provider?.name ?? "Matched professional"}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0 gap-1.5 text-primary">
                      View Details
                      <ArrowRight
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}