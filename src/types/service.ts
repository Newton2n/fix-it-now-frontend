import { createServiceSchema, updateServiceSchema } from "@/schema/service/service.schema";
import { z } from "zod";

export type TCreateService = z.infer<typeof createServiceSchema>;
export type TUpdateService = z.infer<typeof updateServiceSchema>;
