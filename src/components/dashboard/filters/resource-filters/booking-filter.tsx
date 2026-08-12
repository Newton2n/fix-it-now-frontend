import ClearFilters from "../clear-filter";
import DateRangeFilter from "../date-range-filter";
import FilterBar from "../filter-bar";
import SelectFilter from "../search-filter";
import SortFilter from "../sort-filter";


const statusOptions = [
  { label: "Requested", value: "REQUESTED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Paid", value: "PAID" },
  { label: "In progress", value: "IN_PROGRESS" },
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

interface BookingFiltersProps {
  services?: Array<{
    id: string;
    title: string;
  }>;

  customers?: Array<{
    id: string;
    name: string;
  }>;

  showCustomer?: boolean;
}

export default function BookingFilters({
  services = [],
  customers = [],
  showCustomer = false,
}: BookingFiltersProps) {
  return (
    <FilterBar>
      <SelectFilter
        param="status"
        placeholder="Booking status"
        options={statusOptions}
      />

      <SelectFilter
        param="paymentStatus"
        placeholder="Payment status"
        options={paymentStatusOptions}
      />

      {services.length > 0 && (
        <SelectFilter
          param="serviceId"
          placeholder="Service"
          options={services.map((service) => ({
            label: service.title,
            value: service.id,
          }))}
        />
      )}

      {showCustomer && customers.length > 0 && (
        <SelectFilter
          param="customerId"
          placeholder="Customer"
          options={customers.map((customer) => ({
            label: customer.name,
            value: customer.id,
          }))}
        />
      )}

      <DateRangeFilter />

      <SortFilter options={sortOptions} />

      <ClearFilters />
    </FilterBar>
  );
}