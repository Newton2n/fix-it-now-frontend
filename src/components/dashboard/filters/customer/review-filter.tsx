"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";

import FilterBar from "../filter-bar";
import SearchInput from "../search-input";
import SortFilter from "../sort-filter";
import ClearFilters from "../clear-filter";
import DashboardPagination from "../pagination/dashboard-pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sortOptions = [
  { label: "Created date", value: "createdAt" },
  { label: "Rating", value: "rating" },
];

interface ReviewFiltersProps {
  currentPage: number;
  totalPage: number;
}

export default function ReviewFilters({
  currentPage,
  totalPage,
}: ReviewFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateQuery = useCallback(
    (next: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(next).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const newParams = params.toString();
      const query = newParams ? `?${newParams}` : "";
      router.push(`${window.location.pathname}${query}`, { scroll: false });
    },
    [router, searchParams],
  );

  const currentMin = searchParams.get("minRating");
  const currentMax = searchParams.get("maxRating");

  const handleMinClick = (value: number) => {
    const v = String(value);
    const next = currentMin === v ? null : v;
    updateQuery({ minRating: next });
  };

  const handleMaxClick = (value: number) => {
    const v = String(value);
    const next = currentMax === v ? null : v;
    updateQuery({ maxRating: next });
  };

  return (
    <div className="space-y-4">
      <FilterBar>
        {/* Search */}
        <div className="min-w-[200px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Search
          </p>
          <SearchInput placeholder="Search reviews..." param="search" />
        </div>

        {/* Min rating – classic star row */}
        <div className="min-w-[220px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Min rating
          </p>
          <div className="flex items-center gap-1 rounded-md border bg-background px-2 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = currentMin !== null && star <= Number(currentMin);
              return (
                <button
                  key={`min-${star}`}
                  type="button"
                  onClick={() => handleMinClick(star)}
                  className="rounded-md p-0.5 transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`Min rating ${star} stars`}
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      active
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground",
                    )}
                  />
                </button>
              );
            })}

            {currentMin && (
              <span className="ml-2 text-xs text-muted-foreground">
                {currentMin}+
              </span>
            )}
          </div>
        </div>

        {/* Max rating – classic star row */}
        <div className="min-w-[220px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Max rating
          </p>
          <div className="flex items-center gap-1 rounded-md border bg-background px-2 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = currentMax !== null && star <= Number(currentMax);
              return (
                <button
                  key={`max-${star}`}
                  type="button"
                  onClick={() => handleMaxClick(star)}
                  className="rounded-md p-0.5 transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`Max rating ${star} stars`}
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      active
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground",
                    )}
                  />
                </button>
              );
            })}

            {currentMax && (
              <span className="ml-2 text-xs text-muted-foreground">
                ≤ {currentMax}
              </span>
            )}
          </div>
        </div>

        {/* Sort */}
        <div className="min-w-[160px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Sort by
          </p>
          <SortFilter options={sortOptions} />
        </div>

        {/* Clear all */}
        <div className="min-w-[120px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Filters
          </p>
          <ClearFilters />
        </div>
      </FilterBar>

      {/* Pagination */}
      <DashboardPagination currentPage={currentPage} totalPage={totalPage} />
    </div>
  );
}
