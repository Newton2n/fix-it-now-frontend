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
  createCategory,
  updateCategory,
} from "@/actions/admin.action"
import type { Category } from "@/types/api"

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  mode: "create" | "edit"
  initialData?: Partial<Category>
  onSuccess?: () => void
}

export function CategoryForm({
  mode,
  initialData,
  onSuccess,
}: CategoryFormProps) {
  const [isPending, setIsPending] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  })

  const onSubmit = async (data: CategoryFormData) => {
    setIsPending(true)
    try {
      const result =
        mode === "create"
          ? await createCategory(data)
          : await updateCategory(initialData?.id || "", data)

      if (!result.success) {
        toast.error(result.message)
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
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              placeholder="e.g., Plumbing, Electrical"
              className="mt-2"
              {...register("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe the category..."
              className="mt-2"
              {...register("description")}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
            />
            {errors.description && (
              <p
                id="description-error"
                className="mt-1 text-sm text-destructive"
              >
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="gap-2"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Category" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
