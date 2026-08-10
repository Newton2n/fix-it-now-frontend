import { updatePasswordSchema, userUpdateSchema } from "@/schema/user/user.schema";
import { z } from "zod";

export type TUpdateUser = z.infer<typeof userUpdateSchema>;

export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
export type Status = "ACTIVE" | "INACTIVE";

export type UserProfile = {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string;
  role: Role;
  status: Status;
  country: string | null;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
};
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;