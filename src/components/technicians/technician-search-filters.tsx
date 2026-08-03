"use client";

import { useRef, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TechnicianSearchFiltersProps = {
  defaultValues: {
    search: string;
    minExperience: string;
    isAvailable: string;
    skills: string;
    serviceArea: string;
    sortBy: "experience" | "date";
    sortOrder: "asc" | "desc";
  };
};

export default function TechnicianSearchFilters({
  defaultValues,
}: TechnicianSearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [search, setSearch] = useState(defaultValues.search);
  const [minExperience, setMinExperience] = useState(
    defaultValues.minExperience,
  );
  const [skills, setSkills] = useState(defaultValues.skills);
  const [serviceArea, setServiceArea] = useState(defaultValues.serviceArea);

  const [showFilters, setShowFilters] = useState(false);

  // Update URL
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Always go back to page 1 when a filter changes
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  };

  // Debounce text inputs
  const handleDebouncedChange = (key: string, value: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      updateParams(key, value.trim());
    }, 500);
  };

  // Search
  const handleSearch = (value: string) => {
    setSearch(value);

    handleDebouncedChange("search", value);
  };

  // Minimum experience
  const handleMinExperience = (value: string) => {
    setMinExperience(value);

    handleDebouncedChange("minExperience", value);
  };

  // Skills
  const handleSkills = (value: string) => {
    setSkills(value);

    handleDebouncedChange("skills", value);
  };

  // Service area
  const handleServiceArea = (value: string) => {
    setServiceArea(value);

    handleDebouncedChange("serviceArea", value);
  };

  // Clear all filters
  const clearFilters = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setSearch("");
    setMinExperience("");
    setSkills("");
    setServiceArea("");

    router.replace(pathname);
  };

  // Count active filters
  const filterCount =
    Number(Boolean(defaultValues.minExperience)) +
    Number(Boolean(defaultValues.isAvailable)) +
    Number(Boolean(defaultValues.skills)) +
    Number(Boolean(defaultValues.serviceArea)) +
    Number(defaultValues.sortBy !== "date") +
    Number(defaultValues.sortOrder !== "desc");

  const hasFilters =
    Boolean(defaultValues.search) ||
    filterCount > 0;

  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      {/* Search + Filter Button */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Search technicians..."
            className="h-11 pl-9 pr-10"
          />

          {search && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full sm:w-auto"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="mr-2 size-4" />

          Filters

          {filterCount > 0 && (
            <span className="ml-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {filterCount}
            </span>
          )}

          <ChevronDown
            className={`ml-2 size-4 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="border-t bg-muted/20 p-4 sm:p-5">
          <div className="space-y-5">
            {/* Filter Heading */}
            <div>
              <h2 className="text-sm font-semibold">
                Filter technicians
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Find technicians based on your requirements.
              </p>
            </div>

            {/* Filter Inputs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Minimum Experience */}
              <div className="space-y-2">
                <label
                  htmlFor="minimum-experience"
                  className="text-sm font-medium"
                >
                  Minimum Experience
                </label>

                <Input
                  id="minimum-experience"
                  type="number"
                  min="0"
                  value={minExperience}
                  onChange={(event) =>
                    handleMinExperience(event.target.value)
                  }
                  placeholder="e.g. 5"
                  className="h-10"
                />
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Service Type
                </label>

                <Select
                  value={defaultValues.skills || "all"}
                  onValueChange={(value) =>
                    updateParams(
                      "skills",
                      value === "all" ? "" : value,
                    )
                  }
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="All service types" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      All service types
                    </SelectItem>

                    <SelectItem value="plumbing">
                      Plumbing
                    </SelectItem>

                    <SelectItem value="electrical">
                      Electrical
                    </SelectItem>

                    <SelectItem value="hvac">
                      HVAC
                    </SelectItem>

                    <SelectItem value="appliance">
                      Appliance Repair
                    </SelectItem>

                    <SelectItem value="computer">
                      Computer Repair
                    </SelectItem>

                    <SelectItem value="mobile">
                      Mobile Repair
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Service Area */}
              <div className="space-y-2">
                <label
                  htmlFor="service-area"
                  className="text-sm font-medium"
                >
                  Service Area
                </label>

                <Input
                  id="service-area"
                  value={serviceArea}
                  onChange={(event) =>
                    handleServiceArea(event.target.value)
                  }
                  placeholder="e.g. Dhaka"
                  className="h-10"
                />
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Availability
                </label>

                <Select
                  value={defaultValues.isAvailable || "all"}
                  onValueChange={(value) =>
                    updateParams(
                      "isAvailable",
                      value === "all" ? "" : value,
                    )
                  }
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="All technicians" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      All technicians
                    </SelectItem>

                    <SelectItem value="true">
                      Available
                    </SelectItem>

                    <SelectItem value="false">
                      Unavailable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sorting */}
            <div className="border-t pt-5">
              <h2 className="mb-3 text-sm font-semibold">
                Sort results
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Sort By */}
                <Select
                  value={defaultValues.sortBy}
                  onValueChange={(value) =>
                    updateParams("sortBy", value)
                  }
                >
                  <SelectTrigger className="h-10 w-full">
                    <SlidersHorizontal className="mr-2 size-4 shrink-0" />

                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="date">
                      Newest
                    </SelectItem>

                    <SelectItem value="experience">
                      Experience
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort Order */}
                <Select
                  value={defaultValues.sortOrder}
                  onValueChange={(value) =>
                    updateParams("sortOrder", value)
                  }
                >
                  <SelectTrigger className="h-10 w-full">
                    {defaultValues.sortOrder === "asc" ? (
                      <ArrowUpAZ className="mr-2 size-4 shrink-0" />
                    ) : (
                      <ArrowDownAZ className="mr-2 size-4 shrink-0" />
                    )}

                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="desc">
                      Descending
                    </SelectItem>

                    <SelectItem value="asc">
                      Ascending
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear */}
            {hasFilters && (
              <div className="flex justify-end border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full sm:w-auto"
                >
                  <X className="mr-2 size-4" />

                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}