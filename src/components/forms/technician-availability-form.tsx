"use client";

import { useState } from "react";
import { Clock3 } from "lucide-react";

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

export type AvailabilityDay = {
  start: string;
  end: string;
};

export type Availability = Record<string, AvailabilityDay>;

type TechnicianAvailabilityFormProps = {
  value?: Availability;
  onChange: (availability: Availability) => void;
};

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
];

const TIME_OPTIONS = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "24:00",
];

const DEFAULT_START = "09:00";
const DEFAULT_END = "17:00";

export function TechnicianAvailabilityForm({
  value = {},
  onChange,
}: TechnicianAvailabilityFormProps) {
  const [availability, setAvailability] = useState<Availability>(value);

  const isAvailable = (day: string) => {
    return Boolean(availability[day]);
  };

  const updateAvailability = (day: string, data: AvailabilityDay) => {
    const updated = {
      ...availability,
      [day]: data,
    };

    setAvailability(updated);
    onChange(updated);
  };

  const toggleDay = (day: string, checked: boolean) => {
    if (checked) {
      updateAvailability(day, {
        start: DEFAULT_START,
        end: DEFAULT_END,
      });

      return;
    }

    const updated = { ...availability };
    delete updated[day];

    setAvailability(updated);
    onChange(updated);
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Clock3 className="size-5 text-muted-foreground" />

          <h3 className="text-lg font-semibold">Availability</h3>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Select the days and hours when customers can book your services.
        </p>
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
                    checked={isAvailable(day.key)}
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

                {selected && (
                  <div className="grid grid-cols-2 gap-3 sm:w-auto">
                    <div className="space-y-1">
                      <Label
                        htmlFor={`${day.key}-start`}
                        className="text-xs text-muted-foreground"
                      >
                        Start
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
                        <SelectTrigger
                          id={`${day.key}-start`}
                          className="w-full sm:w-32"
                        >
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
                      <Label
                        htmlFor={`${day.key}-end`}
                        className="text-xs text-muted-foreground"
                      >
                        End
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
                        <SelectTrigger
                          id={`${day.key}-end`}
                          className="w-full sm:w-32"
                        >
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
                )}
              </div>

              {!selected && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Not available for bookings.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        You can select as many days as you need. Days you leave unchecked will
        not be included in your availability.
      </p>
    </Card>
  );
}
