
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


export type CreateCheckoutResponse = {
  success: boolean;
  message: string;
  data?: {
    checkoutUrl: string;
  };
  errorDetails?: unknown[];
};



export type PaymentStatus =
  | "PENDING"
  | "SUCCEEDED"
  | "FAILED";

export type PaymentDetails = {
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

export type PaymentDetailsResponse = {
  success: boolean;
  message: string;
  data?: {
    result: PaymentDetails;
  };
  errorDetails?: unknown[];
};