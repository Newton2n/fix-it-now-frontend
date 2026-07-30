import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import InfoItem from "./info-item";

type ProfileSummaryCardProps = {
  phoneNumber: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
  isTechnician?: boolean;
  technicianStatus?: "VERIFIED" | "PENDING" | "SUSPENDED";
  onCreateTechnicianProfile?: () => void;
};

export default function ProfileSummaryCard({
  phoneNumber,
  country,
  createdAt,
  updatedAt,
  isTechnician,
  technicianStatus,
  onCreateTechnicianProfile,
}: ProfileSummaryCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
      <div className="mb-4 space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Account Details
        </p>
        <p className="text-sm text-muted-foreground">
          Basic account information and timestamps
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <InfoItem label="Phone" value={phoneNumber ?? "Not added"} />
        <InfoItem label="Country" value={country ?? "Not added"} />
        <InfoItem label="Created At" value={formatDateTime(createdAt)} />
        <InfoItem label="Updated At" value={formatDateTime(updatedAt)} />
      </div>

      {isTechnician ? (
        <div className="mt-5 rounded-2xl border bg-muted/20 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Technician Profile</p>
              <p className="text-sm text-muted-foreground">
                {technicianStatus === "VERIFIED"
                  ? "Profile verified"
                  : technicianStatus === "PENDING"
                  ? "Waiting for approval"
                  : "No technician profile status"}
              </p>
            </div>

            {technicianStatus ? (
              <Badge
                variant={
                  technicianStatus === "VERIFIED"
                    ? "default"
                    : technicianStatus === "PENDING"
                    ? "secondary"
                    : "destructive"
                }
                className="rounded-full px-3"
              >
                {technicianStatus}
              </Badge>
            ) : null}
          </div>

          {technicianStatus !== "VERIFIED" && onCreateTechnicianProfile ? (
            <Button className="mt-4 w-full sm:w-auto" onClick={onCreateTechnicianProfile}>
              Create Technician Profile
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}