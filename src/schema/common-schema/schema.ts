// import { z } from "zod";
// // Common validation schemas

// export const passwordSchema = z
//   .string()
//   .min(8, "Password must be at least 8 characters")
//   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//   .regex(/[0-9]/, "Password must contain at least one number");

// export const emailSchema = z.email("Invalid email address");

// export const phoneSchema = z
//   .string()
//   .regex(
//     /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
//     "Invalid phone number",
//   )
//   .optional()
//   .or(z.literal(""));

// export const urlSchema = z.url("Invalid URL").optional().or(z.literal(""));

// export const priceSchema = z
//   .number()
//   .positive("Price must be greater than 0")
//   .or(
//     z
//       .string()
//       .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
//       .transform(Number),
//   );

// export const ratingSchema = z
//   .number()
//   .min(1, "Rating must be at least 1")
//   .max(5, "Rating must be at most 5");
