export type AvailabilitySlot = {
  start: string;
  end: string;
};

export type TechnicianAvailability = {
  sunday?: AvailabilitySlot;
  monday?: AvailabilitySlot;
  tuesday?: AvailabilitySlot;
  wednesday?: AvailabilitySlot;
  thursday?: AvailabilitySlot;
  friday?: AvailabilitySlot;
  saturday?: AvailabilitySlot;
};

export type Service = {
  id: string;
  categoryId: string;
  technicianId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  thumbnailImage: string | null;
  galleryImages: string[];
  createdAt: string;
  updatedAt: string;
};

export type TechnicianProfile = {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  isAvailable: boolean;
  yearsOfExperience: string;
  availability: TechnicianAvailability;
  status: string;
  serviceArea: string[];
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string;
  role: string;
  status: string;
  country: string | null;
  profilePicture: string | null;
};

export type CreateBookingPayload = {
  serviceId: string;
  scheduledAt: string;
  location: string;
  customerNote: string;
};

export type BookedSlot = {
  scheduledAt: string;
};

export type AvailabilityTime = {
  start: string;
  end: string;
};

export type TechnicianService = Service;

export type BookingDetailsService = {
  id: string;
  categoryId: string;
  technicianId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  thumbnailImage: string;
  galleryImages: string[];
  createdAt: string;
  updatedAt: string;
};

export type BookingDetails = {
  id: string;
  customerId: string;
  serviceId: string;
  status: string;
  scheduledAt: string;
  location: string;
  customerNote: string | null;
  createdAt: string;
  updatedAt: string;
  service: BookingDetailsService;
};

export type GetBookingDetailsResponse = {
  booking: BookingDetails;
};
