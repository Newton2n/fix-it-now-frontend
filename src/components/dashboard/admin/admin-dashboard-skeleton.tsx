import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>

                <Skeleton className="size-10 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>

                <Skeleton className="size-9 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-64 max-w-full" />
            </CardHeader>

            <CardContent>
              <Skeleton className="h-[320px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-12 w-full"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}