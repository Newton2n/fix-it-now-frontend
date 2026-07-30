type InfoItemProps = {
  label: string;
  value: string;
};

export default function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-medium leading-6 text-foreground">
        {value}
      </p>
    </div>
  );
}