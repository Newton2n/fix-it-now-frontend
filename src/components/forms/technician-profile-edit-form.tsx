"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { updateTechnicianProfile } from "@/actions/technician.action";
import type { TechnicianProfile } from "@/types/technician";
import { setFormErrors } from "@/lib/form-utils";
import { technicianCreateSchemaWithoutAvailability } from "@/schema/technician/technician.schema";

type FormData = z.infer<typeof technicianCreateSchemaWithoutAvailability>;

type TechnicianProfileEditFormProps = {
  initialData?: Partial<TechnicianProfile>;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function TechnicianProfileEditForm({
  initialData,
  onSuccess,
  onCancel,
}: TechnicianProfileEditFormProps) {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(technicianCreateSchemaWithoutAvailability),
    defaultValues: {
      bio: initialData?.bio ?? "",
      skills: initialData?.skills?.join(", ") ?? "",
      serviceArea: initialData?.serviceArea?.join(", ") ?? "",
      yearsOfExperience: initialData?.yearsOfExperience ?? 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsPending(true);

    try {
      const payload = {
        bio: data.bio.trim(),
        skills: data.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        serviceArea: data.serviceArea
          .split(",")
          .map((area) => area.trim())
          .filter(Boolean),
        yearsOfExperience: data.yearsOfExperience,
      };

      const result = await updateTechnicianProfile(payload);

      if (!result.success) {
        toast.error(result.message || "Unable to update technician profile.");

        if (result.errorDetails) {
          setFormErrors(result.errorDetails, setError);
        }

        return;
      }

      toast.success(result.message || "Profile updated successfully.");
      onSuccess?.();
    } catch (error) {
      console.error("Update technician profile error:", error);
      toast.error("Unable to update technician profile.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold">Professional Information</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your professional technician information.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell customers about your professional experience..."
              className="mt-2 min-h-32"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-destructive">
                {errors.bio.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              placeholder="Plumbing, Electrical, HVAC"
              className="mt-2"
              {...register("skills")}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Separate multiple skills with commas.
            </p>
            {errors.skills && (
              <p className="mt-1 text-sm text-destructive">
                {errors.skills.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="serviceArea">Service Area</Label>
            <Input
              id="serviceArea"
              placeholder="Dhaka, Barishal"
              className="mt-2"
              {...register("serviceArea")}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Separate multiple areas with commas.
            </p>
            {errors.serviceArea && (
              <p className="mt-1 text-sm text-destructive">
                {errors.serviceArea.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              min={0}
              max={80}
              placeholder="e.g. 5"
              className="mt-2"
              {...register("yearsOfExperience", { valueAsNumber: true })}
            />
            {errors.yearsOfExperience && (
              <p className="mt-1 text-sm text-destructive">
                {errors.yearsOfExperience.message}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}