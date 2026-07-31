"use client";

import { useEffect, useState } from "react";
import { Clock3, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateTechnicianAvailability } from "@/actions/technician.action";

export type AvailabilityDay = {
  start: string;
  end: string;
};

export type Availability = Record<string, AvailabilityDay>;

type TechnicianAvailabilityFormProps = {
  // Used when creating a technician profile.
  // The parent receives the availability through onChange.
  value?: Availability;

  // Used when editing availability from the availability page.
  initialAvailability?: Availability;

  // Used during profile creation.
  // No API call is made here.
  onChange?: (availability: Availability) => void;

  // Used during standalone availability editing.
  // Calls updateTechnicianAvailability().
  onSuccess?: () => void;

  // If true, the form saves availability directly.
  // If false, it only sends the value to the parent.
  submitMode?: "change" | "update";
};

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
];

const TIME_OPTIONS = Array.from(
  { length: 25 },
  (_, index) => `${String(index).padStart(2, "0")}:00`,
);

const DEFAULT_START = "09:00";
const DEFAULT_END = "17:00";

export function TechnicianAvailabilityForm({
  value = {},
  initialAvailability = {},
  onChange,
  onSuccess,
  submitMode = "change",
}: TechnicianAvailabilityFormProps) {
  const [availability, setAvailability] = useState<Availability>(
    submitMode === "update" ? initialAvailability : value,
  );

  const [isPending, setIsPending] = useState(false);

  // Only sync incoming values when the form is used in update mode.
  // This helps keep the page in sync after saving and reloading data.
  useEffect(() => {
    if (submitMode === "update") {
      setAvailability(initialAvailability);
    }
  }, [initialAvailability, submitMode]);

  const updateAvailability = (day: string, data: AvailabilityDay) => {
    setAvailability((previous) => {
      const updated = {
        ...previous,
        [day]: data,
      };

      if (submitMode === "change") {
        onChange?.(updated);
      }

      return updated;
    });
  };

  const toggleDay = (day: string, checked: boolean) => {
    setAvailability((previous) => {
      if (checked) {
        const updated = {
          ...previous,
          [day]: {
            start: DEFAULT_START,
            end: DEFAULT_END,
          },
        };

        if (submitMode === "change") {
          onChange?.(updated);
        }

        return updated;
      }

      const updated = { ...previous };

      delete updated[day];

      if (submitMode === "change") {
        onChange?.(updated);
      }

      return updated;
    });
  };

  const handleSubmit = async () => {
    if (submitMode !== "update") {
      return;
    }

    setIsPending(true);

    try {
      const result = await updateTechnicianAvailability(availability);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message || "Availability updated successfully.");

      onSuccess?.();
    } catch (error) {
      console.error("Update availability error:", error);

      toast.error("Unable to update availability. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Clock3 className="size-5 text-muted-foreground" />

            <div>
              <h3 className="text-lg font-semibold">Weekly Availability</h3>

              <p className="text-sm text-muted-foreground">
                Select the days and hours when customers can book your services.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {DAYS.map((day) => {
            const selected = availability[day.key];

            return (
              <div
                key={day.key}
                className="rounded-xl border bg-background p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`availability-${day.key}`}
                      checked={Boolean(selected)}
                      onCheckedChange={(checked) =>
                        toggleDay(day.key, checked === true)
                      }
                    />

                    <Label
                      htmlFor={`availability-${day.key}`}
                      className="cursor-pointer text-sm font-medium"
                    >
                      {day.label}
                    </Label>
                  </div>

                  {selected ? (
                    <div className="grid grid-cols-2 gap-3 sm:w-auto">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Start time
                        </Label>

                        <Select
                          value={selected.start}
                          onValueChange={(start) =>
                            updateAvailability(day.key, {
                              ...selected,
                              start,
                            })
                          }
                        >
                          <SelectTrigger className="w-full sm:w-32">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            {TIME_OPTIONS.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          End time
                        </Label>

                        <Select
                          value={selected.end}
                          onValueChange={(end) =>
                            updateAvailability(day.key, {
                              ...selected,
                              end,
                            })
                          }
                        >
                          <SelectTrigger className="w-full sm:w-32">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            {TIME_OPTIONS.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not available for bookings
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Unchecked days will not be included in your availability.
        </p>
      </Card>

      {submitMode === "update" && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}

            {isPending ? "Saving..." : "Save Availability"}
          </Button>
        </div>
      )}
    </div>
  );
}
