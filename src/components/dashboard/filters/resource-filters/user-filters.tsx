import ClearFilters from "../clear-filter";
import FilterBar from "../filter-bar";
import SelectFilter from "../search-filter";
import SearchInput from "../search-input";
import SortFilter from "../sort-filter";


const roleOptions = [
  { label: "Admin", value: "ADMIN" },
  { label: "Technician", value: "TECHNICIAN" },
  { label: "Customer", value: "CUSTOMER" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
];

const sortOptions = [
  { label: "Created date", value: "createdAt" },
  { label: "Name", value: "name" },
  { label: "Role", value: "role" },
];

export default function UserFilters() {
  return (
    <FilterBar>
      <SearchInput placeholder="Search users..." />

      <SelectFilter
        param="role"
        placeholder="Role"
        options={roleOptions}
      />

      <SelectFilter
        param="status"
        placeholder="Status"
        options={statusOptions}
      />

      <SortFilter options={sortOptions} />

      <ClearFilters />
    </FilterBar>
  );
}