import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import InfoItem from "./info-item";

type AvailabilityWindow = {
  start: string;
  end: string;
};

type TechnicianStatus = "VERIFIED" | "PENDING" | "SUSPENDED";

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
};

type TechnicianProfileCardProps = {
  technician: TechnicianProfile | null;
  onEditProfile?: () => void;
};

export default function TechnicianProfileCard({
  technician,
  onEditProfile,
}: TechnicianProfileCardProps) {
  if (!technician) {
    return (
      <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
        <div className="rounded-2xl border border-dashed bg-muted/20 p-5 text-center">
          <p className="text-sm font-medium text-foreground">No technician profile found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a technician profile to offer services and manage availability.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Technician Profile
          </p>
          <h3 className="text-xl font-semibold text-foreground">Profile Overview</h3>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {technician.bio}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={getStatusVariant(technician.status)} className="rounded-full px-3">
            {getStatusLabel(technician.status)}
          </Badge>
          <Badge
            variant={technician.isAvailable ? "default" : "secondary"}
            className="rounded-full px-3"
          >
            {technician.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            <InfoItem label="Profile ID" value={technician.id} />
            <InfoItem label="User ID" value={technician.userId} />
            <InfoItem label="Experience" value={`${technician.yearsOfExperience} years`} />
            <InfoItem label="Created At" value={formatDateTime(technician.createdAt)} />
            <InfoItem label="Updated At" value={formatDateTime(technician.updatedAt)} />
            <InfoItem
              label="Availability"
              value={technician.isAvailable ? "Open for jobs" : "Not available"}
            />
          </div>

          <SectionBlock title="Skills">
            <div className="flex flex-wrap gap-2">
              {technician.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="rounded-full px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock title="Service Areas">
            <div className="flex flex-wrap gap-2">
              {technician.serviceArea.map((area) => (
                <Badge key={area} variant="secondary" className="rounded-full px-3 py-1">
                  {area}
                </Badge>
              ))}
            </div>
          </SectionBlock>
        </div>

        <aside className="rounded-2xl border bg-background p-4 sm:p-5">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Weekly Availability
            </p>
            <p className="text-sm text-muted-foreground">
              Working hours by day
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {Object.entries(technician.availability).map(([day, slot]) => (
              <div
                key={day}
                className="flex items-center justify-between rounded-xl border bg-card px-3 py-2.5"
              >
                <span className="text-sm font-medium capitalize text-foreground">
                  {day}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatTime(slot.start)} - {formatTime(slot.end)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border bg-muted/30 p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Quick Action
            </p>
            <div className="mt-3">
              <Button size="sm" variant="outline" className="w-full" onClick={onEditProfile}>
                Edit Technician Profile
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function getStatusLabel(status: TechnicianStatus) {
  switch (status) {
    case "VERIFIED":
      return "Verified";
    case "PENDING":
      return "Pending";
    case "SUSPENDED":
      return "Suspended";
    default:
      return status;
  }
}

function getStatusVariant(status: TechnicianStatus) {
  switch (status) {
    case "VERIFIED":
      return "default";
    case "PENDING":
      return "secondary";
    case "SUSPENDED":
      return "destructive";
    default:
      return "secondary";
  }
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}

function formatTime(value: string) {
  const cleaned = value.replace(/\s+/g, "");
  const [hourStr, minuteStr = "00"] = cleaned.split(":");
  const hour = Number(hourStr);

  if (Number.isNaN(hour)) return value;

  const date = new Date();
  date.setHours(hour, Number(minuteStr), 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}