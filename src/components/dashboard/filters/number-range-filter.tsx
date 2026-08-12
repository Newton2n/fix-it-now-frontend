"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";

interface NumberRangeFilterProps {
  minParam: string;
  maxParam: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export default function NumberRangeFilter({
  minParam,
  maxParam,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  min,
  max,
  step = 0.01,
}: NumberRangeFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const minValue = searchParams.get(minParam) ?? "";
  const maxValue = searchParams.get(maxParam) ?? "";

  const [localMin, setLocalMin] = useState(minValue);
  const [localMax, setLocalMax] = useState(maxValue);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLocalMin(minValue);
  }, [minValue]);

  useEffect(() => {
    setLocalMax(maxValue);
  }, [maxValue]);

  // Debounced update for min
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localMin === minValue) {
        return;
      }

      const num = Number(localMin);
      const params = new URLSearchParams(searchParams);

      if (localMin && !Number.isNaN(num) && num >= 0) {
        params.set(minParam, localMin);
      } else {
        params.delete(minParam);
      }

      params.set("page", "1");

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [localMin, minValue, minParam, pathname, router, searchParams]);

  // Debounced update for max
  useEffect(() => {
    const timer = setTimeout(() => {
      // Don't navigate if local value matches URL
      if (localMax === maxValue) {
        return;
      }

      const num = Number(localMax);
      const params = new URLSearchParams(searchParams);

      if (localMax && !Number.isNaN(num) && num >= 0) {
        params.set(maxParam, localMax);
      } else {
        params.delete(maxParam);
      }

      params.set("page", "1");

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [localMax, maxValue, maxParam, pathname, router, searchParams]);

  return (
    <div className="flex w-full gap-2 lg:w-auto">
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={localMin}
        onChange={(e) => setLocalMin(e.target.value)}
        placeholder={minPlaceholder}
        className="w-full lg:w-28"
        // disabled={isPending}
      />

      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={localMax}
        onChange={(e) => setLocalMax(e.target.value)}
        placeholder={maxPlaceholder}
        className="w-full lg:w-28"
        // disabled={isPending}
      />
    </div>
  );
}
