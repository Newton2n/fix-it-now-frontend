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

  const [draftMin, setDraftMin] = useState(minValue);
  const [draftMax, setDraftMax] = useState(maxValue);

  const [isPending, startTransition] = useTransition();

  // Sync draft with URL when it changes from outside (back/forward, other filters)
  useEffect(() => {
    if (minValue !== draftMin) {
      setDraftMin(minValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minValue]);

  useEffect(() => {
    if (maxValue !== draftMax) {
      setDraftMax(maxValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxValue]);

  // Debounced update for min
  useEffect(() => {
    const timer = setTimeout(() => {
      if (draftMin === minValue) return;

      const num = Number(draftMin);
      const params = new URLSearchParams(searchParams);

      if (draftMin && !Number.isNaN(num) && num >= 0) {
        params.set(minParam, draftMin);
      } else {
        params.delete(minParam);
      }

      params.set("page", "1");

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [draftMin, minValue, minParam, pathname, router, searchParams]);

  // Debounced update for max
  useEffect(() => {
    const timer = setTimeout(() => {
      if (draftMax === maxValue) return;

      const num = Number(draftMax);
      const params = new URLSearchParams(searchParams);

      if (draftMax && !Number.isNaN(num) && num >= 0) {
        params.set(maxParam, draftMax);
      } else {
        params.delete(maxParam);
      }

      params.set("page", "1");

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [draftMax, maxValue, maxParam, pathname, router, searchParams]);

  return (
    <div className="flex w-full gap-2 lg:w-auto">
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={draftMin}
        onChange={(e) => setDraftMin(e.target.value)}
        placeholder={minPlaceholder}
        className="w-full cursor-pointer lg:max-w-[112px]"
        disabled={isPending}
      />

      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={draftMax}
        onChange={(e) => setDraftMax(e.target.value)}
        placeholder={maxPlaceholder}
        className="w-full cursor-pointer lg:max-w-[112px]"
        disabled={isPending}
      />
    </div>
  );
}
