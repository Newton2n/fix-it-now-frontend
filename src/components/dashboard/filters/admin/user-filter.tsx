"use client";



import { UserRole } from "@/types/admin";
import { UserStatus } from "@/types/api";
import FilterBar from "../filter-bar";
import SearchInput from "../search-input";
import SelectFilter from "../search-filter";
import SortFilter from "../sort-filter";
import ClearFilters from "../clear-filter";
import DashboardPagination from "../pagination/dashboard-pagination";

interface UserFiltersProps {
  currentPage: number;
  totalPage: number;
}

const roleOptions = [
  { label: "Admin", value: "ADMIN" as UserRole },
  { label: "Technician", value: "TECHNICIAN" as UserRole },
  { label: "Customer", value: "CUSTOMER" as UserRole },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" as UserStatus },
  { label: "Inactive", value: "INACTIVE" as UserStatus },
  { label: "Blocked", value: "BLOCKED" as UserStatus },
];

const sortOptions = [
  { label: "Created date", value: "createdAt" },
  { label: "Name", value: "name" },
  { label: "Role", value: "role" },
];

export default function UserFilters({
  currentPage,
  totalPage,
}: UserFiltersProps) {
  return (
    <div className="space-y-4">
      <FilterBar>
        {/* Search */}
        <div className="min-w-[200px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Search
          </p>
          <SearchInput placeholder="Search users..." param="search" />
        </div>

        {/* Role */}
        <div className="min-w-[160px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Role
          </p>
          <SelectFilter
            param="role"
            placeholder="All roles"
            options={roleOptions}
          />
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

        {/* Country */}
        <div className="min-w-[160px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Country
          </p>
          <SearchInput param="country" placeholder="e.g. Bangladesh" />
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

      {/* Pagination */}
      <DashboardPagination currentPage={currentPage} totalPage={totalPage} />
    </div>
  );
}
