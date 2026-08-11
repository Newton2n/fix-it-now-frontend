import {
  updatePasswordSchema,
  userUpdateSchema,
} from "@/schema/user/user.schema";
import { z } from "zod";

export type TUpdateUser = z.infer<typeof userUpdateSchema>;

export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
export type Status = "ACTIVE" | "INACTIVE";
export type AuthProvider = "GOOGLE" | "CREDENTIAL";

export type UserProfile = {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string;
  role: Role;
  status: Status;
  country: string | null;
  profilePicture: string | null;
  authProvider: AuthProvider;
  needPasswordChange :boolean,
  emailVerified : boolean,
  createdAt: string;
  updatedAt: string;
};
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
