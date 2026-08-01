"use client";

import { useState } from "react";
import { Clock3, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { updateTechnicianAvailability } from "@/actions/technician.action";
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
import type { TChangeAvailabilityPayload } from "@/types/technician";

type AvailabilityDay = {
  start: string;
  end: string;
};

type AvailabilityMap = TChangeAvailabilityPayload["availability"];

type TechnicianAvailabilityFormProps = {
  value?: AvailabilityMap;
  initialAvailability?: AvailabilityMap;
  onChange?: (availability: AvailabilityMap) => void;
  onSuccess?: () => void;
  submitMode?: "change" | "update";
};

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const;

const TIME_OPTIONS = Array.from({ length: 25 }, (_, index) =>
  `${String(index).padStart(2, "0")}:00`,
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
  const [availability, setAvailability] = useState<AvailabilityMap>(
    submitMode === "update" ? initialAvailability : value,
  );
  const [isPending, setIsPending] = useState(false);

  const syncChangeMode = (next: AvailabilityMap) => {
    setAvailability(next);
    if (submitMode === "change") {
      onChange?.(next);
    }
  };

  const updateAvailability = (
    day: keyof AvailabilityMap,
    data: AvailabilityDay,
  ) => {
    const next = {
      ...availability,
      [day]: data,
    };

    syncChangeMode(next);
  };

  const toggleDay = (day: keyof AvailabilityMap, checked: boolean) => {
    const next = { ...availability };

    if (checked) {
      next[day] = {
        start: DEFAULT_START,
        end: DEFAULT_END,
      };
    } else {
      delete next[day];
    }

    syncChangeMode(next);
  };

  const handleSubmit = async () => {
    if (submitMode !== "update") return;

    setIsPending(true);
    try {
      const payload: TChangeAvailabilityPayload = {
        availability,
      };

      const result = await updateTechnicianAvailability(payload);

      if (!result.success) {
        toast.error(result.message || "Unable to update availability.");
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
        <div className="mb-6 flex items-start gap-3">
          <Clock3 className="mt-1 size-5 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Weekly Availability</h3>
            <p className="text-sm text-muted-foreground">
              Choose the days and hours when customers can book your services.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {DAYS.map((day) => {
            const selected = availability[day.key];

            return (
              <div key={day.key} className="rounded-xl border bg-background p-4">
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
                      <TimeSelect
                        label="Start time"
                        value={selected.start}
                        onChange={(start) =>
                          updateAvailability(day.key, {
                            ...selected,
                            start,
                          })
                        }
                      />
                      <TimeSelect
                        label="End time"
                        value={selected.end}
                        onChange={(end) =>
                          updateAvailability(day.key, {
                            ...selected,
                            end,
                          })
                        }
                      />
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
          Days you leave unchecked will not be included in your availability.
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

function TimeSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
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
  );
}