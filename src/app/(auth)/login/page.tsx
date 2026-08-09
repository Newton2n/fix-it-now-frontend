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

import { LoginSchema, type TLoginFormData } from "@/schema/auth/auth.schema";
import { login } from "@/actions/auth.action";
import { toast } from "sonner"
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
      toast.warning("Log in failed",)
      setServerError(result.message);
      return;
    }

    const user = result.data.user;

    form.reset();
    toast.success("Log in successfully")
    router.replace("/");
    // if (user.role === "ADMIN") {
    //   router.push("/admin/dashboard");
    // } else if (user.role === "TECHNICIAN") {
    //   router.push("/technician/dashboard");
    // } else {
    //   router.push("/dashboard");
    // }

    router.refresh();
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full items-center bg-muted/20 px-5 py-10 sm:px-8 lg:px-[clamp(2rem,6vw,7rem)]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,0.75fr)] lg:items-center lg:gap-16">
        <div className="hidden min-w-0 lg:block">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">FixItNow</p>
          <h1 className="max-w-xl text-balance text-5xl font-semibold tracking-tight xl:text-6xl">A little help can change the whole day.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">Sign in to book trusted home service professionals and keep every appointment in one place.</p>
          <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
            <div className="rounded-2xl border bg-card p-5"><p className="text-2xl font-semibold text-primary">01</p><p className="mt-2 text-sm text-muted-foreground">Find the right service</p></div>
            <div className="rounded-2xl border bg-card p-5"><p className="text-2xl font-semibold text-primary">02</p><p className="mt-2 text-sm text-muted-foreground">Book with confidence</p></div>
          </div>
        </div>
        <Card className="w-full border-border/70 bg-card/95 shadow-xl shadow-primary/5">
          <CardHeader className="space-y-2 text-center sm:text-left">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your FixItNow account.</CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
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
              <div className="space-y-2">
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
              <div className="space-y-2">
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
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
                className="w-full"
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

              {/* Register */}
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
