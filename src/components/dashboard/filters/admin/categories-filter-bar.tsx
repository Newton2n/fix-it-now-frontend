// components/admin/categories-filter-bar.tsx
"use client";

import FilterBar from "../filter-bar";
import SearchInput from "../search-input";
import SortFilter from "../sort-filter";
import ClearFilters from "../clear-filter";
import DashboardPagination from "../pagination/dashboard-pagination";

interface CategoriesFilterBarProps {
  currentPage: number;
  totalPage: number;
}

const sortOptions = [
  { label: "Created date", value: "createdAt" },
  { label: "Name", value: "name" },
];

export default function CategoriesFilterBar({
  currentPage,
  totalPage,
}: CategoriesFilterBarProps) {
  return (
    <div className="space-y-4">
      <FilterBar>
        {/* Search */}
        <div className="min-w-[200px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Search
          </p>
          <SearchInput placeholder="Search categories..." param="search" />
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
