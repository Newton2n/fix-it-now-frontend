"use client";

import { useMemo, useState } from "react";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type UserProfile = {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string;
  role: Role;
  status: string;
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
  const initialForm = useMemo<ProfileFormData>(
    () => ({
      name: user.name ?? "",
      phoneNumber: user.phoneNumber ?? "",
      email: user.email ?? "",
      country: user.country ?? "",
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
    console.log("update profile", formData);
    setIsEditing(false);
  };

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
            </div>
          )}
        </SectionCard>

        <SectionCard title="Account Summary" description="Quick profile overview">
          <div className="space-y-4">
            <SummaryItem label="Role" value={<Badge variant="secondary">{user.role}</Badge>} />
            <SummaryItem label="Status" value={<Badge variant="outline">{user.status}</Badge>} />
            {/* <SummaryItem
              label="Created At"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
            <SummaryItem
              label="Updated At"
              value={new Date(user.updatedAt).toLocaleDateString()}
            /> */}
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