"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  useForm,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateUserPassword } from "@/actions/user.action";

import SectionCard from "@/components/dashboard/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  updatePasswordSchema,
  type UpdatePasswordFormData,
} from "@/schema/user/user.schema";

export default function UpdatePasswordSection() {
  const [isOpen, setIsOpen] = useState(false);

  const [showOldPassword, setShowOldPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const handlePasswordSubmit = async (
    values: UpdatePasswordFormData,
  ) => {
    try {
      const result = await updateUserPassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      if (!result.success) {
        toast.error(
          result.message || "Failed to update password.",
        );
        return;
      }

      toast.success(
        result.message ||
          "Password updated successfully.",
      );

      reset();
      setShowOldPassword(false);
      setShowNewPassword(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Password update error:", error);

      toast.error(
        "Something went wrong. Please try again.",
      );
    }
  };

  const handleClose = () => {
    reset();
    setShowOldPassword(false);
    setShowNewPassword(false);
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Closed State */}
      {!isOpen && (
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">
              Password and security
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Update your password to keep your account secure.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
          >
            Change Password
          </Button>
        </div>
      )}

      {/* Open State */}
      {isOpen && (
        <SectionCard
          title="Update Password"
          description="Change your account password securely."
        >
          <form
            onSubmit={handleSubmit(handlePasswordSubmit)}
            className="max-w-2xl space-y-6"
          >
            <PasswordField
              label="Current password"
              placeholder="Enter your current password"
              type={
                showOldPassword
                  ? "text"
                  : "password"
              }
              error={errors.oldPassword?.message}
              register={register("oldPassword")}
              onToggleVisibility={() =>
                setShowOldPassword(
                  (previous) => !previous,
                )
              }
            />

            <PasswordField
              label="New password"
              placeholder="Enter your new password"
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              error={errors.newPassword?.message}
              register={register("newPassword")}
              onToggleVisibility={() =>
                setShowNewPassword(
                  (previous) => !previous,
                )
              }
            />

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isSubmitting
                  ? "Updating..."
                  : "Update Password"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-sm disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        </SectionCard>
      )}
    </div>
  );
}

//password field 
function PasswordField({
  label,
  placeholder,
  type,
  error,
  register,
  onToggleVisibility,
}: {
  label: string;
  placeholder: string;
  type: "text" | "password";
  error?: string;
  register: UseFormRegisterReturn;
  onToggleVisibility: () => void;
}) {
  const isVisible = type === "text";

  return (
    <div className="space-y-2">
      <label
        htmlFor={register.name}
        className="text-sm font-medium"
      >
        {label}
      </label>

      <div className="relative">
        <Input
          id={register.name}
          type={type}
          placeholder={placeholder}
          className="pr-20"
          autoComplete={
            label === "Current password"
              ? "current-password"
              : "new-password"
          }
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${register.name}-error`
              : undefined
          }
          {...register}
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={
            isVisible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          className="group absolute right-3 top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center gap-1 rounded-sm px-1 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isVisible ? (
            <EyeOff
              className="size-4 transition-transform duration-200 group-hover:scale-110"
              aria-hidden="true"
            />
          ) : (
            <Eye
              className="size-4 transition-transform duration-200 group-hover:scale-110"
              aria-hidden="true"
            />
          )}

          <span>
            {isVisible ? "Hide" : "Show"}
          </span>
        </button>
      </div>

      {error && (
        <p
          id={`${register.name}-error`}
          className="text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}