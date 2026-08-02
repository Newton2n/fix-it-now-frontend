import { getTechnicianProfileById } from "@/actions/technician.action";
import { getUserById } from "@/actions/user.action";
import TechnicianServicesGrid from "@/components/profile/technician-services-grid";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

type User = {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string;
  role: UserRole;
  status: string;
  country: string | null;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
};

type AvailabilityWindow = {
  start: string;
  end: string;
};

type TechnicianStatus =
  | "VERIFIED"
  | "PENDING"
  | "SUSPENDED";

type Service = {
  id: string;
  categoryId: string;
  technicianId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  thumbnailImage: string | null;
  galleryImages: string[];
  createdAt: string;
  updatedAt: string;
};

type TechnicianProfile = {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  isAvailable: boolean;
  yearsOfExperience: string;
  availability: Record<string, AvailabilityWindow>;
  status: TechnicianStatus;
  serviceArea: string[];
  createdAt: string;
  updatedAt: string;
  service: Service[];
};

const formatDay = (day: string) => {
  return day.charAt(0).toUpperCase() + day.slice(1);
};

export default async function TechnicianProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;


  const techRes = await getTechnicianProfileById(id);

  const technician: TechnicianProfile | null =
    techRes?.data?.result ?? null;

  if (!technician) {
    return notFound()
  }

  const userRes = await getUserById(technician.userId);

  const user: User | null = userRes?.data ?? null;

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <UserRound className="size-6 text-muted-foreground" />
            </div>

            <h1 className="text-lg font-semibold">
              Profile unavailable
            </h1>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              We couldn't load this technician's information.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }



  const services: Service[] = technician.service ?? [];

  const availability =
    technician.availability ?? {};

  const serviceAreas =
    technician.serviceArea ?? [];

  const skills =
    technician.skills ?? [];

  const availabilityEntries =
    Object.entries(availability);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
     

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {/* Cover */}
        <div className="h-24 bg-linear-to-r from-muted via-muted/60 to-background sm:h-32 lg:h-40" />

        <div className="px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 md:flex-row md:items-end md:justify-between">
            {/* Identity */}
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
              {/* Profile image */}
              <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-4 border-background bg-muted shadow-sm sm:size-28">
                {user.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt={`${user.name}'s profile picture`}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserRound className="size-10 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="min-w-0 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {user.name}
                  </h1>

                  {technician.status === "VERIFIED" && (
                    <Badge className="gap-1">
                      <CheckCircle2 className="size-3.5" />
                      Verified
                    </Badge>
                  )}
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  Professional Technician
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  {technician.yearsOfExperience && (
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="size-4" />
                      {technician.yearsOfExperience}{" "}
                      experience
                    </span>
                  )}

                  {user.country && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4" />
                      {user.country}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="shrink-0">
              <Badge
                variant={
                  technician.isAvailable
                    ? "default"
                    : "secondary"
                }
                className="gap-1.5 px-3 py-1.5"
              >
                <span
                  className={
                    technician.isAvailable
                      ? "size-1.5 rounded-full bg-current"
                      : "size-1.5 rounded-full bg-muted-foreground"
                  }
                />

                {technician.isAvailable
                  ? "Currently available"
                  : "Currently unavailable"}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      

        <div className="min-w-0 space-y-6">
        

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold tracking-tight">
                About
              </h2>

              <p className="text-sm text-muted-foreground">
                Get to know this technician.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Bio */}
              <div>
                {technician.bio ? (
                  <p className="text-sm leading-7 text-muted-foreground">
                    {technician.bio}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No biography has been provided.
                  </p>
                )}
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold">
                    Skills & expertise
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="rounded-md px-3 py-1.5 font-normal"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        

          {availabilityEntries.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <CalendarDays className="size-4" />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Availability
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      Weekly working hours
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  {availabilityEntries.map(
                    ([day, window], index) => (
                      <div key={day}>
                        <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <span className="text-sm font-medium">
                            {formatDay(day)}
                          </span>

                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock3 className="size-3.5" />
                            {window.start} - {window.end}
                          </span>
                        </div>

                        {index <
                          availabilityEntries.length - 1 && (
                          <Separator />
                        )}
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}

         

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold tracking-tight">
                Services
              </h2>

              <p className="text-sm text-muted-foreground">
                Services offered by {user.name}.
              </p>
            </CardHeader>

            <CardContent>
              <TechnicianServicesGrid
                services={services}
              />
            </CardContent>
          </Card>
        </div>

    

        <aside className="space-y-6 lg:sticky lg:top-6">
          {/* Technician details */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold">
                Technician details
              </h2>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Verification */}
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ShieldCheck className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {technician.status === "VERIFIED"
                      ? "Verified technician"
                      : "Verification pending"}
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                    Technician verification status
                  </p>
                </div>
              </div>

              <Separator />

              {/* Availability */}
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <CheckCircle2 className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Availability
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                    {technician.isAvailable
                      ? "Currently accepting service requests"
                      : "Currently not accepting service requests"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Experience */}
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Sparkles className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                   Years of Experience
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {technician.yearsOfExperience ||
                      "Not specified"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Service areas */}
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    Service areas
                  </p>

                  {serviceAreas.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {serviceAreas.map((area) => (
                        <Badge
                          key={area}
                          variant="secondary"
                          className="font-normal"
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      No service areas listed.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer guidance */}
          <Card className="bg-muted/30">
            <CardContent className="p-5">
              <p className="font-semibold">
                Looking for a service?
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Browse the services below to view pricing,
                details, and booking options.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}