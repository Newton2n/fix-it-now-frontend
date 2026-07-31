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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createService, updateService } from "@/actions/service.action"
import type { Service, Category } from "@/types/api"
import { setFormErrors, priceSchema } from "@/lib/form-utils"

const serviceSchema = z.object({
  title: z
    .string()
    .min(3, "Service title must be at least 3 characters")
    .max(100, "Service title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  price: priceSchema,
  currency: z.string().default("USD"),
  isAvailable: z.boolean().default(true),
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  mode: "create" | "edit"
  initialData?: Partial<Service>
  categories: Category[]
  onSuccess?: () => void
}

export function ServiceForm({
  mode,
  initialData,
  categories,
  onSuccess,
}: ServiceFormProps) {
  const [isPending, setIsPending] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      categoryId: initialData?.categoryId || "",
      price: initialData?.price || undefined,
      currency: initialData?.currency || "USD",
      isAvailable: initialData?.isAvailable ?? true,
    },
  })

  const isAvailable = watch("isAvailable")

  const onSubmit = async (data: ServiceFormData) => {
    setIsPending(true)
    try {
      const result =
        mode === "create"
          ? await createService(data)
          : await updateService(initialData?.id || "", data)

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
      {/* Service Information */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Service Information</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Service Title</Label>
            <Input
              id="title"
              placeholder="e.g., Plumbing Installation"
              className="mt-2"
              {...register("title")}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p id="title-error" className="mt-1 text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your service in detail..."
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Select
                defaultValue={initialData?.categoryId || ""}
                onValueChange={(value) => setValue("categoryId", value)}
              >
                <SelectTrigger id="categoryId" className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <div className="mt-2 flex items-center">
                <span className="text-muted-foreground">$</span>
                <Input
                  id="price"
                  type="number"
                  placeholder="99.99"
                  className="ml-2"
                  step="0.01"
                  {...register("price", {
                    valueAsNumber: true,
                  })}
                  aria-invalid={!!errors.price}
                  aria-describedby={errors.price ? "price-error" : undefined}
                />
              </div>
              {errors.price && (
                <p id="price-error" className="mt-1 text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Availability */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Availability</h3>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isAvailable"
            checked={isAvailable}
            onChange={(e) => setValue("isAvailable", e.target.checked)}
            className="h-4 w-4 rounded border"
          />
          <Label htmlFor="isAvailable" className="cursor-pointer">
            This service is available
          </Label>
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
          {mode === "create" ? "Create Service" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
