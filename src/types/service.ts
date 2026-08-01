import { createServiceSchema } from "@/schema/service/service.schema";
import { z } from "zod";

export type TCreateService = z.infer<typeof createServiceSchema>;
