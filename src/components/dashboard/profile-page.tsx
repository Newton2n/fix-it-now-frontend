"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
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
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TUpdateUser>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues,
  });

  const profilePicture = watch("profilePicture");

  const currentImage =
    profilePicture ||
    user.profilePicture ||
    "https://images.unsplash.com/vector-1745610393569-9373c9c64117?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww";

  const handleProfileSubmit = async (values: TUpdateUser) => {
    const payload: TUpdateUser = {
      name: values.name,
      phoneNumber: values.phoneNumber,
      country: values.country,
      profilePicture: values.profilePicture?.trim() || undefined,
      status: values.status,
    };

    const result = await updateNormalProfile(user.id, payload);

    if (!result.success) {
      toast.error(result.message || "Failed to update profile");
      return;
    }

    toast.success(result.message || "Profile updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={title}
        description={description}
        action={
          canEdit ? (
            <Button
              variant="outline"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </Button>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
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
                <Field label="Full name" error={errors.name?.message}>
                  <Input {...register("name")} />
                </Field>

                <Field label="Email address">
                  <Input value={user.email} disabled />
                </Field>

                <Field label="Phone number" error={errors.phoneNumber?.message}>
                  <Input {...register("phoneNumber")} />
                </Field>

                <Field label="Country" error={errors.country?.message}>
                  <Input {...register("country")} />
                </Field>

                <Field label="Status" error={errors.status?.message}>
                  <select
                    {...register("status")}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </Field>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">
                    Profile image URL
                  </label>
                  <Input
                    {...register("profilePicture")}
                    placeholder="Paste an Unsplash image URL"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use a direct Unsplash image URL for the profile picture.
                  </p>
                  {errors.profilePicture?.message && (
                    <p className="text-xs text-destructive">
                      {errors.profilePicture.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isSubmitting}>
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
              <InfoRow label="Full name" value={user.name} />
              <InfoRow label="Email address" value={user.email} />
              <InfoRow
                label="Phone number"
                value={user.phoneNumber ?? "Not added"}
              />
              <InfoRow label="Country" value={user.country ?? "Not added"} />
              <InfoRow label="Role" value={user.role} />
              <InfoRow label="Status" value={user.status} />
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Account Summary"
          description="Quick profile overview"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border bg-muted">
                <Image
                  src={currentImage}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
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
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-1">{value}</div>
    </div>
  );
}