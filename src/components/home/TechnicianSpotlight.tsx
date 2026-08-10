import { ArrowRight, Briefcase, MapPin, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";
import { getAllTechnicians } from "@/actions/technician.action";
import { getUserById } from "@/actions/user.action";
import TechnicianCard from "@/components/technicians/technician-card";
import Link from "next/link";

type Technician = {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  isAvailable: boolean;
  yearsOfExperience: string;
  serviceArea: string[];
  status: string;
};

export async function TechnicianSpotlight() {
  const result = await getAllTechnicians({
    page: 1,
    limit: 6,
    sortBy: "date",
    sortOrder: "desc",
  });

  if (!result.success) {
    return null;
  }

  const rawTechnicians: Technician[] = result.data ?? [];

  // Strictly enforce 3 or 6 items (take first 6 if available, otherwise take first 3)
  const technicians = rawTechnicians.length >= 6 
    ? rawTechnicians.slice(0, 6) 
    : rawTechnicians.slice(0, 3);

  if (technicians.length === 0) {
    return null;
  }

  return (
    <section id="technicians" className="w-full border-b border-border bg-background py-16 lg:py-24">
      {/* Expanded container to match ultra-wide 4K display widths (max-w-[1920px]) while preserving internal padding alignment */}
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Technician discovery"
            title="Find the right professional for the job."
            description="Profiles show skills, experience, service area and current availability. Connect with trusted technicians in your area."
          />
          <Button asChild variant="outline" className="shrink-0 gap-2 self-start sm:self-auto">
            <Link href="/technicians">
              Browse all technicians
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {technicians.map((technician, i) => (
            <Reveal as="li" key={technician.id} delay={Math.min(i, 3) * 70} className="min-w-0">
              <TechnicianWithUser technician={technician} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

async function TechnicianWithUser({ technician }: { technician: Technician }) {
  const userResult = await getUserById(technician.userId);

  const user = userResult?.success ? userResult.data : null;

  const name = user?.name || "Professional Technician";

  const profileImage =
    user?.profileImage || user?.image || user?.profilePicture || null;

  return (
    <TechnicianCard
      id={technician.id}
      name={name}
      profileImage={profileImage}
      bio={technician.bio}
      skills={technician.skills}
      yearsOfExperience={technician.yearsOfExperience}
      serviceArea={technician.serviceArea}
      isAvailable={technician.isAvailable}
      status={technician.status}
    />
  );
}