"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFilterOption {
  label: string;
  value: string;
}

interface SelectFilterProps {
  param: string;
  placeholder: string;
  options: SelectFilterOption[];
  width?: string;
}

export default function SelectFilter({
  param,
  placeholder,
  options,
  width = "w-full lg:w-44",
}: SelectFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentValue = searchParams.get(param) ?? "";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete(param);
    } else {
      params.set(param, value);
    }

    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Select
      value={currentValue || "all"}
      onValueChange={handleChange}
    >
      <SelectTrigger className={width}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All</SelectItem>

        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}