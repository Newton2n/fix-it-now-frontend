"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
export type Status = "ACTIVE" | "INACTIVE";

export type UserProfile = {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string;
  role: Role;
  status: Status;
  country: string | null;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProfileFormData = {
  name: string;
  phoneNumber: string;
  email: string;
  country: string;
  role: "CUSTOMER" | "TECHNICIAN";
  status: "ACTIVE" | "INACTIVE";
  profilePicture: string;
};

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
  const isAdmin = user.role === "ADMIN";
  const isTechnician = user.role === "TECHNICIAN";

  const initialForm = useMemo<ProfileFormData>(
    () => ({
      name: user.name ?? "",
      phoneNumber: user.phoneNumber ?? "",
      email: user.email ?? "",
      country: user.country ?? "",
      role: user.role === "ADMIN" ? "TECHNICIAN" : (user.role as "CUSTOMER" | "TECHNICIAN"),
      status: user.status,
      profilePicture: user.profilePicture ?? "",
    }),
    [user]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(initialForm);

  const handleChange = (key: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFormData(initialForm);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allowedRole = isAdmin
      ? user.role
      : isTechnician
        ? "TECHNICIAN"
        : formData.role;

    const payload = {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      country: formData.country,
      profilePicture: formData.profilePicture,
      status: formData.status,
      role: allowedRole,
    };

    console.log("update profile", payload);
    setIsEditing(false);
  };

  const currentImage =
    formData.profilePicture ||
    user.profilePicture ||
    "https://images.unsplash.com/vector-1745610393569-9373c9c64117?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww";

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={title}
        description={description}
        action={
          canEdit ? (
            <Button variant="outline" onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </Button>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <SectionCard title="Profile Details" description="Your account information">
          {canEdit && isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Full name"
                  value={formData.name}
                  onChange={(v) => handleChange("name", v)}
                />
                <Field
                  label="Email address"
                  value={formData.email}
                  onChange={(v) => handleChange("email", v)}
                  disabled
                />
                <Field
                  label="Phone number"
                  value={formData.phoneNumber}
                  onChange={(v) => handleChange("phoneNumber", v)}
                />
                <Field
                  label="Country"
                  value={formData.country}
                  onChange={(v) => handleChange("country", v)}
                />

                {!isAdmin && !isTechnician && (
                  <SelectField
                    label="Role"
                    value={formData.role}
                    onChange={(v) => handleChange("role", v)}
                    options={["CUSTOMER", "TECHNICIAN"]}
                  />
                )}

                {isTechnician && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 md:col-span-2">
                    Technician role cannot be changed to customer.
                  </div>
                )}

                <SelectField
                  label="Status"
                  value={formData.status}
                  onChange={(v) => handleChange("status", v)}
                  options={["ACTIVE", "INACTIVE"]}
                />

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Profile image URL</label>
                  <Input
                    value={formData.profilePicture}
                    onChange={(e) => handleChange("profilePicture", e.target.value)}
                    placeholder="Paste an Unsplash image URL"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use a direct Unsplash image URL for the profile picture.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Full name" value={user.name} />
              <InfoRow label="Email address" value={user.email} />
              <InfoRow label="Phone number" value={user.phoneNumber ?? "Not added"} />
              <InfoRow label="Country" value={user.country ?? "Not added"} />
              <InfoRow label="Role" value={user.role} />
              <InfoRow label="Status" value={user.status} />
            </div>
          )}
        </SectionCard>

        <SectionCard title="Account Summary" description="Quick profile overview">
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

            {isAdmin && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                Admin role cannot be changed.
              </p>
            )}

            {isTechnician && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                Technician role cannot be changed to customer.
              </p>
            )}

            <div className="space-y-4">
              <SummaryItem label="Role" value={<Badge variant="secondary">{user.role}</Badge>} />
              <SummaryItem label="Status" value={<Badge variant="outline">{user.status}</Badge>} />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
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