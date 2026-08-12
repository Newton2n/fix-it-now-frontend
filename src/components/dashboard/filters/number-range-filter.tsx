"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  step = 1,
}: NumberRangeFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const minValue = searchParams.get(minParam) ?? "";
  const maxValue = searchParams.get(maxParam) ?? "";

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
    <div className="flex w-full gap-2 lg:w-auto">
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={(event) =>
          updateParam(minParam, event.target.value)
        }
        placeholder={minPlaceholder}
        className="w-full lg:w-28"
      />

      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={(event) =>
          updateParam(maxParam, event.target.value)
        }
        placeholder={maxPlaceholder}
        className="w-full lg:w-28"
      />
    </div>
  );
}