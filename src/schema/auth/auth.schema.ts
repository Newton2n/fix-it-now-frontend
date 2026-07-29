import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(3, "Minimum 3 characters required."),

    email: z.email("Invalid email address."),

    role: z.enum(["CUSTOMER", "TECHNICIAN"], {
      message: "Please select a valid role.",
    }),

    password: z.string().min(6, "Password must be at least 6 characters long."),

    confirmPassword: z.string().min(6, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type TRegistrationFormData = z.infer<typeof RegisterSchema>;

export type TLoginFormData = z.infer<typeof LoginSchema>;
