"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

type Category = {
  id: string;
  name: string;
};

type ServiceFiltersProps = {
  categories: Category[];
};

export default function ServiceFilters({
  categories,
}: ServiceFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || "",
  );

  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || "",
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || "",
  );

  // Keep input state synced when browser navigation changes the URL.
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  // Custom debounce with useRef.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const updateParams = (
    updates: Record<string, string | null>,
  ) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Every new filter/search starts from page 1.
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updateParams({
        search: value.trim() || null,
      });
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleCategoryChange = (value: string) => {
    updateParams({
      categoryId: value === "all" ? null : value,
    });
  };

  const handleAvailabilityChange = (value: string) => {
    updateParams({
      isAvailable: value === "all" ? null : value,
    });
  };

  const handleSortByChange = (value: string) => {
    updateParams({
      sortBy: value,
    });
  };

  const handleSortOrderChange = (value: string) => {
    updateParams({
      sortOrder: value,
    });
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
  };

  const applyPriceFilter = () => {
    updateParams({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
    });
  };

  const resetFilters = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setSearch("");
    setMinPrice("");
    setMaxPrice("");

    router.replace(pathname);
  };

  const activeFilterCount = [
    searchParams.get("categoryId"),
    searchParams.get("minPrice"),
    searchParams.get("maxPrice"),
    searchParams.get("isAvailable"),
    searchParams.get("sortBy") &&
      searchParams.get("sortBy") !== "date",
    searchParams.get("sortOrder") &&
      searchParams.get("sortOrder") !== "desc",
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            handleSearchChange(event.target.value)
          }
          placeholder="Search services..."
          className="h-11 pl-9 pr-10"
        />

        {search && (
          <button
            type="button"
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Desktop filters */}
      <div className="hidden lg:block">
        <div className="grid gap-3 rounded-xl border bg-card p-4 lg:grid-cols-6">
          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>

            <Select
              value={
                searchParams.get("categoryId") || "all"
              }
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All categories
                </SelectItem>

                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min price */}
          <div className="space-y-2">
            <Label htmlFor="min-price">Min price</Label>

            <Input
              id="min-price"
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={(event) =>
                handleMinPriceChange(event.target.value)
              }
              onBlur={applyPriceFilter}
            />
          </div>

          {/* Max price */}
          <div className="space-y-2">
            <Label htmlFor="max-price">Max price</Label>

            <Input
              id="max-price"
              type="number"
              min="0"
              placeholder="1000"
              value={maxPrice}
              onChange={(event) =>
                handleMaxPriceChange(event.target.value)
              }
              onBlur={applyPriceFilter}
            />
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label>Availability</Label>

            <Select
              value={
                searchParams.get("isAvailable") || "all"
              }
              onValueChange={handleAvailabilityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All services" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All services
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

          {/* Sort */}
          <div className="space-y-2">
            <Label>Sort by</Label>

            <Select
              value={searchParams.get("sortBy") || "date"}
              onValueChange={handleSortByChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="date">
                  Date
                </SelectItem>

                <SelectItem value="price">
                  Price
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort order */}
          <div className="space-y-2">
            <Label>Order</Label>

            <Select
              value={
                searchParams.get("sortOrder") || "desc"
              }
              onValueChange={handleSortOrderChange}
            >
              <SelectTrigger>
                <SelectValue />
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

        {activeFilterCount > 0 && (
          <div className="mt-3 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="gap-2"
            >
              <X className="size-4" />
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Mobile filters */}
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 gap-2 sm:flex-none"
            >
              <SlidersHorizontal className="size-4" />
              Filters

              {activeFilterCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="max-h-[90vh] overflow-y-auto rounded-t-2xl"
          >
            <SheetHeader>
              <SheetTitle>Filter Services</SheetTitle>
              <SheetDescription>
                Narrow down services using the available filters.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-5">
              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>

                <Select
                  value={
                    searchParams.get("categoryId") || "all"
                  }
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      All categories
                    </SelectItem>

                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Price */}
              <div className="space-y-3">
                <Label>Price range</Label>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(event) =>
                      handleMinPriceChange(
                        event.target.value,
                      )
                    }
                  />

                  <Input
                    type="number"
                    min="0"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(event) =>
                      handleMaxPriceChange(
                        event.target.value,
                      )
                    }
                  />
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={applyPriceFilter}
                >
                  Apply price
                </Button>
              </div>

              <Separator />

              {/* Availability */}
              <div className="space-y-2">
                <Label>Availability</Label>

                <Select
                  value={
                    searchParams.get("isAvailable") || "all"
                  }
                  onValueChange={handleAvailabilityChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      All services
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

              <Separator />

              {/* Sort */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Sort by</Label>

                  <Select
                    value={
                      searchParams.get("sortBy") || "date"
                    }
                    onValueChange={handleSortByChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="date">
                        Date
                      </SelectItem>

                      <SelectItem value="price">
                        Price
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Order</Label>

                  <Select
                    value={
                      searchParams.get("sortOrder") || "desc"
                    }
                    onValueChange={handleSortOrderChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
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

              <Button
                variant="outline"
                className="w-full"
                onClick={resetFilters}
              >
                Reset all filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="gap-2"
          >
            <X className="size-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}