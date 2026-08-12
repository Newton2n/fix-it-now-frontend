"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

interface DashboardPaginationProps {
  currentPage: number;
  totalPage: number;
}

export default function DashboardPagination({
  currentPage,
  totalPage,
}: DashboardPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPage <= 1) {
    return null;
  }

  function goToPage(page: number) {
    const nextPage = Math.max(1, Math.min(page, totalPage));

    const params = new URLSearchParams(searchParams);

    params.set("page", String(nextPage));

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page{" "}
        <span className="font-medium text-foreground">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">
          {totalPage}
        </span>
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          <ChevronsLeft className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div className="flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium">
          {currentPage}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPage}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(totalPage)}
          disabled={currentPage === totalPage}
          aria-label="Last page"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}