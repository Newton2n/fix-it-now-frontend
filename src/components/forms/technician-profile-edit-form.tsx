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
import type { TechnicianProfile } from "@/types/api";
import { setFormErrors } from "@/lib/form-utils";

const technicianProfileSchema = z.object({
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),

  skills: z
    .string()
    .min(1, "Please add at least one skill"),

  yearsOfExperience: z.coerce
    .number()
    .min(0, "Experience cannot be negative"),
});

type FormData = z.infer<typeof technicianProfileSchema>;

type TechnicianProfileEditFormProps = {
  initialData?: Partial<TechnicianProfile>;
  onSuccess?: () => void;
};

export function TechnicianProfileEditForm({
  initialData,
  onSuccess,
}: TechnicianProfileEditFormProps) {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(technicianProfileSchema),

    defaultValues: {
      bio: initialData?.bio ?? "",
      skills: initialData?.skills?.join(", ") ?? "",
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

        yearsOfExperience: data.yearsOfExperience,
      };

      const result = await updateTechnicianProfile(payload);

      if (!result.success) {
        toast.error(result.message);

        if (result.errorDetails) {
          setFormErrors(result.errorDetails, setError);
        }

        return;
      }

      toast.success(result.message);
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
          <h3 className="text-lg font-semibold">
            Professional Information
          </h3>

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
            <Label htmlFor="skills">
              Skills
            </Label>

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
            <Label htmlFor="yearsOfExperience">
              Years of Experience
            </Label>

            <Input
              id="yearsOfExperience"
              type="number"
              min={0}
              placeholder="e.g. 5"
              className="mt-2"
              {...register("yearsOfExperience")}
            />

            {errors.yearsOfExperience && (
              <p className="mt-1 text-sm text-destructive">
                {errors.yearsOfExperience.message}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}

          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}