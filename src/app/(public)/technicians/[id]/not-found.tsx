import { Card, CardContent } from "@/components/ui/card";
import { UserRound } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <Card>
        <CardContent className="flex min-h-80 flex-col items-center justify-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
            <UserRound className="size-7 text-muted-foreground" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            Technician not found
          </h1>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            This technician profile does not exist, has been removed, or is no
            longer available.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
