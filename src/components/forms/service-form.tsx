"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ImageIcon } from "lucide-react";

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

import {
  createService,
  updateService,
} from "@/actions/service.action";

import type { Service } from "@/types/api";
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

const fallbackImage =
  "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=1200&auto=format&fit=crop&q=85";

// Helper function to validate if a string is a valid URL
const isValidUrl = (urlString: string) => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

export function ServiceForm({
  mode,
  initialData,
  categories,
  onSuccess,
}: ServiceFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [imageError, setImageError] = useState(false);

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
  const thumbnailImage = watch("thumbnailImage");

  const trimmedUrl = thumbnailImage?.trim() || "";
  const previewImage =
    trimmedUrl && !imageError && isValidUrl(trimmedUrl)
      ? trimmedUrl
      : fallbackImage;

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-none space-y-6"
    >
      <Card className="w-full p-4 sm:p-6 md:p-7 lg:p-8 xl:p-9 2xl:p-10">
        <div className="mb-6">
          <h3 className="text-lg font-semibold sm:text-xl">
            Service Information
          </h3>

          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Add the main details for this service.
          </p>
        </div>

        <div className="space-y-6">
          <Field
            label="Service Title"
            error={errors.title?.message}
          >
            <Input
              id="title"
              placeholder="e.g., Plumbing Installation"
              className="h-11 sm:h-12"
              {...register("title")}
            />
          </Field>

          <Field
            label="Description"
            error={errors.description?.message}
          >
            <Textarea
              id="description"
              placeholder="Describe your service in detail..."
              className="min-h-32 resize-y sm:min-h-36"
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
              className="h-11 sm:h-12"
              {...register("thumbnailImage", {
                onChange: () => setImageError(false),
              })}
            />

            <div className="mt-3 overflow-hidden rounded-xl border bg-muted/30">
              <div className="relative aspect-video w-full">
                {trimmedUrl && isValidUrl(trimmedUrl) ? (
                  <Image
                    key={previewImage}
                    src={previewImage}
                    alt="Service thumbnail preview"
                    fill
                    sizes="
                      (max-width: 640px) 100vw,
                      (max-width: 1024px) 90vw,
                      (max-width: 1536px) 70vw,
                      1200px
                    "
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-muted-foreground">
                    <ImageIcon className="size-8" />
                    
                    {/* Added dynamic text check here */}
                    <span className="text-sm">
                      {trimmedUrl && !isValidUrl(trimmedUrl) 
                        ? "Invalid URL format. Please enter a valid web address." 
                        : "Image preview will appear here"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field
              label="Category"
              error={errors.categoryId?.message}
            >
              <Select
                value={watch("categoryId")}
                onValueChange={(value) =>
                  setValue("categoryId", value, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-11 w-full sm:h-12">
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

            <Field
              label="Price $"
              error={errors.price?.message}
            >
              <Input
                id="price"
                type="number"
                placeholder="99"
                step="1"
                className="h-11 sm:h-12"
                {...register("price", {
                  valueAsNumber: true,
                })}
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card className="w-full p-4 sm:p-6 md:p-7 lg:p-8 xl:p-9 2xl:p-10">
        <div className="mb-5">
          <h3 className="text-lg font-semibold sm:text-xl">
            Availability
          </h3>

          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Choose whether customers can book this service.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="isAvailable"
            checked={isAvailable}
            onCheckedChange={(checked) =>
              setValue("isAvailable", checked === true, {
                shouldValidate: true,
              })
            }
            className="mt-0.5 cursor-pointer"
          />

          <Label
            htmlFor="isAvailable"
            className="cursor-pointer text-sm leading-5 sm:text-base"
          >
            This service is available for booking
          </Label>
        </div>
      </Card>

      <div className="flex w-full justify-start">
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 cursor-pointer gap-2 sm:h-11"
        >
          {isPending && (
            <Loader2 className="size-4 animate-spin" />
          )}

          {mode === "create"
            ? "Create Service"
            : "Save Changes"}
        </Button>
      </div>
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
    <div className="w-full space-y-2">
      <Label className="text-sm font-medium sm:text-base">
        {label}
      </Label>

      {children}

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}