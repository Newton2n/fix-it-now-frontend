import ClearFilters from "../clear-filter";
import FilterBar from "../filter-bar";
import NumberRangeFilter from "../number-range-filter";
import SelectFilter from "../search-filter";
import SearchInput from "../search-input";
import SortFilter from "../sort-filter";


interface ServiceFiltersProps {
  categories: Array<{
    id: string;
    name: string;
  }>;
}

const availabilityOptions = [
  { label: "Available", value: "true" },
  { label: "Unavailable", value: "false" },
];

const sortOptions = [
  { label: "Created date", value: "createdAt" },
  { label: "Price", value: "price" },
];

export default function ServiceFilters({
  categories,
}: ServiceFiltersProps) {
  return (
    <FilterBar>
      <SearchInput placeholder="Search services..." />

      <SelectFilter
        param="categoryId"
        placeholder="Category"
        options={categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
      />

      <SelectFilter
        param="isAvailable"
        placeholder="Availability"
        options={availabilityOptions}
      />

      <NumberRangeFilter
        minParam="minPrice"
        maxParam="maxPrice"
        minPlaceholder="Min price"
        maxPlaceholder="Max price"
        min={0}
      />

      <SortFilter options={sortOptions} />

      <ClearFilters />
    </FilterBar>
  );
}