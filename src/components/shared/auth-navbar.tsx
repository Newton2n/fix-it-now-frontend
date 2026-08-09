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
  console.log("user details", user);

  return (
    <Navbar
      role={user?.data?.role ?? null}
      userName={user?.data?.name ?? null}
      profilePicture={
        user?.data?.profilePicture ??
        "https://images.unsplash.com/vector-1745610393569-9373c9c64117?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww"
      }
    />
  );
}

function NavbarSkeleton() {
  return (
    <div className="flex h-16 w-full items-center justify-between border-b bg-background px-4">
      <div className="h-6 w-24 animate-pulse rounded bg-muted" />

      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        <div className="hidden h-8 w-16 animate-pulse rounded bg-muted sm:block" />
      </div>
    </div>
  );
}
