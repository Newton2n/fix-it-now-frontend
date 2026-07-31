"use client";

import type { TechnicianProfile } from "@/types/api";

import { TechnicianCreateForm } from "./technician-create-form";
import { TechnicianProfileEditForm } from "./technician-profile-edit-form";

type TechnicianProfileFormProps = {
  mode: "create" | "edit";
  initialData?: Partial<TechnicianProfile>;
  onSuccess?: () => void;
};

export function TechnicianProfileForm({
  mode,
  initialData,
  onSuccess,
}: TechnicianProfileFormProps) {
  if (mode === "create") {
    return (
      <TechnicianCreateForm
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <TechnicianProfileEditForm
      initialData={initialData}
      onSuccess={onSuccess}
    />
  );
}