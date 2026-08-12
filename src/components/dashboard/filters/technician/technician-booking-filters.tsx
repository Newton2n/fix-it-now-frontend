
"use client";

import ClearFilters from "../clear-filter";
import FilterBar from "../filter-bar";
import SelectFilter from "../search-filter";
import SearchInput from "../search-input";
import SortFilter from "../sort-filter";
import DateRangeFilter from "../date-range-filter";
import DashboardPagination from "../pagination/dashboard-pagination";

interface TechnicianBookingFiltersProps {
  currentPage: number;
  totalPage: number;
}

const statusOptions = [
  { label: "Requested", value: "REQUESTED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Paid", value: "PAID" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Declined", value: "DECLINED" },
  { label: "Canceled", value: "CANCELED" },
];

const paymentStatusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Succeeded", value: "SUCCEEDED" },
  { label: "Failed", value: "FAILED" },
];

const sortOptions = [
  { label: "Created date", value: "createdAt" },
  { label: "Scheduled date", value: "scheduledAt" },
];

export default function TechnicianBookingFilters({
  currentPage,
  totalPage,
}: TechnicianBookingFiltersProps) {
  return (
    <div className="space-y-4">
      <FilterBar>
        {/* Service ID */}
        <div className="min-w-[200px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Service ID
          </p>
          <SearchInput placeholder="Search by service..." param="serviceId" />
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

        {/* Payment status */}
        <div className="min-w-[160px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Payment
          </p>
          <SelectFilter
            param="paymentStatus"
            placeholder="All payments"
            options={paymentStatusOptions}
          />
        </div>

        {/* Date range */}
        <div className="min-w-[220px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Date range
          </p>
          <DateRangeFilter startParam="startDate" endParam="endDate" />
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