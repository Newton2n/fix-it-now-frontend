import { createCategorySchema } from "@/schema/category/category.schema";
import { z } from "zod";

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}
export type TCreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type TUpdateCategoryFormData = Partial<TCreateCategoryFormData>;
