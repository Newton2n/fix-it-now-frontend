import Link from "next/link";
import { type LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CategoryCardProps = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export default function CategoryCard({
  id,
  name,
  description,
  icon: Icon,
}: CategoryCardProps) {
  return (
    <Card className="group h-full min-w-0 border-border/60 bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <CardHeader>
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>

        <CardTitle>
          {name}
        </CardTitle>

        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Category ID
        </p>

        <p className="max-w-40 truncate text-xs font-mono text-muted-foreground">
          {id}
        </p>
      </CardContent>

      <CardContent className="pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          asChild
        >
          <Link href={`/categories/${id}`}>
            View Services
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
