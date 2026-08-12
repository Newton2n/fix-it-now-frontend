import { z } from "zod";

export type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type TechnicianStatus = "PENDING_APPROVAL" | "VERIFIED" | "SUSPENDED";

export type CategoryInput = {
  name: string;
  description: string;
};

export type UserStatusInput = {
  status: UserStatus;
};

export type TechnicianStatusInput = {
  status: TechnicianStatus;
};

export type AdminResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errorDetails?: unknown[];
};
export type CategoryApiResponse = {
  success: boolean;
  message: string;
  data: {
    result: {
      meta: {
        currentPage: number;
        limit: number;
        totalRow: number;
        totalPage: number;
      };
      data: Category[];
    };
  };
};

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, "category name must be at least 3 letters long")
    .max(100, "category name must be less than 101 letters"),
  description: z
    .string()
    .min(6, "Description must be at least 6 letters long")
    .max(255, "description  must be less than 101 letters"),
  
});
export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(3, "category name must be at least 3 letters long")
    .max(100, "category name must be less than 101 letters")
    .optional(),
  description: z
    .string()
    .min(6, "Description must be at least 10 letters long")
    .max(255, "description  must be less than 101 letters")
    .optional(),
});


export const CategorySearchSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  sortBy: z.enum(["name", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CategorySearchParams = z.infer<typeof CategorySearchSchema>;