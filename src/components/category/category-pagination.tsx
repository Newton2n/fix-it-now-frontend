"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

type CategoryPaginationProps = {
  currentPage: number;
  totalPage: number;
};

export default function CategoryPagination({
  currentPage,
  totalPage,
}: CategoryPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPage <= 1) {
    return null;
  }

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPage}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => changePage(currentPage - 1)}
          className="cursor-pointer"
        >
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {Array.from(
            { length: totalPage },
            (_, index) => index + 1
          ).map((page) => (
            <Button
              key={page}
              size="sm"
              variant={
                page === currentPage
                  ? "default"
                  : "outline"
              }
              onClick={() => changePage(page)}
              className="hidden cursor-pointer sm:inline-flex"
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPage}
          onClick={() => changePage(currentPage + 1)}
          className="cursor-pointer"
        >
          Next
        </Button>
      </div>
    </div>
  );
}