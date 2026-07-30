export type PaymentStatus = "SUCCEEDED" | "PENDING" | "FAILED" | "CANCELED";

export type Payment = {
  id: string;
  transactionId: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  provider: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};

export type PaymentResponse = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: Payment[];
};