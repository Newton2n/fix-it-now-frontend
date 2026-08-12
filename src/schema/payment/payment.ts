import { z } from "zod";

export const PaymentSearchSchema = z.object({
  transactionId: z.string().optional(),
  status: z.enum(["FAILED", "PENDING", "SUCCEEDED"]).optional(),
  provider: z.enum(["SSLCOMMERZ", "STRIPE"]).optional(),
  minAmount: z.coerce.number().positive().optional(),
  maxAmount: z.coerce.number().positive().optional(),
  sortBy: z.enum(["amount", "createdAt", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});

export type PaymentSearchParams = z.infer<typeof PaymentSearchSchema>;
