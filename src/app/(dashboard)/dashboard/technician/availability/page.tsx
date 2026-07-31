
"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Pencil, UserPlus } from "lucide-react";
import Link from "next/link";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { getLoginTechnicianProfile } from "@/actions/technician.action";

import {
  TechnicianAvailabilityEditForm,
  type Availability,
} from "@/components/forms/technician-availability-edit-form";

import type { TechnicianProfile } from "@/types/api";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function TechnicianAvailabilityPage() {
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const result = await getLoginTechnicianProfile();

        if (cancelled) return;

        /*
         * IMPORTANT:
         *
         * "Resource not found." means the technician
         * does not have a profile yet.
         *
         * It is NOT a page error.
         */
        if (!result.success) {
          const message = result.message?.toLowerCase() || "";

          if (
            message.includes("resource not found") ||
            message.includes("technician profile not found") ||
            message.includes("profile not found")
          ) {
            setProfile(null);
            setError(null);
            return;
          }

          setError(
            result.message || "Unable to load your technician profile.",
          );

          return;
        }

        /*
         * Your real profile is inside:
         *
         * result.data.result
         */
        const technicianProfile = result.data?.result;

        if (!technicianProfile) {
          setProfile(null);
          setError(null);
          return;
        }

        setProfile(technicianProfile as TechnicianProfile);
        setError(null);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load technician profile:", error);

        setError("Unable to load your technician profile.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Availability"
          description="Manage the days and hours when customers can book your services."
        />

        <SectionCard
          title="Weekly Availability"
          description="Loading your schedule..."
        >
          <div className="space-y-3">
            {DAYS.map((day) => (
              <Skeleton
                key={day}
                className="h-20 w-full"
              />
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  /*
   * Real error
   *
   * Resource not found is NOT handled here.
   * It is handled above as "no profile".
   */
  if (error) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Availability"
          description="Manage the days and hours when customers can book your services."
        />

        <SectionCard
          title="Unable to load availability"
          description="Something went wrong while loading your technician profile."
        >
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>

          <div className="mt-4">
            <Button
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </SectionCard>
      </div>
    );
  }

  /*
   * NO TECHNICIAN PROFILE
   *
   * This is the important part.
   *
   * If the API returned "Resource not found.",
   * the technician comes here instead of seeing
   * an error.
   */
  if (!profile) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Availability"
          description="Manage the days and hours when customers can book your services."
        />

        <SectionCard
          title="Technician Profile Required"
          description="Create your technician profile before setting your availability."
        >
          <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
              <CalendarClock className="size-7 text-muted-foreground" />
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Create your technician profile first
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              You don't have a technician profile yet. Create your profile
              first, then you can set the days and hours when customers can
              book your services.
            </p>

            <div className="mt-6">
              <Button asChild>
                <Link href="/dashboard/technician/profile">
                  <UserPlus className="mr-2 size-4" />
                  Create Technician Profile
                </Link>
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }

  /*
   * Existing technician profile
   */
  const availability =
    (profile.availability as Availability | undefined) ?? {};

  const hasAvailability =
    Object.keys(availability).length > 0;

  /*
   * EDIT AVAILABILITY
   */
  if (editing) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Edit Availability"
          description="Update the days and hours when customers can book your services."
        />

        <SectionCard
          title="Weekly Availability"
          description="Choose the days you work and set your working hours."
        >
          <TechnicianAvailabilityEditForm
            initialAvailability={availability}
            onSuccess={() => {
              setEditing(false);
              window.location.reload();
            }}
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </SectionCard>
      </div>
    );
  }

  /*
   * EXISTING PROFILE
   */
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Availability"
        description="Manage the days and hours when customers can book your services."
      />

      <SectionCard
        title="Weekly Availability"
        description={
          hasAvailability
            ? "Your current working schedule."
            : "You have not configured your working schedule yet."
        }
      >
        {hasAvailability ? (
          <div className="space-y-5">
            <AvailabilitySummary
              availability={availability}
            />

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setEditing(true)}
              >
                <Pencil className="mr-2 size-4" />
                Edit Availability
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-14 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <CalendarClock className="size-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              No availability set yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Your technician profile exists, but you haven't selected any
              working days or hours yet. Set your availability so customers
              know when they can book you.
            </p>

            <div className="mt-6">
              <Button
                type="button"
                onClick={() => setEditing(true)}
              >
                <CalendarClock className="mr-2 size-4" />
                Set Availability
              </Button>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ---------------------------------- */
/* Availability Summary               */
/* ---------------------------------- */

function AvailabilitySummary({
  availability,
}: {
  availability: Availability;
}) {
  return (
    <div className="space-y-3">
      {DAYS.map((day) => {
        const schedule = availability[day];

        return (
          <div
            key={day}
            className="flex items-center justify-between rounded-xl border bg-background p-4"
          >
            <div>
              <p className="font-medium capitalize">
                {day}
              </p>

              {!schedule && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Not available
                </p>
              )}
            </div>

            {schedule && (
              <div className="text-right">
                <p className="text-sm font-medium">
                  {schedule.start} - {schedule.end}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Available for bookings
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

