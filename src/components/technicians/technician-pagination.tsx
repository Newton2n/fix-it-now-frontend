"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
    const params = new URLSearchParams(searchParams);

    params.set("page", String(page));

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          ),
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
