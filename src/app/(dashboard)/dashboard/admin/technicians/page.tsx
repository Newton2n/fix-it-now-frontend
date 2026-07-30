import { getAllTechnicianProfile } from "@/actions/admin.action";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TechnicianStatus = "VERIFIED" | "PENDING" | "SUSPENDED";

type AvailabilityWindow = {
  start: string;
  end: string;
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
};

type TechnicianResponse = {
  meta: {
    page: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: TechnicianProfile[];
};

export default async function AdminTechniciansPage() {
  const result = await getAllTechnicianProfile();
  const technicians: TechnicianProfile[] = result?.data?.result?.data ?? [];
  const meta = result?.data?.result?.meta;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Technicians"
        description="Review and manage technician profiles."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Technicians"
          value={meta?.totalRow ?? technicians.length}
        />
        <StatCard
          label="Verified"
          value={technicians.filter((t) => t.status === "VERIFIED").length}
        />
        <StatCard
          label="Pending"
          value={technicians.filter((t) => t.status === "PENDING").length}
        />
      </div>
      <SectionCard
        title="Technician List"
        description={`Page ${meta?.page ?? 1} of ${meta?.totalPage ?? 1} • ${technicians.length} technicians`}
      >
        {technicians.length > 0 ? (
          <div className="space-y-5">
            {technicians.map((tech) => {
              const availabilityEntries = Object.entries(tech.availability);
              const availableDays = availabilityEntries.length;

              return (
                <div
                  key={tech.id}
                  className={cn(
                    "rounded-2xl border bg-card shadow-sm transition-all",
                    "hover:-translate-y-0.5 hover:shadow-lg",
                  )}
                >
                  <div className="border-b bg-gradient-to-r from-muted/40 to-transparent px-4 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                          Technician Profile
                        </p>
                        <h3 className="text-xl font-semibold text-foreground">
                          {tech.userId}
                        </h3>
                        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                          {tech.bio}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={getStatusVariant(tech.status)}
                          className="rounded-full px-3"
                        >
                          {getStatusLabel(tech.status)}
                        </Badge>
                        <Badge
                          variant={tech.isAvailable ? "default" : "secondary"}
                          className="rounded-full px-3"
                        >
                          {tech.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 p-4 sm:p-6 xl:grid-cols-[1.35fr_0.95fr]">
                    <div className="space-y-5">
                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        <Info label="Profile ID" value={tech.id} />
                        <Info label="User ID" value={tech.userId} />
                        <Info
                          label="Experience"
                          value={`${tech.yearsOfExperience} years`}
                        />
                        <Info
                          label="Created At"
                          value={formatDateTime(tech.createdAt)}
                        />
                        <Info
                          label="Updated At"
                          value={formatDateTime(tech.updatedAt)}
                        />
                        <Info
                          label="Status"
                          value={
                            tech.isAvailable ? "Open for jobs" : "Not available"
                          }
                        />
                      </div>

                      <SectionBlock title="Skills">
                        <div className="flex flex-wrap gap-2">
                          {tech.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="rounded-full px-3 py-1"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </SectionBlock>

                      <SectionBlock title="Service Areas">
                        <div className="flex flex-wrap gap-2">
                          {tech.serviceArea.map((area) => (
                            <Badge
                              key={area}
                              variant="secondary"
                              className="rounded-full px-3 py-1"
                            >
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </SectionBlock>
                    </div>

                    <aside className="space-y-4 rounded-2xl border bg-background p-4 sm:p-5">
                      <div className="space-y-1">
                        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                          Weekly Availability
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {availableDays > 0
                            ? `Available ${availableDays} day${availableDays > 1 ? "s" : ""} a week`
                            : "No availability set"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {availabilityEntries.length > 0 ? (
                          availabilityEntries.map(([day, slot]) => (
                            <div
                              key={day}
                              className="rounded-2xl border bg-card p-3 transition-colors hover:bg-muted/30"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold capitalize text-foreground">
                                    {day}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(slot.start)} -{" "}
                                    {formatTime(slot.end)}
                                  </p>
                                </div>

                                <Badge
                                  variant="outline"
                                  className="rounded-full px-3"
                                >
                                  Open
                                </Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No availability set.
                          </p>
                        )}
                      </div>

                      <div className="rounded-xl border bg-muted/30 p-4">
                        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                          Quick Action
                        </p>
                        <div className="mt-3">
                          {tech.status === "PENDING" ? (
                            <Button size="sm" className="w-full">
                              Verify Technician
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              View Profile
                            </Button>
                          )}
                        </div>
                      </div>
                    </aside>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              No technicians found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no technicians to display.
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-medium leading-6 text-foreground">
        {value}
      </p>
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
  const normalized = value.replace(/\s+/g, "").replace(":00", ":00");
  const [hourStr, minuteStr = "00"] = normalized.split(":");
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
