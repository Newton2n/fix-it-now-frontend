import ClearFilters from "../clear-filter";
import FilterBar from "../filter-bar";
import NumberRangeFilter from "../number-range-filter";
import SelectFilter from "../search-filter";
import SearchInput from "../search-input";
import SortFilter from "../sort-filter";


const statusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Succeeded", value: "SUCCEEDED" },
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

export default function PaymentFilters() {
  return (
    <FilterBar>
      <SearchInput
        param="transactionId"
        placeholder="Transaction ID..."
      />

      <SelectFilter
        param="status"
        placeholder="Payment status"
        options={statusOptions}
      />

      <SelectFilter
        param="provider"
        placeholder="Provider"
        options={providerOptions}
      />

      <NumberRangeFilter
        minParam="minAmount"
        maxParam="maxAmount"
        minPlaceholder="Min amount"
        maxPlaceholder="Max amount"
        min={0}
        step={0.01}
      />

      <SortFilter options={sortOptions} />

      <ClearFilters />
    </FilterBar>
  );
}