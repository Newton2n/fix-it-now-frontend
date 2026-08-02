import { Suspense } from "react";
import ServiceCard from "@/components/service/service-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllService } from "@/actions/service.action";
import { ServicesResponse } from "@/schema/service/service.schema";

export default function ServicesPage() {
  return (
    <Suspense fallback={<ServicesPageSkeleton />}>
      <ServicesPageContent />
    </Suspense>
  );
}

async function ServicesPageContent() {
  const getServices: ServicesResponse = await getAllService();

  const services = getServices?.data?.result?.data || [];

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <Badge variant="secondary" className="mb-3">
            Browse Services
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Find the right service for your home
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Search, filter, and compare trusted technicians before you book.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-4 rounded-2xl border bg-card p-4 shadow-sm md:grid-cols-4">
          <Input
            placeholder="Search service or location..."
            className="md:col-span-2"
          />
          <Button variant="outline">Filter: Category</Button>
          <Button>Search</Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">
            All
          </Button>
          <Button variant="outline" size="sm">
            Plumbing
          </Button>
          <Button variant="outline" size="sm">
            Electrical
          </Button>
          <Button variant="outline" size="sm">
            Cleaning
          </Button>
          <Button variant="outline" size="sm">
            AC Repair
          </Button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              image={
                service.thumbnailImage ||
                "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2VydmljZXxlbnwwfHwwfHx8MA%3D%3D"
              }
              location="Location not specified"
              rating={5.0}
              price={service.price}
              technician="Professional Technician"
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function ServicesPageSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 space-y-3">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </section>
    </main>
  );
}