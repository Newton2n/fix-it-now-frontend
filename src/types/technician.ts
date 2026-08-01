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
