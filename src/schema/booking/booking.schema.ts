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