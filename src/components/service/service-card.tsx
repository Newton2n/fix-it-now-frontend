import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, UserRound, ImageOff } from "lucide-react";

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
  rating: number;
  price: number;
  technician: string;
};

export default function ServiceCard({
  id,
  title,
  image,
  location,
  rating,
  price,
  technician,
}: ServiceCardProps) {
  return (
    <Card className="group flex h-full aspect-16/10low-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}{" "}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={`${title} service`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            {" "}
            <ImageOff className="h-8 w-8" />{" "}
            <span className="text-sm">No image available</span>{" "}
          </div>
        )}
        {/* Rating Badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
      {/* Header */}
      <CardHeader className="space-y-3 pb-3">
        <CardTitle className="line-clamp-2 text-lg leading-snug">
          {title}
        </CardTitle>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </CardHeader>
      {/* Content */}
      <CardContent className="flex-1 space-y-4">
        {/* Technician */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <UserRound className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Provided by</p>

            <p className="truncate text-sm font-medium">{technician}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between border-t pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>

            <p className="text-lg font-bold text-primary">${price}</p>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">Rating</p>

            <div className="flex items-center justify-end gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      {/* Action */}
      <CardFooter className="pt-0">
        <Link
          href={`/technicians/${id}`}
          className={cn(
            buttonVariants({
              variant: "default",
              size: "default",
            }),
            "w-full",
          )}
        >
          View & Book
        </Link>
      </CardFooter>
    </Card>
  );
}
