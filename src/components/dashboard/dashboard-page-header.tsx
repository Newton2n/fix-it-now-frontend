import { ReactNode } from "react";
// import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function DashboardPageHeader({ title, description, action }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}