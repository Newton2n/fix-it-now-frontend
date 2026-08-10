"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BackButtonProps = {
  label?: string;
  className?: string;
};

export default function BackButton({
  label = "Back",
  className,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      aria-label={label}
      onClick={() => router.back()}
      className={cn(
        "group h-9 shrink-0 cursor-pointer gap-1.5 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      <ArrowLeft
        className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
        aria-hidden="true"
      />

      <span>{label}</span>
    </Button>
  );
}