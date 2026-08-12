import { ReactNode } from "react";

interface FilterBarProps {
  children: ReactNode;
}

export default function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        {children}
      </div>
    </div>
  );
}