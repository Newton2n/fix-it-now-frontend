
"use client";

import { CalendarDays } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

interface DateRangeFilterProps {
  startParam?: string;
  endParam?: string;
}

export default function DateRangeFilter({
  startParam = "startDate",
  endParam = "endDate",
}: DateRangeFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const startValue = searchParams.get(startParam) ?? "";
  const endValue = searchParams.get(endParam) ?? "";

  function updateParam(param: string, value: string) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }

    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
      {/* Start date */}
      <div className="relative flex-1">
        <label
          htmlFor="start-date"
          className="mb-1 block text-xs font-medium text-muted-foreground"
        >
          Start date
        </label>
        <div className="relative">
          <CalendarDays className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="start-date"
            type="date"
            value={startValue}
            onChange={(event) =>
              updateParam(startParam, event.target.value)
            }
            className="pl-9"
          />
        </div>
      </div>

      {/* End date */}
      <div className="relative flex-1">
        <label
          htmlFor="end-date"
          className="mb-1 block text-xs font-medium text-muted-foreground"
        >
          End date
        </label>
        <div className="relative">
          <CalendarDays className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="end-date"
            type="date"
            value={endValue}
            onChange={(event) =>
              updateParam(endParam, event.target.value)
            }
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}