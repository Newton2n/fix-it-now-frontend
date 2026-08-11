"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

type CustomerDashboardErrorProps = {
  message: string;
};

export default function CustomerDashboardError({
  message,
}: CustomerDashboardErrorProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-6" />
          </div>

          <CardTitle className="mt-4">
            Unable to load dashboard
          </CardTitle>

          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.refresh()}
            className="cursor-pointer"
          >
            <RefreshCw className="mr-2 size-4" />
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}