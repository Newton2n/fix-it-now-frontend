"use client";

import { ArrowRight, Briefcase, MapPin, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";
import { sampleTechnicians } from "./sample-data";
import type { Technician } from "./types";

const AVAILABILITY: Record<
  Technician["availability"],
  { label: string; dot: string; text: string }
> = {
  available: { label: "Accepting bookings", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  limited: { label: "Limited availability", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  unavailable: { label: "Not available", dot: "bg-muted-foreground", text: "text-muted-foreground" },
};

export function TechnicianSpotlight({
  technicians = sampleTechnicians,
}: {
  technicians?: Technician[];
}) {
  return (
    <section id="technicians" className="w-full border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Technician discovery"
            title="Find the right professional for the job."
            description="Profiles show skills, experience, service area and current availability. Sample structure below — real profiles load from your FixItNow data."
          />
          <Button variant="outline" className="shrink-0 gap-2 self-start sm:self-auto">
            Browse all technicians
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {technicians.map((tech, i) => {
            const status = AVAILABILITY[tech.availability];
            return (
              <Reveal as="li" key={tech.id} delay={Math.min(i, 4) * 70} className="min-w-0">
                <Card className="flex h-full min-w-0 flex-col gap-4 rounded-2xl border-border bg-card p-5 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/40">
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                    <Avatar className="size-12 shrink-0">
                      {tech.avatarUrl ? <AvatarImage src={tech.avatarUrl} alt="" /> : null}
                      <AvatarFallback className="bg-secondary text-sm font-semibold text-primary">
                        {tech.headline.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold tracking-tight">{tech.name}</h3>
                      <p className="truncate text-xs text-muted-foreground">{tech.headline}</p>
                    </div>
                  </div>

                  <ul className="flex flex-wrap gap-1.5">
                    {tech.skills.map((skill) => (
                      <li key={skill}>
                        <Badge
                          variant="secondary"
                          className="rounded-md bg-secondary text-[0.7rem] font-medium text-secondary-foreground"
                        >
                          {skill}
                        </Badge>
                      </li>
                    ))}
                  </ul>

                  <dl className="min-w-0 flex-1 space-y-2 text-xs text-muted-foreground">
                    <div className="flex min-w-0 items-center gap-2">
                      <Briefcase className="size-3.5 shrink-0" aria-hidden="true" />
                      <dt className="sr-only">Experience</dt>
                      <dd className="truncate">{tech.yearsOfExperience} years experience</dd>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                      <dt className="sr-only">Service area</dt>
                      <dd className="truncate">{tech.serviceArea}</dd>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <Star className="size-3.5 shrink-0 fill-amber-500 text-amber-500" aria-hidden="true" />
                      <dt className="sr-only">Rating</dt>
                      <dd className="truncate">
                        {tech.rating
                          ? `${tech.rating.average.toFixed(1)} · ${tech.rating.count} reviews`
                          : "No reviews yet"}
                      </dd>
                    </div>
                  </dl>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={cn(
                          "inline-flex w-fit cursor-default items-center gap-2 rounded-full border border-border px-2.5 py-1 text-[0.7rem] font-medium",
                          status.text,
                        )}
                      >
                        <span className={cn("size-1.5 rounded-full", status.dot)} aria-hidden="true" />
                        {status.label}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Availability is set by the technician.</TooltipContent>
                  </Tooltip>

                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={tech.availability === "unavailable"}
                  >
                    View Profile
                  </Button>
                </Card>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}