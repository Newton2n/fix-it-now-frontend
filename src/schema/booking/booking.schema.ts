import { z } from "zod";
export const UserBookingSearchSchema = z.object({
  status: z
    .enum([
      "ACCEPTED",
      "CANCELED",
      "COMPLETED",
      "DECLINED",
      "PAID",
      "IN_PROGRESS",
      "REQUESTED",
    ])
    .optional(),
  serviceId: z.string().uuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(15),
  sortBy: z.enum(["scheduledAt", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  paymentStatus: z.enum(["PENDING", "FAILED", "SUCCEEDED"]).optional(),
});

export type UserBookingSearchParams = z.infer<typeof UserBookingSearchSchema>;

export type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "CANCELED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED";

export type Booking = {
  id: string;
  customerId: string;
  serviceId: string;
  status: BookingStatus;
  scheduledAt: string;
  location: string;
  customerNote: string;
  createdAt: string;
  updatedAt: string;
};

export type BookingResponse = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: Booking[];
};
