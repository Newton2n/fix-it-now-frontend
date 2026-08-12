import { z } from "zod";

const daySchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const technicianRegisterSchema = z.object({
  bio: z.string().min(10, "Minimum 10 character required").optional(),
  skills: z.array(z.string({ error: "Skills must be strings" })),
  yearsOfExperience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(100),
  availability: z.object({
    monday: daySchema.optional(),
    tuesday: daySchema.optional(),
    wednesday: daySchema.optional(),
    thursday: daySchema.optional(),
    friday: daySchema.optional(),
    saturday: daySchema.optional(),
    sunday: daySchema.optional(),
  }),
  serviceArea: z.array(z.string({ error: "Service areas must be strings" })),
});

export const technicianCreateSchemaWithoutAvailability = z.object({
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),
  skills: z.string().min(1, "Please add at least one skill"),
  serviceArea: z.string().min(1, "Please add at least one service area"),
  yearsOfExperience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(100),
});

export const changeAvailabilityPayload = z.object({
  availability: z.object({
    monday: daySchema.optional(),
    tuesday: daySchema.optional(),
    wednesday: daySchema.optional(),
    thursday: daySchema.optional(),
    friday: daySchema.optional(),
    saturday: daySchema.optional(),
    sunday: daySchema.optional(),
  }),
});

export const GetTechniciansSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  minExperience: z.coerce.number().optional(),
  isAvailable: z.string().optional(),
  status: z.enum(["PENDING_APPROVAL", "SUSPENDED", "VERIFIED"]),
  skills: z.string().optional(),
  serviceArea: z.string().optional(),
  sortBy: z.enum(["experience", "date"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type TechnicianSearchParams = z.infer<typeof GetTechniciansSchema>;
