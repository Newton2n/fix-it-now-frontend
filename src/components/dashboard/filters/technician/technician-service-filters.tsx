"use client";

import ClearFilters from "../clear-filter";
import FilterBar from "../filter-bar";
import NumberRangeFilter from "../number-range-filter";
import SelectFilter from "../search-filter";
import SearchInput from "../search-input";
import SortFilter from "../sort-filter";
import DashboardPagination from "../pagination/dashboard-pagination";

import type { Category } from "@/types/category";

interface TechnicianServiceFiltersProps {
  currentPage: number;
  totalPage: number;
  categories: Category[];
}

const availabilityOptions = [
  { label: "Available", value: "true" },
  { label: "Unavailable", value: "false" },
];

const sortOptions = [
  { label: "Created date", value: "date" },
  { label: "Price", value: "price" },
];

export default function TechnicianServiceFilters({
  currentPage,
  totalPage,
  categories,
}: TechnicianServiceFiltersProps) {
  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <div className="space-y-4">
      <FilterBar>
        {/* Search */}
        <div className="min-w-[200px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Search
          </p>
          <SearchInput placeholder="Search services..." param="search" />
        </div>

        {/* Category */}
        <div className="min-w-[160px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Category
          </p>
          <SelectFilter
            param="categoryId"
            placeholder="All categories"
            options={categoryOptions}
          />
        </div>

        {/* Availability */}
        <div className="min-w-[160px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Availability
          </p>
          <SelectFilter
            param="isAvailable"
            placeholder="All"
            options={availabilityOptions}
          />
        </div>

        {/* Price range */}
        <div className="min-w-[220px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Price
          </p>
          <NumberRangeFilter
            minParam="minPrice"
            maxParam="maxPrice"
            minPlaceholder="Min"
            maxPlaceholder="Max"
            min={0}
            step={0.01}
          />
        </div>

        {/* Sort */}
        <div className="min-w-[160px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Sort by
          </p>
          <SortFilter options={sortOptions} />
        </div>

        {/* Clear */}
        <div className="min-w-[120px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Filters
          </p>
          <ClearFilters />
        </div>
      </FilterBar>

      <DashboardPagination currentPage={currentPage} totalPage={totalPage} />
    </div>
  );
}
