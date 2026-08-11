"use client";

import { useEffect, Suspense, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";

type Role = "ADMIN" | "TECHNICIAN" | "CUSTOMER";

const DEMO_CREDENTIALS: Record<Role, { email: string; password: string }> = {
  ADMIN: { email: "admin@gmail.com", password: "123456" },
  TECHNICIAN: { email: "technician@gmail.com", password: "123456" },
  CUSTOMER: { email: "user@gmail.com", password: "123456" },
};

function DemoLoginBox() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isLoginPage = pathname?.includes("/login");

  const fillDemoCredentials = useCallback(
    (role: Role) => {
      if (!isLoginPage) {
        router.push(`/login?demo=${role}`);
        return;
      }

      const { email, password } = DEMO_CREDENTIALS[role];

      const emailInput = document.getElementById("email") as HTMLInputElement | null;
      const passwordInput = document.getElementById("password") as HTMLInputElement | null;

      if (emailInput && passwordInput) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;

        // Populate email input
        nativeSetter?.call(emailInput, email);
        emailInput.dispatchEvent(new Event("input", { bubbles: true }));
        emailInput.dispatchEvent(new Event("change", { bubbles: true }));

        // Populate password input
        nativeSetter?.call(passwordInput, password);
        passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
        passwordInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    },
    [isLoginPage, router]
  );

  useEffect(() => {
    const demoRole = searchParams.get("demo") as Role | null;

    if (isLoginPage && demoRole && DEMO_CREDENTIALS[demoRole]) {
      const timer = setTimeout(() => {
        fillDemoCredentials(demoRole);
        // Clear query string without re-triggering navigation loop
        router.replace("/login", { scroll: false });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoginPage, searchParams, router, fillDemoCredentials]);

  return (
    <div className="mt-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-3.5 text-center">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        Fast Demo Login
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="cursor-pointer"
          onClick={() => fillDemoCredentials("CUSTOMER")}
        >
          Customer
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="cursor-pointer"
          onClick={() => fillDemoCredentials("TECHNICIAN")}
        >
          Technician
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="cursor-pointer"
          onClick={() => fillDemoCredentials("ADMIN")}
        >
          Admin
        </Button>
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pt-8 pb-4">
      {/* Load Google OAuth Identity Services Script globally for auth routes */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="beforeInteractive"
      />

      <div className="w-full max-w-md">
        {children}

        <Suspense fallback={null}>
          <DemoLoginBox />
        </Suspense>
      </div>
    </main>
  );
}