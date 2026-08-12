// components/dashboard/filters/admin/payment-filters.tsx
"use client";

import ClearFilters from "../clear-filter";
import FilterBar from "../filter-bar";
import NumberRangeFilter from "../number-range-filter";
import SelectFilter from "../search-filter";
import SearchInput from "../search-input";
import SortFilter from "../sort-filter";
import DashboardPagination from "../pagination/dashboard-pagination"; // ← this is your pagination

interface PaymentFiltersProps {
  currentPage: number;
  totalPage: number;
}

const statusOptions = [
  { label: "Succeeded", value: "SUCCEEDED" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
];

const providerOptions = [
  { label: "Stripe", value: "STRIPE" },
  { label: "SSLCommerz", value: "SSLCOMMERZ" },
];

const sortOptions = [
  { label: "Created date", value: "createdAt" },
  { label: "Amount", value: "amount" },
  { label: "Status", value: "status" },
];

export default function PaymentFilters({
  currentPage,
  totalPage,
}: PaymentFiltersProps) {
  return (
    <div className="space-y-4">
      <FilterBar>
        {/* Transaction ID */}
        <div className="min-w-[200px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Transaction ID
          </p>
          <SearchInput
            placeholder="Search by ID..."
            param="transactionId"
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

        {/* Provider */}
        <div className="min-w-[160px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Provider
          </p>
          <SelectFilter
            param="provider"
            placeholder="All providers"
            options={providerOptions}
          />
        </div>

        {/* Amount range */}
        <div className="min-w-[220px] flex-shrink-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Amount
          </p>
          <NumberRangeFilter
            minParam="minAmount"
            maxParam="maxAmount"
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

      {/* Pagination is implemented here */}
      <DashboardPagination currentPage={currentPage} totalPage={totalPage} />
    </div>
  );
}