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

import {
  createTechnicianProfile,
} from "@/actions/technician.action";

import {
  TechnicianAvailabilityForm,
  type Availability,
} from "./technician-availability-form";

import { setFormErrors } from "@/lib/form-utils";

const technicianCreateSchema = z.object({
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),

  skills: z
    .string()
    .min(1, "Please add at least one skill"),

  experience: z
    .string()
    .min(1, "Experience information is required")
    .max(
      200,
      "Experience must be less than 200 characters",
    ),
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
  const [isPending, setIsPending] =
    useState(false);

  const [availability, setAvailability] =
    useState<Availability>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TechnicianCreateFormData>({
    resolver: zodResolver(
      technicianCreateSchema,
    ),
    defaultValues: {
      bio: "",
      skills: "",
      experience: "",
    },
  });

  const onSubmit = async (
    data: TechnicianCreateFormData,
  ) => {
    setIsPending(true);

    try {
      const payload = {
        bio: data.bio,

        skills: data.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        yearsOfExperience: data.experience,

        availability,
      };

      const result =
        await createTechnicianProfile(payload);

      if (!result.success) {
        toast.error(result.message);

        if (result.errorDetails) {
          setFormErrors(
            result.errorDetails,
            setError,
          );
        }

        return;
      }

      toast.success(
        result.message ||
          "Technician profile created successfully.",
      );

      onSuccess?.();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Professional Information
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="bio">
              Professional Bio
            </Label>

            <Textarea
              id="bio"
              placeholder="Write a professional bio..."
              className="mt-2"
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

            {errors.skills && (
              <p className="mt-1 text-sm text-destructive">
                {errors.skills.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="experience">
              Years of Experience
            </Label>

            <Input
              id="experience"
              type="number"
              min="0"
              placeholder="5"
              className="mt-2"
              {...register("experience")}
            />

            {errors.experience && (
              <p className="mt-1 text-sm text-destructive">
                {errors.experience.message}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Availability belongs to CREATE only */}
      <TechnicianAvailabilityForm
        value={availability}
        onChange={setAvailability}
        submitMode="change"
      />

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
            ? "Creating..."
            : "Create Profile"}
        </Button>
      </div>
    </form>
  );
}