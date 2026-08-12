// components/dashboard/filters/resource-filters/technician-filter.tsx
"use client";

import ClearFilters from "../clear-filter";
import FilterBar from "../filter-bar";
import NumberRangeFilter from "../number-range-filter";
import SelectFilter from "../search-filter";
import SearchInput from "../search-input";
import SortFilter from "../sort-filter";

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
  { label: "Created date", value: "date" },
  { label: "Experience", value: "experience" },
];

export default function TechnicianFilters() {
  return (
    <FilterBar>
      {/* Global search */}
      <SearchInput placeholder="Search technicians..." param="search" />

      {/* Status */}
      <SelectFilter
        param="status"
        placeholder="Status"
        options={statusOptions}
      />

      {/* Availability */}
      <SelectFilter
        param="isAvailable"
        placeholder="Availability"
        options={availabilityOptions}
      />

      {/* Experience range */}
      <NumberRangeFilter
        minParam="minExperience"
        maxParam="maxExperience"
        minPlaceholder="Min experience"
        maxPlaceholder="Max experience"
        min={0}
        max={100}
      />

      {/* Skills */}
      <SearchInput param="skills" placeholder="Skill..." />

      {/* Service area */}
      <SearchInput param="serviceArea" placeholder="Service area..." />

      {/* Sort */}
      <SortFilter options={sortOptions} />

      {/* Clear all */}
      <ClearFilters />
    </FilterBar>
  );
}