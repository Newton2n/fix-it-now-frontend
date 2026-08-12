"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
   
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <Card>
        <CardContent className="flex min-h-80 flex-col items-center justify-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="size-7 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            Something went wrong
          </h1>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            We couldn’t load this technician profile right now.
          </p>

          {error?.message ? (
            <p className="mt-4 max-w-md rounded-lg bg-muted px-3 py-2 text-left text-xs text-muted-foreground">
              {error.message}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => reset()}>Try again</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
