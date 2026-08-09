import { Skeleton } from "@/components/ui/skeleton";

export default function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Skeleton className="h-6 w-24" />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop auth/user */}
          <div className="hidden items-center gap-2 md:flex">
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>

          {/* Mobile menu */}
          <Skeleton className="h-10 w-10 rounded-md md:hidden" />
        </div>
      </div>
    </header>
  );
}
