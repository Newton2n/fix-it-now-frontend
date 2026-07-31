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
  TechnicianAvailabilityForm,
  type Availability,
} from "@/components/forms/technician-availability-form";

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

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getLoginTechnicianProfile();

      // Treat "Resource not found." as "no profile" instead of an error.
      if (!result.success) {
        if (result.message?.toLowerCase().includes("resource not found")) {
          setProfile(null);
          return;
        }

        setError(result.message || "Unable to load your technician profile.");
        return;
      }

      const technicianProfile = result.data?.result;

      if (!technicianProfile) {
        setProfile(null);
        return;
      }

      setProfile(technicianProfile as TechnicianProfile);
    } catch (error) {
      console.error("Failed to load technician profile:", error);

      setError("Unable to load your technician profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getLoginTechnicianProfile();

        if (cancelled) return;

        if (!result.success) {
          // No profile is a valid application state, not an availability-page error.
          if (result.message?.toLowerCase().includes("resource not found")) {
            setProfile(null);
            return;
          }

          setError(
            result.message || "Unable to load your technician profile.",
          );
          return;
        }

        const technicianProfile = result.data?.result;

        if (!technicianProfile) {
          setProfile(null);
          return;
        }

        setProfile(technicianProfile as TechnicianProfile);
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

  // Loading
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
              <Skeleton key={day} className="h-20 w-full" />
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  // Real error
  if (error) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Availability"
          description="Manage the days and hours when customers can book your services."
        />

        <SectionCard title="Unable to load availability">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="mt-4">
            <Button onClick={loadProfile}>Try Again</Button>
          </div>
        </SectionCard>
      </div>
    );
  }

  // No technician profile
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
          <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-14 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <CalendarClock className="size-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Create your technician profile first
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Your availability is connected to your technician profile. Create
              your profile first, then you can set the days and hours when
              customers can book you.
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

  const availability = (profile.availability as Availability) || {};
  const hasAvailability = Object.keys(availability).length > 0;

  // Editing existing availability
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
          <TechnicianAvailabilityForm
            initialAvailability={availability}
            submitMode="update"
            onSuccess={async () => {
              setEditing(false);
              await loadProfile();
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

  // Profile exists but availability doesn't.
  if (!hasAvailability) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Availability"
          description="Manage the days and hours when customers can book your services."
        />

        <SectionCard
          title="Set Your Availability"
          description="Your technician profile exists, but no working schedule has been configured yet."
        >
          <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-14 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <CalendarClock className="size-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Your schedule is not set yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Choose the days and hours when customers can book your services.
              You can change this schedule whenever your working hours change.
            </p>

            <div className="mt-6">
              <Button onClick={() => setEditing(true)}>
                <CalendarClock className="mr-2 size-4" />
                Set Availability
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }

  // Profile + availability exists.
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Availability"
        description="Manage the days and hours when customers can book your services."
      />

      <SectionCard title="Weekly Availability" description="Your current working schedule.">
        <div className="space-y-3">
          {DAYS.map((day) => {
            const schedule = availability[day];

            return (
              <div
                key={day}
                className="flex items-center justify-between rounded-xl border bg-background p-4"
              >
                <div>
                  <p className="font-medium capitalize">{day}</p>

                  {!schedule && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Not available
                    </p>
                  )}
                </div>

                {schedule && (
                  <p className="text-sm font-medium">
                    {schedule.start} - {schedule.end}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={() => setEditing(true)}>
            <Pencil className="mr-2 size-4" />
            Edit Availability
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}