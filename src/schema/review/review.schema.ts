import { z } from "zod";
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Minimum 1 rating needed")
    .max(5, "Maximum 5 star rating"),
  description: z
    .string()
    .min(5, "Description must be at least 5 letters long")
    .max(255, "description  must be less than 101 letters")
    .optional(),
});

export const UserReviewSearchSchema = z.object({
  serviceId: z.string().uuid().optional(),
  minRating: z.coerce.number().int().min(1).max(5).optional(),
  maxRating: z.coerce.number().int().min(1).max(5).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  sortBy: z.enum(["rating", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type UserReviewSearchParams = z.infer<typeof UserReviewSearchSchema>;
