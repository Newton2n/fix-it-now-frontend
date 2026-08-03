"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

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

type Category = {
  id: string;
  name: string;
};

type ServiceSearchFiltersProps = {
  categories: Category[];
  defaultValues: {
    search: string;
    categoryId: string;
    minPrice: string;
    maxPrice: string;
    isAvailable: string;
    sortBy: "price" | "date";
    sortOrder: "asc" | "desc";
  };
};

export default function ServiceSearchFilters({
  categories,
  defaultValues,
}: ServiceSearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [search, setSearch] = useState(defaultValues.search);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearch(defaultValues.search);
  }, [defaultValues.search]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const updateParams = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset pagination whenever filters change.
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearch(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updateParams("search", value.trim());
    }, 500);
  };

  const clearSearch = () => {
    setSearch("");

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    updateParams("search");
  };

  const clearFilters = () => {
    setSearch("");

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    router.replace(pathname);
  };

  const activeFilterCount =
    Number(Boolean(defaultValues.categoryId)) +
    Number(Boolean(defaultValues.minPrice)) +
    Number(Boolean(defaultValues.maxPrice)) +
    Number(Boolean(defaultValues.isAvailable));

  const hasFilters =
    Boolean(defaultValues.search) ||
    activeFilterCount > 0 ||
    defaultValues.sortBy !== "date" ||
    defaultValues.sortOrder !== "desc";

  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      {/* Search header */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search input */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <Input
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search services..."
              aria-label="Search services"
              className="h-11 pl-9 pr-10"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Mobile filter button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters((current) => !current)}
            className="h-11 w-full sm:w-auto"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="mr-2 size-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`ml-2 size-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {/* Quick category filter */}
        <div className="mt-4">
          <Select
            value={defaultValues.categoryId || "all"}
            onValueChange={(value) =>
              updateParams("categoryId", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-10 w-full sm:w-64">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>

              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="border-t bg-muted/20 p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Minimum price */}
            <div className="space-y-2">
              <label htmlFor="min-price" className="text-sm font-medium">
                Minimum price
              </label>

              <Input
                id="min-price"
                type="number"
                min="0"
                placeholder="e.g. 500"
                defaultValue={defaultValues.minPrice}
                onBlur={(event) => updateParams("minPrice", event.target.value)}
                className="h-10"
              />
            </div>

            {/* Maximum price */}
            <div className="space-y-2">
              <label htmlFor="max-price" className="text-sm font-medium">
                Maximum price
              </label>

              <Input
                id="max-price"
                type="number"
                min="0"
                placeholder="e.g. 5000"
                defaultValue={defaultValues.maxPrice}
                onBlur={(event) => updateParams("maxPrice", event.target.value)}
                className="h-10"
              />
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Availability</label>

              <Select
                value={defaultValues.isAvailable || "all"}
                onValueChange={(value) =>
                  updateParams("isAvailable", value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All services</SelectItem>

                  <SelectItem value="true">Available only</SelectItem>

                  <SelectItem value="false">Unavailable only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort by</label>

              <Select
                value={defaultValues.sortBy}
                onValueChange={(value) => updateParams("sortBy", value)}
              >
                <SelectTrigger className="h-10 w-full">
                  <SlidersHorizontal className="mr-2 size-4" />
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>

                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort order */}
          <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Select
              value={defaultValues.sortOrder}
              onValueChange={(value) => updateParams("sortOrder", value)}
            >
              <SelectTrigger className="h-10 w-full sm:w-52">
                {defaultValues.sortOrder === "asc" ? (
                  <ArrowUpAZ className="mr-2 size-4" />
                ) : (
                  <ArrowDownAZ className="mr-2 size-4" />
                )}

                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>

                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                onClick={clearFilters}
                className="w-full sm:w-auto"
              >
                <X className="mr-2 size-4" />
                Clear all filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Active filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t px-4 py-3 sm:px-5">
          <span className="text-xs font-medium text-muted-foreground">
            Filters:
          </span>

          {defaultValues.categoryId && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
              Category
            </span>
          )}

          {defaultValues.minPrice && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
              Min: {defaultValues.minPrice}
            </span>
          )}

          {defaultValues.maxPrice && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
              Max: {defaultValues.maxPrice}
            </span>
          )}

          {defaultValues.isAvailable && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
              {defaultValues.isAvailable === "true"
                ? "Available"
                : "Unavailable"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
