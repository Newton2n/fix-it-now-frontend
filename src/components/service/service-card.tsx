import Image from "next/image";
import Link from "next/link";
import { MapPin, UserRound, ImageOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  id: string | number;
  title: string;
  image?: string | null;
  location: string;
  price: number;
  technician: string;
};

export default function ServiceCard({
  id,
  title,
  image,
  location,
  price,
  technician,
}: ServiceCardProps) {
  return (
    <Link href={`/services/${id}`} className="group block h-full min-w-0">
      <Card className="flex h-full flex-col overflow-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[16/10] w-full min-w-0 overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={`${title} service`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground p-4 text-center">
              <ImageOff className="h-8 w-8 shrink-0" />
              <span className="text-xs sm:text-sm">No image available</span>
            </div>
          )}
        </div>

        <CardHeader className="space-y-2.5 pb-3 sm:space-y-3 sm:pb-3">
          <CardTitle className="line-clamp-2 text-base font-semibold leading-snug sm:text-lg">
            {title}
          </CardTitle>

          <div className="flex min-w-0 items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col justify-between space-y-4 pt-0">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <UserRound className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">Provided by</p>
              <p className="truncate text-xs sm:text-sm font-medium leading-snug">{technician}</p>
            </div>
          </div>

          <div className="flex min-w-0 items-end justify-between border-t pt-3 sm:pt-4">
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">Starting from</p>
              <p className="text-base sm:text-lg font-bold text-primary leading-tight truncate">${price}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-4 sm:pb-6">
          <span
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              "w-full text-xs sm:text-sm"
            )}
          >
            View &amp; Book
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}