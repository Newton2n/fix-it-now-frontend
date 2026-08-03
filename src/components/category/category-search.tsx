"use client";

import { useRef } from "react";
import { Search, X, ArrowDownAZ, ArrowUpAZ } from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CategorySearchProps = {
  defaultSearch: string;
  defaultSortBy: "name" | "createdAt";
  defaultSortOrder: "asc" | "desc";
};

export default function CategorySearch({
  defaultSearch,
  defaultSortBy,
  defaultSortOrder,
}: CategorySearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Every new search/filter starts from page 1
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updateParams("search", value.trim());
    }, 500);
  };

  const clearSearch = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    updateParams("search", "");
  };

  const clearAll = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    router.push(pathname);
  };

  const hasFilters =
    Boolean(defaultSearch) ||
    defaultSortBy !== "createdAt" ||
    defaultSortOrder !== "desc";

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          ref={searchInputRef}
          defaultValue={defaultSearch}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search categories..."
          className="h-11 pl-9 pr-10"
        />

        {defaultSearch && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid w-full gap-3 sm:grid-cols-2 sm:max-w-md">
          {/* Sort By */}
          <Select
            value={defaultSortBy}
            onValueChange={(value) =>
              updateParams("sortBy", value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="createdAt">
                Date
              </SelectItem>

              <SelectItem value="name">
                Name
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Select
            value={defaultSortOrder}
            onValueChange={(value) =>
              updateParams("sortOrder", value)
            }
          >
            <SelectTrigger className="w-full">
              {defaultSortOrder === "asc" ? (
                <ArrowUpAZ className="mr-2 size-4" />
              ) : (
                <ArrowDownAZ className="mr-2 size-4" />
              )}

              <SelectValue placeholder="Order" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="desc">
                Descending
              </SelectItem>

              <SelectItem value="asc">
                Ascending
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            onClick={clearAll}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 size-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}