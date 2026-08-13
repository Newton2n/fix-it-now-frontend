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

type ServicePaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function ServicePagination({
  currentPage,
  totalPages,
}: ServicePaginationProps) {
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        className="cursor-pointer"
      >
        <ChevronLeft className="mr-1 size-4" />
        Previous
      </Button>

      <div className="flex flex-wrap items-center gap-1">
        {pages.map((page) => (
          <Button
            key={page}
            variant={
              page === currentPage
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() => goToPage(page)}
            className="cursor-pointer"
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="cursor-pointer"
      >
        Next
        <ChevronRight className="ml-1 size-4" />
      </Button>
    </div>
  );
}