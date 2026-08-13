"use client";

import Image from "next/image";
import Link from "next/link";

import {
  BriefcaseBusiness,
  MapPin,
  UserRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type TechnicianStatus =
  | "PENDING_APPROVAL"
  | "VERIFIED"
  | "SUSPENDED";

type TechnicianCardProps = {
  id: string;
  name: string;
  profileImage: string | null;
  bio: string;
  skills: string[];
  yearsOfExperience: string;
  serviceArea: string[];
  isAvailable: boolean;
  status: TechnicianStatus;
};

export default function TechnicianCard({
  id,
  name,
  profileImage,
  bio,
  skills,
  yearsOfExperience,
  serviceArea,
  isAvailable,
  status,
}: TechnicianCardProps) {
  return (
    <Link
      href={`/technicians/${id}`}
      className="group block h-full cursor-pointer"
    >
      <Card className="flex h-full flex-col overflow-hidden transition group-hover:-translate-y-1 group-hover:shadow-md">
        <CardHeader>
          <div className="flex items-start gap-4">
            {/* Profile Image */}
            <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <UserRound className="size-7 text-muted-foreground" />
              )}
            </div>

            {/* Name + Status */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="truncate text-lg group-hover:text-primary">
                  {name}
                </CardTitle>

                {/* Technician Status */}
                {status === "VERIFIED" && (
                  <Badge variant="secondary">
                    Verified
                  </Badge>
                )}

                {status === "PENDING_APPROVAL" && (
                  <Badge variant="outline">
                    Pending Approval
                  </Badge>
                )}

                {status === "SUSPENDED" && (
                  <Badge variant="destructive">
                    Suspended
                  </Badge>
                )}
              </div>

              {/* Experience */}
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <BriefcaseBusiness className="size-4" />

                <span>
                  {yearsOfExperience} years experience
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <CardDescription className="line-clamp-2 pt-3">
            {bio ||
              "Professional home service technician."}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col">
          {/* Availability */}
          <div className="mb-4">
            <Badge
              variant={
                isAvailable
                  ? "default"
                  : "outline"
              }
            >
              {isAvailable
                ? "Available"
                : "Currently unavailable"}
            </Badge>
          </div>

          {/* Skills */}
          <div>
            <p className="mb-2 text-sm font-medium">
              Skills
            </p>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills
                  .slice(0, 4)
                  .map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="font-normal"
                    >
                      {skill}
                    </Badge>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No skills listed
              </p>
            )}
          </div>

          {/* Service Area */}
          {serviceArea.length > 0 && (
            <div className="mt-4">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" />

                <span className="line-clamp-2">
                  {serviceArea.join(", ")}
                </span>
              </div>
            </div>
          )}

          {/* Button Indicator */}
          <Button
            className="mt-6 w-full cursor-pointer"
            variant="outline"
            asChild
          >
            <span>View Profile</span>
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}