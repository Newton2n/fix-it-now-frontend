
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BriefcaseBusiness,
  CalendarDays,
  Pencil,
  UserRound,
} from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { TechnicianVerificationBadge } from "@/components/status-badges";
import { TechnicianProfileForm } from "@/components/forms/technician-profile-form";
import { getLoginTechnicianProfile } from "@/actions/technician.action";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { TechnicianProfile } from "@/types/api";

export default function TechnicianProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getLoginTechnicianProfile();

        if (!result.success) {
          setError(result.message || "Unable to load your profile.");
          return;
        }

        // Your API returns the actual profile inside result.data.result
        const technicianProfile = result.data?.result;

        if (technicianProfile) {
          setProfile(technicianProfile as TechnicianProfile);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Failed to load technician profile:", error);
        setError("Unable to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSuccess = () => {
    setEditing(false);
    router.refresh();
    window.location.reload();
  };

  /*
   * If the API returns "Resource not found",
   * treat that as no technician profile.
   *
   * This lets the technician see the create profile form
   * instead of an unnecessary error screen.
   */
  const hasProfile = Boolean(profile);

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="My Profile"
          description="View and manage your professional technician profile."
        />

        <SectionCard
          title="Profile Details"
          description="Loading your technician profile..."
        >
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-24 w-full" />

            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>

            <Skeleton className="h-20" />
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Profile"
        description="View and manage your professional technician profile."
      />

      {/* ================================================== */}
      {/* NO PROFILE */}
      {/* ================================================== */}

      {!hasProfile && (
        <SectionCard
          title="Create Your Technician Profile"
          description="Set up your professional profile to start receiving service bookings."
        >
          <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <UserRound className="size-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              No technician profile found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Create your technician profile by adding your professional
              information, skills, service areas, and availability.
            </p>

            <div className="mt-8 text-left">
              {error && (
                <Alert className="mb-6">
                  <AlertCircle className="size-4" />
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* 
                CREATE FORM

                This form should contain:
                - Bio
                - Skills
                - Years of experience
                - Service areas
                - Availability

                The create action submits all of them together.
              */}
              <TechnicianProfileForm
                mode="create"
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </SectionCard>
      )}

      {/* ================================================== */}
      {/* EXISTING PROFILE */}
      {/* ================================================== */}

      {hasProfile && profile && (
        <>
          {/* Verification Status */}
          <SectionCard
            title="Verification Status"
            description="Your current technician profile verification status."
          >
            <div className="space-y-3">
              <TechnicianVerificationBadge status={profile.status} />

              {profile.status === "PENDING" && (
                <p className="text-sm text-muted-foreground">
                  Your profile has been submitted and is waiting for admin
                  verification.
                </p>
              )}

              {profile.status === "VERIFIED" && (
                <p className="text-sm text-muted-foreground">
                  Your profile has been verified and is visible to customers.
                </p>
              )}

              {profile.status === "SUSPENDED" && (
                <p className="text-sm text-destructive">
                  Your technician profile is currently suspended.
                </p>
              )}
            </div>
          </SectionCard>

          {/* Profile Details */}
          <SectionCard
            title="Profile Details"
            description={
              editing
                ? "Update your professional information."
                : "View your professional information."
            }
          >
            {editing ? (
              /*
               * EDIT MODE
               *
               * IMPORTANT:
               * Availability is NOT included here.
               *
               * Availability has its own page/form.
               */
              <TechnicianProfileForm
                mode="edit"
                initialData={profile}
                onSuccess={handleSuccess}
              />
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Professional Profile
                    </p>

                    <h3 className="mt-1 text-xl font-semibold">
                      Technician Information
                    </h3>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditing(true)}
                  >
                    <Pencil className="mr-2 size-4" />
                    Edit Profile
                  </Button>
                </div>

                {/* Experience / Dates */}
                <div className="grid gap-4 md:grid-cols-2">
                  <ProfileInfo
                    icon={<BriefcaseBusiness className="size-4" />}
                    label="Experience"
                    value={
                      profile.yearsOfExperience !== undefined &&
                      profile.yearsOfExperience !== null
                        ? `${profile.yearsOfExperience} years`
                        : "Not added"
                    }
                  />

                  <ProfileInfo
                    icon={<CalendarDays className="size-4" />}
                    label="Created At"
                    value={formatDateTime(profile.createdAt)}
                  />

                  <ProfileInfo
                    icon={<CalendarDays className="size-4" />}
                    label="Updated At"
                    value={formatDateTime(profile.updatedAt)}
                  />
                </div>

                {/* Skills */}
                <div className="rounded-xl border bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Skills
                  </p>

                  {profile.skills?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border bg-muted px-3 py-1 text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No skills added.
                    </p>
                  )}
                </div>

                {/* Service Areas */}
                <div className="rounded-xl border bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Service Areas
                  </p>

                  {profile.serviceArea?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {profile.serviceArea.map((area) => (
                        <span
                          key={area}
                          className="rounded-full border bg-muted px-3 py-1 text-sm"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No service areas added.
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="rounded-xl border bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Professional Bio
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {profile.bio || "No bio added."}
                  </p>
                </div>
              </div>
            )}
          </SectionCard>
        </>
      )}
    </div>
  );
}

function ProfileInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}

        <p className="text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-2 text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}

