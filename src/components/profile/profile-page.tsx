"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Info } from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import UpdatePasswordSection from "@/components/profile/update-password-section";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { updateNormalProfile } from "@/actions/user.action";

import { UserProfile, type TUpdateUser } from "@/types/user";

import { userUpdateSchema } from "@/schema/user/user.schema";

type ProfilePageProps = {
  user: UserProfile;
  canEdit: boolean;
  title?: string;
  description?: string;
};

export default function ProfilePage({
  user,
  canEdit,
  title = "My Profile",
  description = "View and manage your account details.",
}: ProfilePageProps) {
  const defaultValues = useMemo<TUpdateUser>(
    () => ({
      name: user.name ?? "",
      phoneNumber: user.phoneNumber ?? "",
      country: user.country ?? "",
      profilePicture: user.profilePicture ?? "",
      status: user.status,
    }),
    [user],
  );

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TUpdateUser>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const profilePicture = watch("profilePicture");

  const currentImage =
    profilePicture ||
    user.profilePicture ||
    "https://images.unsplash.com/vector-1745610393569-9373c9c64117?w=600&auto=format&fit=crop&q=60";

  const handleProfileSubmit = async (values: TUpdateUser) => {
    try {
      const payload: TUpdateUser = {
        name: values.name?.trim(),
        phoneNumber: values.phoneNumber?.trim() || "",
        country: values.country?.trim() || "",
        profilePicture: values.profilePicture?.trim() || undefined,
        status: values.status,
      };

      const result = await updateNormalProfile(user.id, payload);

      if (!result.success) {
        toast.error(result.message || "Failed to update profile.");
        return;
      }

      toast.success(result.message || "Profile updated successfully.");

      setIsEditing(false);
      reset(payload);
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    reset(defaultValues);
    setIsEditing(false);
  };

  const isGoogleUser = user.authProvider === "GOOGLE";

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={title}
        description={description}
        action={
          canEdit ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (isEditing) {
                  handleCancelEdit();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </Button>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Profile Details */}
        <SectionCard
          title="Profile Details"
          description="Your account information"
        >
          {canEdit && isEditing ? (
            <form
              onSubmit={handleSubmit(handleProfileSubmit)}
              className="space-y-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Full name"
                  error={errors.name?.message}
                >
                  <Input
                    {...register("name")}
                    placeholder="Enter your full name"
                  />
                </Field>

                <Field label="Email address">
                  <Input
                    value={user.email}
                    disabled
                    readOnly
                  />
                </Field>

                <Field
                  label="Phone number"
                  error={errors.phoneNumber?.message}
                >
                  <Input
                    {...register("phoneNumber")}
                    placeholder="Enter your phone number"
                  />
                </Field>

                <Field
                  label="Country"
                  error={errors.country?.message}
                >
                  <Input
                    {...register("country")}
                    placeholder="Enter your country"
                  />
                </Field>

                <Field
                  label="Status"
                  error={errors.status?.message}
                >
                  <select
                    {...register("status")}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </Field>

                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="profile-picture"
                    className="text-sm font-medium"
                  >
                    Profile image URL
                  </label>

                  <Input
                    id="profile-picture"
                    {...register("profilePicture")}
                    placeholder="Paste an image URL"
                  />

                  <p className="text-xs text-muted-foreground">
                    Use a direct image URL for your profile picture.
                  </p>

                  {errors.profilePicture?.message && (
                    <p className="text-xs text-destructive">
                      {errors.profilePicture.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset(defaultValues)}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow
                label="Full name"
                value={user.name}
              />

              <InfoRow
                label="Email address"
                value={user.email}
              />

              <InfoRow
                label="Phone number"
                value={user.phoneNumber ?? "Not added"}
              />

              <InfoRow
                label="Country"
                value={user.country ?? "Not added"}
              />

              <InfoRow
                label="Role"
                value={user.role}
              />

              <InfoRow
                label="Status"
                value={user.status}
              />

              <InfoRow
                label="Authentication"
                value={isGoogleUser ? "Google verified" : "Email & Password"}
              />
            </div>
          )}
        </SectionCard>

        {/* Account Summary */}
        <SectionCard
          title="Account Summary"
          description="Quick profile overview"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border bg-muted">
                <Image
                  src={currentImage}
                  alt={`${user.name}'s profile picture`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold">
                  {user.name}
                </h3>

                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <SummaryItem
                label="Role"
                value={<Badge variant="secondary">{user.role}</Badge>}
              />

              <SummaryItem
                label="Status"
                value={<Badge variant="outline">{user.status}</Badge>}
              />

              <SummaryItem
                label="Authentication"
                value={
                  <Badge variant={isGoogleUser ? "default" : "secondary"}>
                    {isGoogleUser ? "Google verified" : "Email & Password"}
                  </Badge>
                }
              />
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Password Section or Google Info Banner */}
      {canEdit && (
        isGoogleUser ? (
          <SectionCard
            title="Password & Security"
            description="Manage your account security settings"
          >
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/50 p-4 text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-200">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div className="space-y-1 text-sm">
                <p className="font-medium">Password management is disabled</p>
                <p className="text-muted-foreground text-blue-800/80 dark:text-blue-300/80">
                  You signed in using your Google account. You do not need a local password to log in. To sign in in the future, simply click <strong>Continue with Google</strong>.
                </p>
              </div>
            </div>
          </SectionCard>
        ) : (
          <UpdatePasswordSection />
        )
      )}
    </div>
  );
}

// Form Field
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {children}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// Information Row
function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-1 break-words font-medium">{value}</p>
    </div>
  );
}

// Summary Item
function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>

      <div className="mt-1">{value}</div>
    </div>
  );
}