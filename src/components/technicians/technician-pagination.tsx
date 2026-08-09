"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { Button } from "@/components/ui/button";

type TechnicianPaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function TechnicianPagination({
  currentPage,
  totalPages,
}: TechnicianPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.set("page", String(page));

    router.push(
      `${pathname}?${params.toString()}`,
    );
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() =>
          goToPage(currentPage - 1)
        }
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <span className="px-3 text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          goToPage(currentPage + 1)
        }
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}