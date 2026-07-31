
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

import {
  createTechnicianProfile,
} from "@/actions/technician.action";

import {
  TechnicianAvailabilityForm,
  type Availability,
} from "./technician-availability-form";

const technicianCreateSchema = z.object({
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),

  skills: z
    .string()
    .min(1, "Please add at least one skill"),

  yearsOfExperience: z
    .coerce
    .number()
    .int("Experience must be a whole number")
    .min(0, "Experience cannot be negative")
    .max(60, "Please enter a valid experience"),
});

type TechnicianCreateFormData = z.infer<
  typeof technicianCreateSchema
>;

type TechnicianCreateFormProps = {
  onSuccess?: () => void;
};

export function TechnicianCreateForm({
  onSuccess,
}: TechnicianCreateFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [availability, setAvailability] =
    useState<Availability>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TechnicianCreateFormData>({
    resolver: zodResolver(technicianCreateSchema),
    defaultValues: {
      bio: "",
      skills: "",
      yearsOfExperience: 0,
    },
  });

  const onSubmit = async (
    data: TechnicianCreateFormData,
  ) => {
    if (Object.keys(availability).length === 0) {
      toast.error(
        "Please select at least one available day.",
      );
      return;
    }

    setIsPending(true);

    try {
      const payload = {
        bio: data.bio,
        skills: data.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        yearsOfExperience: data.yearsOfExperience,

        availability,
      };

      console.log("Create technician profile payload:", payload);

      const result = await createTechnicianProfile(payload);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onSuccess?.();
    } catch (error) {
      console.error(
        "Create technician profile error:",
        error,
      );

      toast.error(
        "Unable to create technician profile.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Professional Information */}
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">
            Professional Information
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Tell customers about your professional experience
            and skills.
          </p>
        </div>

        <div className="space-y-5">
          {/* Bio */}
          <div>
            <Label htmlFor="bio">
              Professional Bio
            </Label>

            <Textarea
              id="bio"
              placeholder="Tell customers about your experience and expertise..."
              className="mt-2 min-h-32"
              {...register("bio")}
            />

            {errors.bio && (
              <p className="mt-1 text-sm text-destructive">
                {errors.bio.message}
              </p>
            )}
          </div>

          {/* Skills */}
          <div>
            <Label htmlFor="skills">
              Skills
            </Label>

            <Input
              id="skills"
              placeholder="Plumbing, HVAC Repair, Electrical Wiring"
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

          {/* Experience */}
          <div>
            <Label htmlFor="yearsOfExperience">
              Years of Experience
            </Label>

            <Input
              id="yearsOfExperience"
              type="number"
              min="0"
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
      </div>

      {/* Availability */}
      <TechnicianAvailabilityForm
        value={availability}
        onChange={setAvailability}
      />

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="gap-2"
        >
          {isPending && (
            <Loader2 className="size-4 animate-spin" />
          )}

          {isPending
            ? "Creating Profile..."
            : "Create Technician Profile"}
        </Button>
      </div>
    </form>
  );
}

