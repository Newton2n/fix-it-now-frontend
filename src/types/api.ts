// Common API Response Types

export type ActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errorDetails?: Array<{
    field?: string;
    message: string;
  }>;
};

export type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  country?: string;
  profilePicture?: string;
}

export interface Service {
  id: string;
  categoryId: string;
  technicianId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  thumbnailImage?: string;
  galleryImages?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  location: string;
  customerNote?: string;
  status: BookingStatus;
  scheduledAt: string;
  notes?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  review: Review | null;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  rating: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}
