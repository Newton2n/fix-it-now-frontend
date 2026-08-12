import { z } from "zod";
export interface ServiceItem {
  id: string;
  categoryId: string;
  technicianId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  thumbnailImage: string | null;
  galleryImages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceMeta {
  currentPage: number;
  limit: number;
  totalRow: number;
  totalPage: number;
}

export interface ServiceResult {
  meta: ServiceMeta;
  data: ServiceItem[];
}

export interface ServicesResponse {
  success: boolean;
  message: string;
  data: {
    result: ServiceResult;
  };
}

export const createServiceSchema = z.object({
  categoryId: z.uuid("Invalid category ID"),
  title: z
    .string()
    .min(3, "title must be at least 3 letters long")
    .max(100, "title must be less than 101 letters"),
  description: z
    .string()
    .min(6, "Description must be at least 6 letters long")
    .max(255, "description must be less than 255 letters")
    .optional(),
  price: z.number().min(0, "Price should be positive value"),
  currency: z.enum(["USD"]).optional(),
  isAvailable: z.boolean().optional(),
  thumbnailImage: z.url().min(1, "Valid url required").optional(),
  galleryImages: z.array(z.url({ error: "Valid url required" })).optional(),
});

export const updateServiceSchema = z.object({
  title: z
    .string()
    .min(3, "title must be at least 3 letters long")
    .max(100, "title must be less than 101 letters")
    .optional(),
  description: z
    .string()
    .min(6, "Description must be at least 6 letters long")
    .max(255, "description must be less than 255 letters")
    .optional(),
  price: z.number().min(0, "Price should be positive value").optional(),
  currency: z.enum(["USD"]).optional(),
  isAvailable: z.boolean().optional(),
  thumbnailImage: z.url().min(1, "Valid url required").optional(),
  galleryImages: z.array(z.url({ error: "Valid url required" })).optional(),
});




export const ServiceSearchFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  categoryId: z.uuid().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  isAvailable: z.string().optional(),
  sortBy: z.enum(["price", "date"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});



export type ServiceSearchFilters = z.infer<typeof ServiceSearchFiltersSchema>;
