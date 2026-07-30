"use client";

import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-6 text-center shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          We couldn’t load this page. Please try again.
        </p>

        {error?.message ? (
          <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-left text-xs text-muted-foreground">
            {error.message}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}