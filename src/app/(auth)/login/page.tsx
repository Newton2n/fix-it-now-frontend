"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

import { LoginSchema, type TLoginFormData } from "@/schema/auth/auth.schema";
import { login } from "@/actions/auth.action";
import { toast } from "sonner";
import { UserRole } from "@/types/api";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<TLoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: TLoginFormData) => {
    setServerError("");

    const result = await login(values);

    if (!result.success) {
      toast.warning("Log in failed");
      setServerError(result.message);
      return;
    }

    form.reset();

    const userRole: UserRole = result?.data?.user?.role;

    toast.success("Log in successfully");

    if (userRole === "ADMIN") {
      router.replace("/dashboard/admin");
    } else if (userRole === "CUSTOMER") {
      router.replace("/dashboard/customer");
    } else if (userRole === "TECHNICIAN") {
      router.replace("/dashboard/technician");
    }

    router.refresh();
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your FixItNow account.</CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3"
          noValidate
        >
          {serverError && (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {serverError}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!form.formState.errors.email}
              {...form.register("email")}
            />

            {form.formState.errors.email?.message && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="pr-10"
                aria-invalid={!!form.formState.errors.password}
                {...form.register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {form.formState.errors.password?.message && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full mt-2 cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Auth Button */}
          <GoogleAuthButton mode="login" />

          {/* Register Link */}
          <p className="text-center text-sm text-muted-foreground pt-1">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-foreground underline-offset-4 hover:underline cursor-pointer"
            >
              Register
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}