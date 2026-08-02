"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createService, updateService } from "@/actions/service.action";
import type { Service} from "@/types/api";
import { setFormErrors } from "@/lib/form-utils";
import { createServiceSchema } from "@/schema/service/service.schema";
import { Category } from "@/types/category";

type ServiceFormData = z.infer<typeof createServiceSchema>;

interface ServiceFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Service>;
  categories: Category[];
  onSuccess?: () => void | Promise<void>;
}

export function ServiceForm({
  mode,
  initialData,
  categories,
  onSuccess,
}: ServiceFormProps) {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      categoryId: initialData?.categoryId || "",
      price: initialData?.price ?? 0,
      currency: "USD",
      isAvailable: initialData?.isAvailable ?? true,
      thumbnailImage: initialData?.thumbnailImage || "",
    },
  });

  const isAvailable = watch("isAvailable");

  const onSubmit = async (data: ServiceFormData) => {
    setIsPending(true);
    try {
      const payload = {
        ...data,
        thumbnailImage: data.thumbnailImage?.trim() || undefined,
      };

      const result =
        mode === "create"
          ? await createService(payload)
          : await updateService(initialData?.id || "", payload);

      if (!result.success) {
        toast.error(result.message || "Something went wrong.");
        if (result.errorDetails) {
          setFormErrors(result.errorDetails, setError);
        }
        return;
      }

      toast.success(result.message || "Saved successfully.");
      await onSuccess?.();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold">Service Information</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add the main details for this service.
          </p>
        </div>

        <div className="space-y-5">
          <Field label="Service Title" error={errors.title?.message}>
            <Input
              id="title"
              placeholder="e.g., Plumbing Installation"
              {...register("title")}
            />
          </Field>

          <Field label="Description" error={errors.description?.message}>
            <Textarea
              id="description"
              placeholder="Describe your service in detail..."
              className="min-h-32"
              {...register("description")}
            />
          </Field>

          <Field
            label="Thumbnail Image URL (Use Unsplash image please)"
            error={errors.thumbnailImage?.message}
          >
            <Input
              id="thumbnailImage"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register("thumbnailImage")}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Category" error={errors.categoryId?.message}>
              <Select
                value={watch("categoryId")}
                onValueChange={(value) =>
                  setValue("categoryId", value, { shouldValidate: true })
                }
              >
                <SelectTrigger>
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
            </Field>

            <Field label="Price $" error={errors.price?.message}>
              <Input
                id="price"
                type="number"
                placeholder="99"
                step="1"
                {...register("price", { valueAsNumber: true })}
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Availability</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose whether customers can book this service.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="isAvailable"
            checked={isAvailable}
            onCheckedChange={(checked) =>
              setValue("isAvailable", checked === true)
            }
          />
          <Label htmlFor="isAvailable" className="cursor-pointer">
            This service is available for booking
          </Label>
        </div>
      </Card>

      <Button type="submit" disabled={isPending} className="gap-2">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {mode === "create" ? "Create Service" : "Save Changes"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}