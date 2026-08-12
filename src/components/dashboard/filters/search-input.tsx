"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Input } from "@/components/ui/input";

interface SearchInputProps {
  placeholder?: string;
  param?: string;
}

export default function SearchInput({
  placeholder = "Search...",
  param = "search",
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get(param) ?? "");
  const [isPending, startTransition] = useTransition();

  // Keep local value in sync if URL changes externally
  useEffect(() => {
    setValue(searchParams.get(param) ?? "");
  }, [searchParams, param]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentValue = searchParams.get(param) ?? "";

      // Only update if value actually changed
      if (value.trim() === currentValue) {
        return;
      }

      const params = new URLSearchParams(searchParams);

      if (value.trim()) {
        params.set(param, value.trim());
      } else {
        params.delete(param);
      }

      // Reset page on new search
      params.set("page", "1");

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 500); // 500 ms debounce

    return () => clearTimeout(timer);
  }, [value, param, pathname, router, searchParams]);

  return (
    <div className="relative w-full lg:w-72">
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
        // disabled={isPending}
      />
    </div>
  );
}
