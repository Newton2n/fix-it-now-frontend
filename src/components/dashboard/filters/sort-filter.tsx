"use client";

import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortOption {
  label: string;
  value: string;
}

interface SortFilterProps {
  options: SortOption[];
}

export default function SortFilter({ options }: SortFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortBy = searchParams.get("sortBy") ?? options[0]?.value ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";

  function updateParam(param: string, value: string) {
    const params = new URLSearchParams(searchParams);

    params.set(param, value);
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex w-full gap-2 lg:w-auto">
      {/* Sort by */}
      <Select value={sortBy} onValueChange={(value) => updateParam("sortBy", value)}>
        <SelectTrigger className="w-full cursor-pointer lg:max-w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span className="line-clamp-2 break-words cursor-pointer">{option.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort order */}
      <Select
        value={sortOrder}
        onValueChange={(value) => updateParam("sortOrder", value)}
      >
        <SelectTrigger className="w-full cursor-pointer lg:max-w-[140px]">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="desc">
            <span className="flex items-center gap-2">
              <ArrowDownAZ className="size-4 shrink-0" />
              <span className="whitespace-nowrap cursor-pointer">Descending</span>
            </span>
          </SelectItem>

          <SelectItem value="asc">
            <span className="flex items-center gap-2">
              <ArrowUpAZ className="size-4 shrink-0" />
              <span className="whitespace-nowrap cursor-pointer">Ascending</span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}