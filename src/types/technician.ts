import {
  changeAvailabilityPayload,
  technicianRegisterSchema,
} from "@/schema/technician/technician.schema";
import { z } from "zod";
export type AvailabilityDay = {
  start: string;
  end: string;
};

export type TCreateTechnicianProfile = z.infer<typeof technicianRegisterSchema>;
export type TChangeAvailabilityPayload = z.infer<
  typeof changeAvailabilityPayload
>;

export type TechnicianVerificationStatus = "VERIFIED" | "PENDING" | "SUSPENDED";

export interface TechnicianProfile {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  isAvailable: boolean;
  yearsOfExperience: number;
  availability: {
    monday?: { start: string; end: string };
    tuesday?: { start: string; end: string };
    wednesday?: { start: string; end: string };
    thursday?: { start: string; end: string };
    friday?: { start: string; end: string };
    saturday?: { start: string; end: string };
    sunday?: { start: string; end: string };
  };
  status: TechnicianVerificationStatus;
  serviceArea: string[];
  createdAt: string;
  updatedAt: string;
}