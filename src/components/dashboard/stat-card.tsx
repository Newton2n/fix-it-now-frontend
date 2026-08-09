import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

type Props = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
};

export default function StatCard({ label, value, icon, description }: Props) {
  return (
    <Card className="min-w-0 border-border/60 bg-card/90 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex min-w-0 items-start justify-between gap-4 p-5 sm:p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {icon ? <div className="rounded-xl bg-primary/10 p-3 text-primary">{icon}</div> : null}
      </CardContent>
    </Card>
  );
}
