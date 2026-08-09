"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  RegisterSchema,
  type TRegistrationFormData,
} from "@/schema/auth/auth.schema";

import { register } from "@/actions/auth.action";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [serverError, setServerError] = useState("");

  const form = useForm<TRegistrationFormData>({
    resolver: zodResolver(RegisterSchema),

    defaultValues: {
      name: "",
      email: "",
      role: "CUSTOMER",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: TRegistrationFormData) => {
    setServerError("");

    const result = await register(values);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    form.reset();

    router.push("/login");
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full items-center bg-muted/20 px-5 py-10 sm:px-8 lg:px-[clamp(2rem,6vw,7rem)]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,0.75fr)] lg:items-center lg:gap-16">
        <div className="hidden min-w-0 lg:block">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Start with FixItNow</p>
          <h1 className="max-w-xl text-balance text-5xl font-semibold tracking-tight xl:text-6xl">The right person for the job is closer than you think.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">Create your account to discover services, manage bookings, and keep your home running smoothly.</p>
        </div>
        <Card className="w-full border-border/70 bg-card/95 shadow-xl shadow-primary/5">
          <CardHeader className="space-y-2 text-center sm:text-left">
            <CardTitle className="text-2xl">Create account</CardTitle>

            <CardDescription>
              Join FixItNow and start booking trusted services.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* Server Error */}
              {serverError && (
                <div
                  role="alert"
                  className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {serverError}
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>

                <Input
                  id="name"
                  placeholder="John Doe"
                  autoComplete="name"
                  aria-invalid={!!form.formState.errors.name}
                  {...form.register("name")}
                />

                {form.formState.errors.name?.message && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

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

              {/* Role */}
              <div className="space-y-2">
                <Label>Account type</Label>

                <RadioGroup
                  value={form.watch("role")}
                  onValueChange={(value) =>
                    form.setValue("role", value as "CUSTOMER" | "TECHNICIAN", {
                      shouldValidate: true,
                    })
                  }
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="CUSTOMER" id="customer" />

                    <Label htmlFor="customer" className="cursor-pointer">
                      Customer
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="TECHNICIAN" id="technician" />

                    <Label htmlFor="technician" className="cursor-pointer">
                      Technician
                    </Label>
                  </div>
                </RadioGroup>

                {form.formState.errors.role?.message && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.role.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="pr-10"
                    aria-invalid={!!form.formState.errors.confirmPassword}
                    {...form.register("confirmPassword")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {form.formState.errors.confirmPassword?.message && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.confirmPassword.message}
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
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              {/* Login */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
