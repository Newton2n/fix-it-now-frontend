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

const sortOptions = [
  { label: "Created date", value: "date" },
  { label: "Experience", value: "experience" },
];

export default function TechnicianFilters() {
  return (
    <FilterBar>
      <SearchInput placeholder="Search technicians..." />

      <SelectFilter
        param="isAvailable"
        placeholder="Availability"
        options={availabilityOptions}
      />

      <NumberRangeFilter
        minParam="minExperience"
        maxParam="maxExperience"
        minPlaceholder="Min experience"
        maxPlaceholder="Max experience"
        min={0}
        max={100}
      />

      <SearchInput
        param="skills"
        placeholder="Skill..."
      />

      <SearchInput
        param="serviceArea"
        placeholder="Service area..."
      />

      <SortFilter options={sortOptions} />

      <ClearFilters />
    </FilterBar>
  );
}