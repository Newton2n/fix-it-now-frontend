import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock, ImageOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSingleService } from "@/actions/service.action";
import { ServiceItem } from "@/schema/service/service.schema";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getSingleService(id);
  console.log("single service result", result);

  if (!result || !result.data) {
    notFound();
  }

  const service: ServiceItem = result?.data.result ? result?.data.result : {};
  console.log("service", service);
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative h-80 overflow-hidden rounded-2xl border bg-muted md:h-120">
            {
              <Image
                src={
                  service?.thumbnailImage ||
                  "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2VydmljZXxlbnwwfHwwfHx8MA%3D%3D"
                }
                alt={service?.title || "Free image"}
                fill
                className="object-cover"
                priority
              />
            }
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Badge variant="secondary">
                {service?.isAvailable ? "Available" : "Currently Unavailable"}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl capitalize">
                {service?.title}
              </h1>
              <p className="text-muted-foreground">{service?.description}</p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Location not specified</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>5.0 (Review)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Quick Response</span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Technician Details</CardTitle>
                <CardDescription>
                  Trusted professional assigned to this service
                </CardDescription>
              </CardHeader>
              {/* <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Technician Name</span>
                  <span className="font-medium text-foreground font-mono text-xs">
                    {service.technicianId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category ID</span>
                  <span className="font-medium text-foreground font-mono text-xs">
                    {service.categoryId}
                  </span>
                </div>
              </CardContent> */}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Starting service price</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-3xl font-bold text-foreground">
                  ${service?.price}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    {service?.currency}
                  </span>
                </p>
                <Button disabled={!service.isAvailable}>
                  {service?.isAvailable ? (
                    <Link href={`/book/${service?.id}`}>Book Now</Link>
                  ) : (
                    "Book Now"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
