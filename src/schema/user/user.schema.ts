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

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
