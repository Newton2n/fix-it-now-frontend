"use client";

import { CalendarDays, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { format, parseISO, isValid } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  startParam?: string;
  endParam?: string;
}

function safeParseDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : undefined;
}

export default function DateRangeFilter({
  startParam = "startDate",
  endParam = "endDate",
}: DateRangeFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlStartValue = searchParams.get(startParam);
  const urlEndValue = searchParams.get(endParam);

  const [startDate, setStartDate] = useState<Date | undefined>(() =>
    safeParseDate(urlStartValue),
  );
  const [endDate, setEndDate] = useState<Date | undefined>(() =>
    safeParseDate(urlEndValue),
  );

  // Control popover open state
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const startTimerRef = useRef<NodeJS.Timeout | null>(null);
  const endTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (startTimerRef.current) clearTimeout(startTimerRef.current);
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
    };
  }, []);

  function updateParam(param: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }

    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleStartSelect(date: Date | undefined) {
    setStartDate(date);
    setIsStartOpen(false); // Close popover on selection

    const dateStr = date && isValid(date) ? format(date, "yyyy-MM-dd") : "";

    if (startTimerRef.current) clearTimeout(startTimerRef.current);
    startTimerRef.current = setTimeout(() => {
      updateParam(startParam, dateStr);
    }, 500);
  }

  function handleEndSelect(date: Date | undefined) {
    setEndDate(date);
    setIsEndOpen(false); // Close popover on selection

    const dateStr = date && isValid(date) ? format(date, "yyyy-MM-dd") : "";

    if (endTimerRef.current) clearTimeout(endTimerRef.current);
    endTimerRef.current = setTimeout(() => {
      updateParam(endParam, dateStr);
    }, 500);
  }

  return (
    <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:w-auto">
      {/* Start Date Picker */}
      <div className="relative flex-1 sm:w-44">
        <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-10 px-3",
                !startDate && "text-muted-foreground",
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">
                {startDate && isValid(startDate)
                  ? format(startDate, "PPP")
                  : "Start date"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartSelect}
              disabled={(date) => (endDate ? date > endDate : false)}
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {startDate && (
          <button
            type="button"
            onClick={() => handleStartSelect(undefined)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <span className="hidden sm:inline-block text-muted-foreground text-sm font-medium self-center">
        to
      </span>

      {/* End Date Picker */}
      <div className="relative flex-1 sm:w-44">
        <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-10 px-3",
                !endDate && "text-muted-foreground",
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">
                {endDate && isValid(endDate)
                  ? format(endDate, "PPP")
                  : "End date"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndSelect}
              disabled={(date) => (startDate ? date < startDate : false)}
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {endDate && (
          <button
            type="button"
            onClick={() => handleEndSelect(undefined)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
