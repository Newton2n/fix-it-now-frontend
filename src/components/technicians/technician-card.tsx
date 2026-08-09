import Image from "next/image";
import Link from "next/link";

import { BriefcaseBusiness, MapPin, UserRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type TechnicianCardProps = {
  id: string;
  name: string;
  profileImage: string | null;
  bio: string;
  skills: string[];
  yearsOfExperience: string;
  serviceArea: string[];
  isAvailable: boolean;
  status: string;
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
    <Card className="flex h-full min-w-0 flex-col overflow-hidden border-border/60 bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <CardHeader>
        <div className="flex items-start gap-4">
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

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="truncate text-lg">{name}</CardTitle>

              {status === "VERIFIED" && (
                <Badge variant="secondary">Verified</Badge>
              )}
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <BriefcaseBusiness className="size-4" />

              <span>{yearsOfExperience} years experience</span>
            </div>
          </div>
        </div>

        <CardDescription className="line-clamp-2 pt-3">
          {bio || "Professional home service technician."}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        {/* Availability */}
        <div className="mb-4">
          <Badge variant={isAvailable ? "default" : "outline"}>
            {isAvailable ? "Available" : "Currently unavailable"}
          </Badge>
        </div>

        {/* Skills */}
        <div>
          <p className="mb-2 text-sm font-medium">Skills</p>

          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="outline" className="font-normal">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Service Area */}
        {serviceArea.length > 0 && (
          <div className="mt-4">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" />

              <span className="line-clamp-2">{serviceArea.join(", ")}</span>
            </div>
          </div>
        )}

        {/* Button */}
        <Button className="mt-6 w-full" variant="outline" asChild>
          <Link href={`/technicians/${id}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
