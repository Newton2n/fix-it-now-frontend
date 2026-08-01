"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function BookingError({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-6 text-destructive" />
        </div>

        <h1 className="mt-4 text-xl font-semibold">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't load the booking page. Please
          try again.
        </p>

        <Button
          onClick={() => reset()}
          className="mt-6"
        >
          <RefreshCcw className="mr-2 size-4" />
          Try again
        </Button>
      </div>
    </main>
  );
}