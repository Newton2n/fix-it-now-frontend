import { Suspense } from "react";
import { getMe } from "@/actions/auth.action";
import Navbar from "./navbar";

export default function AuthNavbar() {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <AuthNavbarContent />
    </Suspense>
  );
}

async function AuthNavbarContent() {
  const user = await getMe();

  return (
    <Navbar
      role={user?.data?.role ?? null}
      userName={user?.data?.name}
    />
  );
}

function NavbarSkeleton() {
  return (
    <div className="flex h-16 w-full items-center justify-between px-4 border-b bg-background">
      <div className="h-6 w-24 animate-pulse rounded bg-muted" />
      <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
    </div>
  );
}