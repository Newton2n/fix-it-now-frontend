import { z } from "zod";

export const userUpdateSchema = z.object({
  name: z.string().min(3, "Minimum 3 character required").optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(["CUSTOMER", "TECHNICIAN"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  country: z.string().optional(),
  profilePicture: z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .refine(
      (value) =>
        value === undefined || z.string().url().safeParse(value).success,
      {
        message: "Invalid image URL layout",
      },
    )
    .optional(),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters long"),

  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
});


export const UserSearchSchema = z.object({
  search: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.email().optional(),
  role: z
    .enum(["ADMIN", "TECHNICIAN", "CUSTOMER"])
    .optional(),
  status: z
    .enum([
      "ACTIVE",
      "BLOCKED",
      "INACTIVE",
    ])
    .optional(),
  country: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  sortBy: z.enum(["name", "role", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type UserSearchParams = z.infer<typeof UserSearchSchema>;

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
