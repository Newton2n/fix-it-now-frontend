"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type Role = "ADMIN" | "TECHNICIAN" | "CUSTOMER";

function DemoLoginBox() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isLoginPage = pathname?.includes("/login");

  const fillDemoCredentials = (role: Role) => {
    // If not on the login page, navigate to it and pass the role via URL
    if (!isLoginPage) {
      router.push(`/login?demo=${role}`);
      return;
    }

    // If already on the login page, fill immediately
    const credentials = {
      ADMIN: { email: "admin@gmail.com", password: "123456" },
      TECHNICIAN: { email: "technician@gmail.com", password: "123456" },
      CUSTOMER: { email: "user@gmail.com", password: "123456" },
    };

    const { email, password } = credentials[role];

    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;

    if (emailInput && passwordInput) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;

      nativeInputValueSetter?.call(emailInput, email);
      emailInput.dispatchEvent(new Event("input", { bubbles: true }));

      nativeInputValueSetter?.call(passwordInput, password);
      passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  useEffect(() => {
    const demoRole = searchParams.get("demo") as Role;

    if (isLoginPage && demoRole) {
      const timer = setTimeout(() => {
        fillDemoCredentials(demoRole);
        router.replace("/login");
      }, 100);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginPage, searchParams, router]);

  return (
    <div className="mt-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-3.5 text-center">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        Fast Demo Login
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => fillDemoCredentials("CUSTOMER")}
        >
          Customer
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => fillDemoCredentials("TECHNICIAN")}
        >
          Technician
        </Button>
        <Button
          variant="outline"
          size="sm"
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
    // Reduced vertical padding (pt-8 pb-4) for a tighter layout at the bottom
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pt-8 pb-4">
      <div className="w-full max-w-md">
        {/* This renders your LoginPage or RegisterPage Card */}
        {children}

        {/* This renders the demo buttons directly below it */}
        <Suspense fallback={null}>
          <DemoLoginBox />
        </Suspense>
      </div>
    </main>
  );
}