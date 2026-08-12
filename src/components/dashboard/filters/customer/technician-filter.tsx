"use client";

import ClearFilters from "../clear-filter";
import FilterBar from "../filter-bar";
import NumberRangeFilter from "../number-range-filter";
import SelectFilter from "../search-filter";
import SearchInput from "../search-input";
import SortFilter from "../sort-filter";
import DashboardPagination from "../pagination/dashboard-pagination";

const availabilityOptions = [
  { label: "Available", value: "true" },
  { label: "Unavailable", value: "false" },
];

const statusOptions = [
  { label: "Pending approval", value: "PENDING_APPROVAL" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Suspended", value: "SUSPENDED" },
];

const sortOptions = [
  { label: "Created date", value: "createdAt" },
  { label: "Experience", value: "experience" },
];

interface TechnicianFiltersProps {
  currentPage: number;
  totalPage: number;
}

export default function TechnicianFilters({
  currentPage,
  totalPage,
}: TechnicianFiltersProps) {
  return (
    <div className="space-y-4">
      <FilterBar>
        {/* Global search */}
        <div className="min-w-[200px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Search
          </p>
          <SearchInput placeholder="Search technicians..." param="search" />
        </div>

        {/* Status */}
        <div className="min-w-[160px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Status
          </p>
          <SelectFilter
            param="status"
            placeholder="All statuses"
            options={statusOptions}
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

        {/* Experience range */}
        <div className="min-w-[220px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Experience
          </p>
          <NumberRangeFilter
            minParam="minExperience"
            maxParam="maxExperience"
            minPlaceholder="Min"
            maxPlaceholder="Max"
            min={0}
            max={100}
            step={1}
          />
        </div>

        {/* Skills */}
        <div className="min-w-[180px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Skills
          </p>
          <SearchInput param="skills" placeholder="Skill..." />
        </div>

        {/* Service area */}
        <div className="min-w-[200px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Service area
          </p>
          <SearchInput param="serviceArea" placeholder="Service area..." />
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
