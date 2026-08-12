"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { toast } from "sonner";
import { ImageIcon, Loader2 } from "lucide-react";

import {
  createCategory,
  updateCategory,
} from "@/actions/admin.action";

import type { Category } from "@/types/category";

import { createCategorySchema } from "@/schema/category/category.schema";
import { TCreateCategoryFormData } from "@/types/category";

interface CategoryFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Category>;
  onSuccess?: () => void;
}

export function CategoryForm({
  mode,
  initialData,
  onSuccess,
}: CategoryFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TCreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),

    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const imageUrl = watch("imageUrl");

  /**
   * Check whether the entered value is a valid
   * absolute HTTP/HTTPS URL before passing it
   * to next/image.
   */
  const isValidImageUrl = (() => {
    if (!imageUrl?.trim()) {
      return false;
    }

    try {
      const url = new URL(imageUrl.trim());

      return (
        url.protocol === "http:" ||
        url.protocol === "https:"
      );
    } catch {
      return false;
    }
  })();

  const onSubmit = async (data: TCreateCategoryFormData) => {
    setIsPending(true);

    try {
      const result =
        mode === "create"
          ? await createCategory(data)
          : await updateCategory(initialData?.id as string, data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onSuccess?.();
    } catch (error) {
     
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-4 sm:p-6">
        <div className="space-y-5">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>

            <Input
              id="name"
              placeholder="e.g., Plumbing, Electrical"
              {...register("name")}
              aria-invalid={!!errors.name}
              aria-describedby={
                errors.name ? "name-error" : undefined
              }
            />

            {errors.name && (
              <p
                id="name-error"
                className="text-sm text-destructive"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description (Optional)
            </Label>

            <Textarea
              id="description"
              placeholder="Describe the category..."
              className="min-h-28 resize-y"
              {...register("description")}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description
                  ? "description-error"
                  : undefined
              }
            />

            {errors.description && (
              <p
                id="description-error"
                className="text-sm text-destructive"
              >
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category Image */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Category Image</Label>

            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/category-image.jpg"
              {...register("imageUrl", {
                onChange: () => {
                  setImageError(false);
                },
              })}
              aria-invalid={!!errors.imageUrl}
              aria-describedby={
                errors.imageUrl ? "imageUrl-error" : undefined
              }
            />

            {errors.imageUrl && (
              <p
                id="imageUrl-error"
                className="text-sm text-destructive"
              >
                {errors.imageUrl.message}
              </p>
            )}

            {/* Image Preview */}
            <div className="pt-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
                {isValidImageUrl && !imageError ? (
                  <Image
                    src={imageUrl.trim()}
                    alt="Category preview"
                    fill
                    sizes="
                      (max-width: 640px) 100vw,
                      (max-width: 1024px) 80vw,
                      640px
                    "
                    className="object-cover"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
                    <ImageIcon className="size-8 text-muted-foreground" />

                    <p className="text-sm text-muted-foreground">
                      {imageError
                        ? "Unable to load this image"
                        : imageUrl?.trim()
                          ? "Enter a valid image URL"
                          : "Image preview will appear here"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full gap-2 sm:w-auto"
        >
          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          {mode === "create"
            ? "Create Category"
            : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}