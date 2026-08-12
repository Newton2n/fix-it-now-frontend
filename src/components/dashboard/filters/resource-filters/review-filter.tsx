
"use client";

import ClearFilters from "../clear-filter";
import FilterBar from "../filter-bar";
import SelectFilter from "../search-filter";
import SearchInput from "../search-input";
import SortFilter from "../sort-filter";

const ratingOptions = [
  { label: "1 star", value: "1" },
  { label: "2 stars", value: "2" },
  { label: "3 stars", value: "3" },
  { label: "4 stars", value: "4" },
  { label: "5 stars", value: "5" },
];

const sortOptions = [
  { label: "Created date", value: "createdAt" },
  { label: "Rating", value: "rating" },
];

interface ReviewFiltersProps {
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

export default function ReviewFilters({
  services = [],
  customers = [],
  showCustomer = false,
}: ReviewFiltersProps) {
  return (
    <FilterBar>
      <SearchInput placeholder="Search reviews..." param="search" />

      <SelectFilter
        param="minRating"
        placeholder="Min rating"
        options={ratingOptions}
      />

      <SelectFilter
        param="maxRating"
        placeholder="Max rating"
        options={ratingOptions}
      />

      <SelectFilter
        param="serviceId"
        placeholder="Service"
        options={services.map((service) => ({
          label: service.title,
          value: service.id,
        }))}
      />

      {showCustomer && (
        <SelectFilter
          param="customerId"
          placeholder="Customer"
          options={customers.map((customer) => ({
            label: customer.name,
            value: customer.id,
          }))}
        />
      )}

      <SortFilter options={sortOptions} />

      <ClearFilters />
    </FilterBar>
  );
}