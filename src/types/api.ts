// Common API Response Types

export type ActionResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
  errorDetails?: Array<{
    field?: string
    message: string
  }>
}

// Entity Types

export type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN"

export type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"

export type UserStatus = "ACTIVE" | "BANNED"

export type TechnicianVerificationStatus = "PENDING" | "VERIFIED" | "UNVERIFIED" | "REJECTED"

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  createdAt: string
  updatedAt: string
  phone?: string
  country?: string
  profilePicture?: string
}

export interface TechnicianProfile {
  id: string
  userId: string
  bio: string
  skills: string[]
  experience: string
  hourlyRate?: number
  verificationStatus: TechnicianVerificationStatus
  availability?: {
    monday?: { start: string; end: string }
    tuesday?: { start: string; end: string }
    wednesday?: { start: string; end: string }
    thursday?: { start: string; end: string }
    friday?: { start: string; end: string }
    saturday?: { start: string; end: string }
    sunday?: { start: string; end: string }
  }
  profilePicture?: string
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  categoryId: string
  technicianId: string
  title: string
  description: string
  price: number
  currency: string
  isAvailable: boolean
  thumbnailImage?: string
  galleryImages?: string[]
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  customerId: string
  technicianId: string
  serviceId: string
  status: BookingStatus
  scheduledAt: string
  notes?: string
  price: number
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  bookingId: string
  customerId: string
  technicianId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  currency: string
  status: PaymentStatus
  paymentMethod?: string
  createdAt: string
  updatedAt: string
}
