import TechnicianActionButtons from "./technician-actions";
import { Button } from "../ui/button";
import Link from "next/link";
import { TechnicianVerificationBadge } from "../status-badges";
import { TechnicianProfile } from "@/types/technician";

export function TechnicianCard({
  technician,
}: {
  technician: TechnicianProfile;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">
              {getBioPreview(technician.bio)}
            </h3>
            <TechnicianVerificationBadge status={technician.status} />
          </div>

          <p className="text-sm text-muted-foreground">
            Experience: {technician.yearsOfExperience}
          </p>

          <p className="text-sm text-muted-foreground">
            Skills: {technician.skills?.join(", ") || "Not added"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/technicians/${technician.id}`}>
              View Profile
            </Link>
          </Button>

          <TechnicianActionButtons technician={technician} />
        </div>
      </div>
    </div>
  );
}

function getBioPreview(bio: string | null | undefined) {
  if (!bio) return "No bio added";
  if (bio.length <= 60) return bio;
  return `${bio.slice(0, 60)}...`;
}
