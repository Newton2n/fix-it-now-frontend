import ClearFilters from "../clear-filter";
import FilterBar from "../filter-bar";
import SearchInput from "../search-input";
import SortFilter from "../sort-filter";


const sortOptions = [
  { label: "Created date", value: "createdAt" },
  { label: "Name", value: "name" },
];

export default function CategoryFilters() {
  return (
    <FilterBar>
      <SearchInput placeholder="Search categories..." />

      <SortFilter options={sortOptions} />

      <ClearFilters />
    </FilterBar>
  );
}