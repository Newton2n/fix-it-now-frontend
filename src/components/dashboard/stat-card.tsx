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
    <Card>
      <CardContent className="flex items-start justify-between p-6">
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