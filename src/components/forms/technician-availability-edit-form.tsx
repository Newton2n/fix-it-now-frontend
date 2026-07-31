"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Clock3 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  updateTechnicianAvailability,
} from "@/actions/technician.action";

export type AvailabilityDay = {
  start: string;
  end: string;
};

export type Availability = Record<string, AvailabilityDay>;

type TechnicianAvailabilityEditFormProps = {
  initialAvailability?: Availability;
  onSuccess?: () => void;
};

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
];

const TIME_OPTIONS = Array.from({ length: 25 }, (_, index) => {
  return `${String(index).padStart(2, "0")}:00`;
});

const DEFAULT_START = "09:00";
const DEFAULT_END = "17:00";

export function TechnicianAvailabilityEditForm({
  initialAvailability = {},
  onSuccess,
}: TechnicianAvailabilityEditFormProps) {
  const [availability, setAvailability] =
    useState<Availability>(initialAvailability);

  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setAvailability(initialAvailability);
  }, [initialAvailability]);

  const updateDay = (
    day: string,
    value: AvailabilityDay,
  ) => {
    setAvailability((previous) => ({
      ...previous,
      [day]: value,
    }));
  };

  const toggleDay = (
    day: string,
    checked: boolean,
  ) => {
    if (checked) {
      setAvailability((previous) => ({
        ...previous,
        [day]: {
          start: DEFAULT_START,
          end: DEFAULT_END,
        },
      }));

      return;
    }

    setAvailability((previous) => {
      const updated = { ...previous };

      delete updated[day];

      return updated;
    });
  };

  const handleSubmit = async () => {
    setIsPending(true);

    try {
      const result =
        await updateTechnicianAvailability(availability);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(
        result.message ||
          "Availability updated successfully.",
      );

      onSuccess?.();
    } catch (error) {
      console.error(
        "Update availability error:",
        error,
      );

      toast.error(
        "Unable to update availability. Please try again.",
      );
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
              <h3 className="text-lg font-semibold">
                Weekly Availability
              </h3>

              <p className="text-sm text-muted-foreground">
                Choose when customers can book your services.
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
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`edit-${day.key}`}
                      checked={Boolean(selected)}
                      onCheckedChange={(checked) =>
                        toggleDay(
                          day.key,
                          checked === true,
                        )
                      }
                    />

                    <Label
                      htmlFor={`edit-${day.key}`}
                      className="cursor-pointer font-medium"
                    >
                      {day.label}
                    </Label>
                  </div>

                  {selected ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Start time
                        </Label>

                        <Select
                          value={selected.start}
                          onValueChange={(start) =>
                            updateDay(day.key, {
                              ...selected,
                              start,
                            })
                          }
                        >
                          <SelectTrigger className="w-full sm:w-32">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            {TIME_OPTIONS.map(
                              (time) => (
                                <SelectItem
                                  key={time}
                                  value={time}
                                >
                                  {time}
                                </SelectItem>
                              ),
                            )}
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
                            updateDay(day.key, {
                              ...selected,
                              end,
                            })
                          }
                        >
                          <SelectTrigger className="w-full sm:w-32">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            {TIME_OPTIONS.map(
                              (time) => (
                                <SelectItem
                                  key={time}
                                  value={time}
                                >
                                  {time}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not available
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Unchecked days will not be available for customer
          bookings.
        </p>
      </Card>

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

          {isPending
            ? "Saving..."
            : "Save Availability"}
        </Button>
      </div>
    </div>
  );
}