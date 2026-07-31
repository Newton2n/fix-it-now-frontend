"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import {
  createTechnicianProfile,
  updateTechnicianProfile,
} from "@/actions/technician.action"
import type { TechnicianProfile } from "@/types/api"
import { setFormErrors } from "@/lib/form-utils"

const technicianProfileSchema = z.object({
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),
  skills: z
    .string()
    .min(1, "Please add at least one skill")
    .transform((val) => val.split(",").map((s) => s.trim())),
  experience: z
    .string()
    .min(1, "Experience information is required")
    .max(200, "Experience must be less than 200 characters"),
  hourlyRate: z
    .number()
    .positive("Hourly rate must be greater than 0")
    .optional()
    .or(z.literal("")),
})

type TechnicianProfileFormData = z.infer<typeof technicianProfileSchema>

interface TechnicianProfileFormProps {
  mode: "create" | "edit"
  initialData?: Partial<TechnicianProfile>
  onSuccess?: () => void
}

export function TechnicianProfileForm({
  mode,
  initialData,
  onSuccess,
}: TechnicianProfileFormProps) {
  const [isPending, setIsPending] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TechnicianProfileFormData>({
    resolver: zodResolver(technicianProfileSchema),
    defaultValues: {
      bio: initialData?.bio || "",
      skills: initialData?.skills?.join(", ") || "",
      experience: initialData?.experience || "",
      hourlyRate: initialData?.hourlyRate || undefined,
    },
  })

  const onSubmit = async (data: TechnicianProfileFormData) => {
    setIsPending(true)
    try {
      const result =
        mode === "create"
          ? await createTechnicianProfile(data)
          : await updateTechnicianProfile(data)

      if (!result.success) {
        toast.error(result.message)
        if (result.errorDetails) {
          setFormErrors(result.errorDetails, setError)
        }
        return
      }

      toast.success(result.message)
      onSuccess?.()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Professional Information Section */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Professional Information</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              placeholder="Write a compelling bio about your professional background..."
              className="mt-2"
              {...register("bio")}
              aria-invalid={!!errors.bio}
              aria-describedby={errors.bio ? "bio-error" : undefined}
            />
            {errors.bio && (
              <p id="bio-error" className="mt-1 text-sm text-destructive">
                {errors.bio.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              placeholder="e.g., Plumbing, Electrical, HVAC"
              className="mt-2"
              {...register("skills")}
              aria-invalid={!!errors.skills}
              aria-describedby={errors.skills ? "skills-error" : undefined}
            />
            {errors.skills && (
              <p id="skills-error" className="mt-1 text-sm text-destructive">
                {errors.skills.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="experience">Experience</Label>
            <Input
              id="experience"
              placeholder="e.g., 5 years in residential plumbing"
              className="mt-2"
              {...register("experience")}
              aria-invalid={!!errors.experience}
              aria-describedby={
                errors.experience ? "experience-error" : undefined
              }
            />
            {errors.experience && (
              <p
                id="experience-error"
                className="mt-1 text-sm text-destructive"
              >
                {errors.experience.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="hourlyRate">Hourly Rate (Optional)</Label>
            <div className="mt-2 flex items-center">
              <span className="text-muted-foreground">$</span>
              <Input
                id="hourlyRate"
                type="number"
                placeholder="50"
                className="ml-2"
                step="0.01"
                {...register("hourlyRate", {
                  valueAsNumber: true,
                })}
                aria-invalid={!!errors.hourlyRate}
                aria-describedby={
                  errors.hourlyRate ? "hourlyRate-error" : undefined
                }
              />
              <span className="ml-2 text-muted-foreground">/hour</span>
            </div>
            {errors.hourlyRate && (
              <p id="hourlyRate-error" className="mt-1 text-sm text-destructive">
                {errors.hourlyRate.message}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="gap-2"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Profile" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
