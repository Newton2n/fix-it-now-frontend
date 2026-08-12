"use client";

import { RotateCcw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function ClearFilters() {
  const router = useRouter();
  const pathname = usePathname();

  function clearFilters() {
    router.replace(pathname);
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={clearFilters}
      className="gap-2"
    >
      <RotateCcw className="size-4" />
      Reset
    </Button>
  );
}